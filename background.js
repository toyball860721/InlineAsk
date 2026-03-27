// InlineAsk — Background Service Worker
// Handles all API calls to avoid CORS issues from content scripts

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['baseUrl', 'apiKey', 'defaultModel'], (r) => {
    if (!r.baseUrl) {
      chrome.storage.sync.set({ baseUrl: '', apiKey: '', defaultModel: '' });
    }
  });
});

// Message router
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === 'FETCH_MODELS') {
    handleFetchModels(message).then(sendResponse).catch(err =>
      sendResponse({ success: false, error: err.message })
    );
    return true;
  }

  if (message.type === 'TEST_CONNECTION') {
    handleTestConnection(message).then(sendResponse).catch(err =>
      sendResponse({ success: false, error: err.message })
    );
    return true;
  }

  if (message.type === 'CHAT_STREAM_START') {
    if (!sender.tab?.id) { sendResponse({ success: false, error: 'no tab' }); return false; }
    handleChatStream(sender.tab.id, message.payload);
    sendResponse({ success: true });
    return false;
  }

  if (message.type === 'GET_SETTINGS') {
    chrome.storage.sync.get(['baseUrl', 'apiKey', 'defaultModel', 'gatewayUrl', 'token'], (r) => {
      sendResponse({
        gatewayUrl:   r.baseUrl    || r.gatewayUrl   || '',
        token:        r.apiKey     || r.token         || '',
        defaultModel: r.defaultModel || '',
      });
    });
    return true;
  }

  if (message.type === 'SAVE_SETTINGS') {
    chrome.storage.sync.set(message.payload, () => sendResponse({ success: true }));
    return true;
  }

});

function buildChatUrl(baseUrl) {
  // If URL already ends with a completions path, use as-is
  if (/\/(chat\/completions|chatcompletion|completions)/.test(baseUrl)) return baseUrl;
  // Otherwise append standard OpenAI path
  return baseUrl.replace(/\/$/, '') + '/chat/completions';
}
async function handleFetchModels({ gatewayUrl, token }) {
  const url = gatewayUrl;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const resp = await fetch(url, { headers });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);

  const ct = resp.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    return { success: false, models: [], error: '该端点不返回 JSON，请手动输入模型名称' };
  }

  const data = await resp.json();
  const models = (data.data || data.models || []).map(m => ({
    id: m.id || m.name,
    name: m.name || m.id,
  }));
  return { success: true, models };
}

// ─── Test connection ───────────────────────────────────────────────────────────
async function handleTestConnection({ gatewayUrl, token, model }) {
  const url = buildChatUrl(gatewayUrl);
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const resp = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'hi' }],
      stream: false,
      max_tokens: 5,
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${txt.slice(0, 200)}`);
  }
  return { success: true };
}

// ─── Streaming chat completion ─────────────────────────────────────────────────
async function handleChatStream(tabId, payload) {
  const { gatewayUrl, token, model, messages, dialogId } = payload;
  const url = buildChatUrl(gatewayUrl);

  const sendChunk = (type, data) => {
    chrome.tabs.sendMessage(tabId, { type, dialogId, ...data }).catch(() => {});
  };

  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ model, messages, stream: true, max_tokens: 2000, temperature: 0.7 }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      sendChunk('STREAM_ERROR', { error: `HTTP ${resp.status}: ${errText.slice(0, 200)}` });
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        // SSE data line
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6).trim();
          if (jsonStr === '[DONE]') { sendChunk('STREAM_DONE', {}); return; }
          try {
            const parsed = JSON.parse(jsonStr);
            // Standard OpenAI format
            const content = parsed.choices?.[0]?.delta?.content
              || parsed.choices?.[0]?.message?.content
              || null;
            if (content) sendChunk('STREAM_CHUNK', { content });
            const finishReason = parsed.choices?.[0]?.finish_reason;
            if (finishReason === 'stop' || finishReason === 'length') {
              sendChunk('STREAM_DONE', {}); return;
            }
            // Surface API-level errors
            const errCode = parsed.base_resp?.status_code;
            if (errCode && errCode !== 0) {
              sendChunk('STREAM_ERROR', { error: `API error ${errCode}: ${parsed.base_resp.status_msg}` });
              return;
            }
          } catch (e) {
            console.warn('[InlineAsk] SSE parse error:', e.message, jsonStr.slice(0, 100));
          }
        } else if (trimmed.startsWith('{')) {
          // Non-SSE JSON response
          try {
            const parsed = JSON.parse(trimmed);
            const content = parsed.choices?.[0]?.message?.content || parsed.reply || null;
            if (content) sendChunk('STREAM_CHUNK', { content });
            sendChunk('STREAM_DONE', {}); return;
          } catch {}
        }
      }
    }

    sendChunk('STREAM_DONE', {});
  } catch (err) {
    sendChunk('STREAM_ERROR', { error: err.message });
  }
}
