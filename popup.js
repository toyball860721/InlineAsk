// ClawInlineAsk — Popup Settings

document.addEventListener('DOMContentLoaded', () => {

const $ = id => document.getElementById(id);
const ui = {
  baseUrl:       $('baseUrl'),
  apiKey:        $('apiKey'),
  modelInput:    $('modelInput'),
  modelSelect:   $('modelSelect'),
  modelHint:     $('modelHint'),
  loadModelsBtn: $('loadModelsBtn'),
  testBtn:       $('testBtn'),
  saveBtn:       $('saveBtn'),
  status:        $('status'),
};

// ─── Load saved settings ───────────────────────────────────────────────────
chrome.storage.sync.get(['baseUrl', 'apiKey', 'defaultModel'], (r) => {
  if (chrome.runtime.lastError) return;
  ui.baseUrl.value    = r.baseUrl    || '';
  ui.apiKey.value     = r.apiKey     || '';
  ui.modelInput.value = r.defaultModel || '';
});

// ─── Load models from API ──────────────────────────────────────────────────
ui.loadModelsBtn.addEventListener('click', loadModels);

async function loadModels() {
  const baseUrl = ui.baseUrl.value.trim().replace(/\/$/, '');
  const apiKey  = ui.apiKey.value.trim();
  if (!baseUrl) { showStatus('error', 'Base URL 不能为空'); return; }

  ui.loadModelsBtn.textContent = '…';
  ui.loadModelsBtn.disabled = true;
  ui.modelHint.textContent = '';
  ui.modelSelect.style.display = 'none';

  try {
    const result = await new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage({ type: 'FETCH_MODELS', gatewayUrl: baseUrl, token: apiKey }, (res) => {
          if (chrome.runtime.lastError) return resolve(null);
          resolve(res);
        });
      } catch { resolve(null); }
    });

    if (result?.success && result.models?.length) {
      renderModelSelect(result.models);
      ui.modelHint.textContent = `✓ 找到 ${result.models.length} 个模型`;
      showStatus('success', `连接成功，${result.models.length} 个模型可用`);
    } else {
      ui.modelHint.textContent = result?.error || '未返回模型列表，请手动输入模型名称';
      showStatus('error', result?.error || '无法获取模型列表');
    }
  } catch (e) {
    showStatus('error', e.message);
  }

  ui.loadModelsBtn.textContent = 'Load';
  ui.loadModelsBtn.disabled = false;
}

function renderModelSelect(models) {
  const current = ui.modelInput.value.trim();
  ui.modelSelect.innerHTML = models.map(m =>
    `<option value="${esc(m.id)}" ${m.id === current ? 'selected' : ''}>${esc(m.name || m.id)}</option>`
  ).join('');
  ui.modelSelect.style.display = 'block';
  // Sync select → input
  if (!current && models.length) ui.modelInput.value = models[0].id;
  ui.modelSelect.addEventListener('change', () => {
    ui.modelInput.value = ui.modelSelect.value;
  });
}

// ─── Test connection ───────────────────────────────────────────────────────
ui.testBtn.addEventListener('click', async () => {
  const baseUrl = ui.baseUrl.value.trim().replace(/\/$/, '');
  const apiKey  = ui.apiKey.value.trim();
  const model   = ui.modelInput.value.trim();

  if (!baseUrl) { showStatus('error', 'Base URL 不能为空'); return; }
  if (!model)   { showStatus('error', '请填写模型名称'); return; }

  ui.testBtn.textContent = '…';
  ui.testBtn.disabled = true;

  try {
    const result = await new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage(
          { type: 'TEST_CONNECTION', gatewayUrl: baseUrl, token: apiKey, model },
          (res) => { if (chrome.runtime.lastError) return resolve({ success: false, error: chrome.runtime.lastError.message }); resolve(res); }
        );
      } catch (e) { resolve({ success: false, error: e.message }); }
    });

    if (result?.success) {
      showStatus('success', `✓ 连接正常，模型 ${model} 可用`);
    } else {
      showStatus('error', result?.error || '连接失败');
    }
  } catch (e) {
    showStatus('error', e.message);
  }

  ui.testBtn.textContent = 'Test 连接';
  ui.testBtn.disabled = false;
});

// ─── Save (manual button) ──────────────────────────────────────────────────
ui.saveBtn.addEventListener('click', () => saveSettings(true));

// ─── Auto-save on change ───────────────────────────────────────────────────
let autoSaveTimer = null;
function scheduleAutoSave() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => saveSettings(false), 800);
}
ui.baseUrl.addEventListener('input', scheduleAutoSave);
ui.apiKey.addEventListener('input', scheduleAutoSave);
ui.modelInput.addEventListener('input', scheduleAutoSave);

function saveSettings(showFeedback) {
  const baseUrl = ui.baseUrl.value.trim().replace(/\/$/, '');
  const apiKey  = ui.apiKey.value.trim();
  const model   = ui.modelInput.value.trim();

  if (!baseUrl) {
    if (showFeedback) showStatus('error', 'Base URL 不能为空');
    return;
  }

  try {
    chrome.storage.sync.set(
      { baseUrl, apiKey, defaultModel: model, gatewayUrl: baseUrl, token: apiKey },
      () => {
        if (chrome.runtime.lastError) { showStatus('error', chrome.runtime.lastError.message); return; }
        if (showFeedback) showStatus('success', '✓ 已保存');
      }
    );
  } catch (e) { showStatus('error', e.message); }
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function showStatus(type, msg) {
  ui.status.className = type;
  ui.status.textContent = msg;
  clearTimeout(ui.status._t);
  if (type === 'success') {
    ui.status._t = setTimeout(() => { ui.status.className = ''; ui.status.textContent = ''; }, 3000);
  }
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

}); // end DOMContentLoaded
