// InlineAsk — Content Script
// Handles: selection detection, bubble UI, inline dialog, streaming responses

(function () {
  'use strict';

  // ─── State ────────────────────────────────────────────────────────────────
  let bubble = null;
  let lastSelectionInfo = null;
  let settings = { gatewayUrl: '', token: '', defaultModel: '' };
  let dialogs = {};
  let dialogCounter = 0;
  let contextInvalidated = false;

  // Safe wrapper — swallows all calls after extension reload
  function sendMsg(msg, cb) {
    if (contextInvalidated) return;
    try {
      chrome.runtime.sendMessage(msg, cb || (() => {}));
    } catch (e) {
      if (e.message?.includes('Extension context invalidated')) contextInvalidated = true;
    }
  }

  // ─── Init ─────────────────────────────────────────────────────────────────
  async function init() {
    await loadSettings();
    attachSelectionListener();
    attachStreamListener();
  }

  async function loadSettings() {
    return new Promise(resolve => {
      sendMsg({ type: 'GET_SETTINGS' }, result => {
        if (result) {
          settings.gatewayUrl   = result.gatewayUrl   || '';
          settings.token        = result.token        || '';
          settings.defaultModel = result.defaultModel || '';
        }
        resolve();
      });
    });
  }

  // ─── Stream message listener ──────────────────────────────────────────────
  function attachStreamListener() {
    chrome.runtime.onMessage.addListener((message) => {
      const { type, dialogId, content, error } = message;
      const dialog = dialogs[dialogId];
      if (!dialog) return;

      if (type === 'STREAM_CHUNK') {
        appendStreamChunk(dialog, content);
      } else if (type === 'STREAM_DONE') {
        finalizeStream(dialog);
      } else if (type === 'STREAM_ERROR') {
        showStreamError(dialog, error);
      }
    });
  }

  // ─── Selection detection ──────────────────────────────────────────────────
  function attachSelectionListener() {
    document.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('keyup', handleKeyUp, true);
    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('keydown', handleShortcut, true);
  }

  function handleShortcut(e) {
    // Cmd/Ctrl + Shift + A → open dialog for current selection
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'A') {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length >= 1) {
        e.preventDefault();
        e.stopPropagation();
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          lastSelectionInfo = { text, rect };
          hideBubble();
          openDialog(lastSelectionInfo);
        } catch {}
      }
    }
  }

  function handleMouseUp(e) {
    // Don't interfere with our own elements
    if (isOwnElement(e.target)) return;

    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length >= 8) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          lastSelectionInfo = { text, rect };
          showBubble(rect);
        } catch { /* no range */ }
      } else {
        if (!isOwnElement(e.target)) {
          hideBubble();
        }
      }
    }, 10);
  }

  function handleKeyUp(e) {
    if (isOwnElement(e.target)) return;
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length >= 8 && (e.shiftKey || e.key === 'End' || e.key === 'Home')) {
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        lastSelectionInfo = { text, rect };
        showBubble(rect);
      } catch {}
    }
  }

  function handleMouseDown(e) {
    if (isOwnElement(e.target)) return;
    hideBubble();
  }

  function isOwnElement(el) {
    return el?.closest?.('#cia-bubble, .cia-dialog');
  }

  // ─── Bubble ───────────────────────────────────────────────────────────────
  function showBubble(selectionRect) {
    hideBubble();

    bubble = document.createElement('div');
    bubble.id = 'cia-bubble';
    bubble.innerHTML = `
      <span class="cia-bubble-icon">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="7" cy="7" r="6.5" stroke="#f59e0b" stroke-width="1"/>
          <path d="M7 4.5V7.5M7 9V9.5" stroke="#f59e0b" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </span>
      <span>Ask</span>
    `;

    // Position above selection, centered
    const x = selectionRect.left + selectionRect.width / 2 - 28;
    const y = selectionRect.top - 40;
    const clampedX = Math.max(8, Math.min(x, window.innerWidth - 90));
    const clampedY = Math.max(8, y);

    bubble.style.left = clampedX + 'px';
    bubble.style.top = clampedY + 'px';

    bubble.addEventListener('click', (e) => {
      e.stopPropagation();
      if (lastSelectionInfo) {
        openDialog(lastSelectionInfo);
      }
      hideBubble();
    });

    document.body.appendChild(bubble);
  }

  function hideBubble() {
    if (bubble) {
      bubble.remove();
      bubble = null;
    }
  }

  // ─── Dialog ───────────────────────────────────────────────────────────────
  function openDialog(selectionInfo) {
    const id = `cia-dialog-${++dialogCounter}`;
    const el = buildDialog(id, selectionInfo);

    // Position near selection
    positionDialog(el, selectionInfo.rect);

    document.body.appendChild(el);
    const activeModel = settings.defaultModel || '';
    dialogs[id] = { el, messages: [], model: activeModel, isStreaming: false };

    // Focus textarea
    const textarea = el.querySelector('.cia-textarea');
    setTimeout(() => textarea?.focus(), 50);

    // Make draggable
    makeDraggable(el, el.querySelector('.cia-dialog-header'));

    return id;
  }

  function buildDialog(id, selectionInfo) {
    const el = document.createElement('div');
    el.className = 'cia-dialog';
    el.dataset.id = id;

    const quoteTruncated = selectionInfo.text.length > 200
      ? selectionInfo.text.slice(0, 200) + '…'
      : selectionInfo.text;

    const modelsHtml = buildModelOptions();

    el.innerHTML = `
      <div class="cia-drag-handle"></div>
      <div class="cia-dialog-header">
        <div class="cia-dialog-title">
          <span class="cia-lobster">🦞</span>
          <span>Inline Ask</span>
        </div>
        <div class="cia-header-right">
          <select class="cia-model-select" title="Select model">
            ${modelsHtml}
          </select>
          <button class="cia-close-btn" title="Close (solved!)">✕</button>
        </div>
      </div>
      <div class="cia-context-quote" data-raw="${escapeHtml(selectionInfo.text)}">
        <div class="cia-context-label">Selected context</div>
        ${escapeHtml(quoteTruncated)}
      </div>
      <div class="cia-messages">
        <div class="cia-empty">正在分析选中内容…</div>
      </div>
      <div class="cia-input-area">
        <textarea 
          class="cia-textarea" 
          placeholder="What's unclear? Ask here…"
          rows="1"
        ></textarea>
        <button class="cia-send-btn" title="Send (Enter)">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 8L2 2L5.5 8L2 14L14 8Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    `;

    // Wire up events
    const closeBtn = el.querySelector('.cia-close-btn');
    const textarea = el.querySelector('.cia-textarea');
    const sendBtn = el.querySelector('.cia-send-btn');
    const modelSelect = el.querySelector('.cia-model-select');

    closeBtn.addEventListener('click', () => closeDialog(id));

    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(id);
      }
    });

    textarea.addEventListener('input', () => {
      autoResize(textarea);
    });

    sendBtn.addEventListener('click', () => sendMessage(id));

    modelSelect.addEventListener('change', () => {
      if (dialogs[id]) dialogs[id].model = modelSelect.value;
    });

    // Set current model
    if (settings.defaultModel) {
      const option = modelSelect.querySelector(`option[value="${settings.defaultModel}"]`);
      if (option) option.selected = true;
      if (dialogs[id]) dialogs[id].model = settings.defaultModel;
    }

    return el;
  }

  function buildModelOptions() {
    const model = settings.defaultModel;
    if (model) {
      return `<option value="${escapeHtml(model)}">${escapeHtml(model)}</option>`;
    }
    return `<option value="">（未配置模型）</option>`;
  }

  function positionDialog(el, rect) {
    // Try to place right of selection, fallback below
    const pad = 16;
    const dialogW = 420;
    const dialogH = 360; // estimated

    let x = rect.right + pad;
    let y = rect.top;

    // If too far right, place below selection or left
    if (x + dialogW > window.innerWidth - pad) {
      x = rect.left - dialogW - pad;
    }
    if (x < pad) {
      x = rect.left;
      y = rect.bottom + pad;
    }

    // Clamp vertically
    y = Math.max(pad, Math.min(y, window.innerHeight - dialogH - pad));
    x = Math.max(pad, Math.min(x, window.innerWidth - dialogW - pad));

    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }

  function closeDialog(id) {
    const dialog = dialogs[id];
    if (!dialog) return;
    dialog.el.style.animation = 'none';
    dialog.el.style.opacity = '0';
    dialog.el.style.transform = 'scale(0.92)';
    dialog.el.style.transition = 'opacity 0.15s, transform 0.15s';
    setTimeout(() => {
      dialog.el.remove();
      delete dialogs[id];
    }, 150);
  }

  // ─── Auto-explain on open ─────────────────────────────────────────────────
  function autoExplain(dialogId) {
    const dialog = dialogs[dialogId];
    if (!dialog || dialog.isStreaming) return;

    const el = dialog.el;
    const contextEl = el.querySelector('.cia-context-quote');
    const selectedText = contextEl?.dataset.raw || contextEl?.textContent?.replace('Selected context', '').trim() || '';
    if (!selectedText) return;

    // Remove empty state placeholder
    const empty = el.querySelector('.cia-empty');
    if (empty) empty.remove();

    const userText = '请解释这段内容';
    const userMsg = { role: 'user', content: userText };
    dialog.messages.push(userMsg);
    appendMessageEl(el, 'user', userText);

    const model = dialog.model || settings.defaultModel || '';
    dialog.isStreaming = true;
    setSendLoading(el, true);

    const assistantEl = createAssistantMessageEl(el);
    dialog.currentAssistantEl = assistantEl;

    const apiMessages = [
      {
        role: 'system',
        content: `你是一个简洁的助手。用户选中了以下文本并希望你解释它：\n\n"${selectedText}"\n\n请用简洁清晰的语言解释这段内容的含义。`,
      },
      userMsg,
    ];

    sendMsg({
      type: 'CHAT_STREAM_START',
      payload: {
        gatewayUrl: settings.gatewayUrl,
        token: settings.token,
        model,
        messages: apiMessages,
        dialogId,
      },
    });
  }

  // ─── Messaging ────────────────────────────────────────────────────────────
  function sendMessage(dialogId) {
    const dialog = dialogs[dialogId];
    if (!dialog || dialog.isStreaming) return;

    const el = dialog.el;
    const textarea = el.querySelector('.cia-textarea');
    const text = textarea.value.trim();
    if (!text) return;

    textarea.value = '';
    autoResize(textarea);

    // Remove empty state
    const empty = el.querySelector('.cia-empty');
    if (empty) empty.remove();

    // Add user message
    const userMsg = { role: 'user', content: text };
    dialog.messages.push(userMsg);
    appendMessageEl(el, 'user', text);

    // Build messages for API (include context as system message)
    const contextEl = el.querySelector('.cia-context-quote');
    const context = contextEl?.dataset.raw || contextEl?.textContent?.replace('Selected context', '').trim() || '';
    const apiMessages = [
      {
        role: 'system',
        content: `You are a helpful assistant. The user selected the following text and has a question about it:\n\n"${context}"\n\nAnswer concisely and clearly. Focus on resolving their specific confusion.`,
      },
      ...dialog.messages,
    ];

    // Start streaming
    const model = dialog.model || settings.defaultModel || '';
    dialog.isStreaming = true;
    setSendLoading(el, true);

    // Create assistant message element (will be populated by chunks)
    const assistantEl = createAssistantMessageEl(el);
    dialog.currentAssistantEl = assistantEl;

    sendMsg({
      type: 'CHAT_STREAM_START',
      payload: {
        gatewayUrl: settings.gatewayUrl,
        token: settings.token,
        model,
        messages: apiMessages,
        dialogId,
      },
    });
  }

  // ─── Stream handlers ──────────────────────────────────────────────────────
  function appendStreamChunk(dialog, content) {
    const assistantEl = dialog.currentAssistantEl;
    if (!assistantEl) return;

    const textNode = assistantEl.querySelector('.cia-stream-text');
    const cursor = assistantEl.querySelector('.cia-cursor');

    if (textNode) {
      textNode.textContent += content;
      // Auto-scroll
      const messages = dialog.el.querySelector('.cia-messages');
      if (messages) messages.scrollTop = messages.scrollHeight;
    }
  }

  function finalizeStream(dialog) {
    dialog.isStreaming = false;
    setSendLoading(dialog.el, false);

    const assistantEl = dialog.currentAssistantEl;
    if (assistantEl) {
      const cursor = assistantEl.querySelector('.cia-cursor');
      if (cursor) cursor.remove();

      const textNode = assistantEl.querySelector('.cia-stream-text');
      if (textNode) {
        dialog.messages.push({ role: 'assistant', content: textNode.textContent });
      }
    }
    dialog.currentAssistantEl = null;

    // Refocus textarea
    const textarea = dialog.el.querySelector('.cia-textarea');
    textarea?.focus();
  }

  function showStreamError(dialog, error) {
    dialog.isStreaming = false;
    setSendLoading(dialog.el, false);

    const cursor = dialog.currentAssistantEl?.querySelector('.cia-cursor');
    if (cursor) cursor.remove();
    dialog.currentAssistantEl = null;

    const messages = dialog.el.querySelector('.cia-messages');
    if (messages) {
      const errEl = document.createElement('div');
      errEl.className = 'cia-error';
      errEl.innerHTML = `
        ⚠️ API Error: ${escapeHtml(error || 'Unknown error')}<br>
        <small style="opacity:0.6;font-size:11px;">Check your gateway URL and token in extension settings.</small>
      `;
      messages.appendChild(errEl);
      messages.scrollTop = messages.scrollHeight;
    }
  }

  // ─── DOM helpers ──────────────────────────────────────────────────────────
  function appendMessageEl(dialogEl, role, content) {
    const messages = dialogEl.querySelector('.cia-messages');
    if (!messages) return;

    const msg = document.createElement('div');
    msg.className = `cia-msg cia-msg-${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'cia-msg-bubble';
    bubble.textContent = content;
    msg.appendChild(bubble);
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function createAssistantMessageEl(dialogEl) {
    const messages = dialogEl.querySelector('.cia-messages');
    if (!messages) return null;

    const msg = document.createElement('div');
    msg.className = 'cia-msg cia-msg-assistant';

    const bubble = document.createElement('div');
    bubble.className = 'cia-msg-bubble';

    const textNode = document.createElement('span');
    textNode.className = 'cia-stream-text';
    textNode.textContent = '';

    const cursor = document.createElement('span');
    cursor.className = 'cia-cursor';

    bubble.appendChild(textNode);
    bubble.appendChild(cursor);
    msg.appendChild(bubble);
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;

    return msg;
  }

  function setSendLoading(dialogEl, loading) {
    const btn = dialogEl.querySelector('.cia-send-btn');
    const textarea = dialogEl.querySelector('.cia-textarea');
    if (!btn) return;

    btn.disabled = loading;
    textarea.disabled = loading;

    if (loading) {
      btn.innerHTML = '<div class="cia-spinner"></div>';
    } else {
      btn.innerHTML = `
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 8L2 2L5.5 8L2 14L14 8Z" fill="currentColor"/>
        </svg>
      `;
    }
  }

  function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  function makeDraggable(el, handle) {
    let startX, startY, startLeft, startTop;

    handle.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, select, input, textarea')) return;
      e.preventDefault();

      startX = e.clientX;
      startY = e.clientY;
      startLeft = el.offsetLeft;
      startTop = el.offsetTop;

      const onMove = (e) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        el.style.left = Math.max(0, Math.min(startLeft + dx, window.innerWidth - el.offsetWidth)) + 'px';
        el.style.top = Math.max(0, Math.min(startTop + dy, window.innerHeight - el.offsetHeight)) + 'px';
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ─── Listen for settings changes from popup ────────────────────────────────
  chrome.storage.onChanged.addListener((changes) => {
    // Support both new keys (baseUrl/apiKey) and legacy (gatewayUrl/token)
    if (changes.baseUrl)    settings.gatewayUrl = changes.baseUrl.newValue;
    if (changes.gatewayUrl) settings.gatewayUrl = changes.gatewayUrl.newValue;
    if (changes.apiKey)     settings.token = changes.apiKey.newValue;
    if (changes.token)      settings.token = changes.token.newValue;
    if (changes.defaultModel) {
      settings.defaultModel = changes.defaultModel.newValue;
    }
  });

  // ─── Boot ─────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
