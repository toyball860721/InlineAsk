# 🦞 InlineAsk

**Select any text. Ask AI. Right there. No tab switching.**

**划词即问。就在原地。不用切换标签页。**

[English](#-why-you-need-this) | [中文](#-为什么你需要它)

---

## 😤 The Problem / 痛点

You're reading a long article, documentation, or code review.

你正在阅读一篇长文、技术文档或代码审查。

You hit a sentence you don't understand.

你遇到了一句看不懂的话。

**What do you do?**

**你怎么办？**

```
Option A: Open a new tab → go to ChatGPT → copy the text → paste → wait →
          switch back → lose your place → repeat 50 times a day 😩

Option B: Ask at the bottom of the page chat → AI re-outputs everything
          you already know → wastes tokens → wastes time 💸

Option C: 🦞 Select the text → click Ask → get the answer → close → continue ✅
```

---

## ✨ Why You Need This

### Before InlineAsk

```
Reading article...
  ↓
"What does 'idempotent' mean?"
  ↓
Cmd+T → new tab → ChatGPT → type question → wait → read answer →
Cmd+W → back to article → WHERE WAS I? → scroll scroll scroll...
```

**Time wasted: ~2 minutes per question. 20 questions/day = 40 minutes gone.**

### After InlineAsk

```
Reading article...
  ↓
Select "idempotent" → 🦞 bubble appears → click
  ↓
Answer streams in right there → close → continue reading
```

**Time wasted: ~10 seconds. Same 20 questions = 3 minutes.**

---

## 🎬 How It Works

```
① Select any text on any webpage
   ┌─────────────────────────────────┐
   │  ...the function must be        │
   │  [idempotent] to ensure...      │  ← select this
   └─────────────────────────────────┘
                    ↓
② A bubble appears above your selection
   ┌──────────┐
   │ 🦞 Ask  │  ← click this
   └──────────┘
                    ↓
③ A dialog opens right there with context
   ┌─────────────────────────────────────┐
   │ 🦞 Inline Ask          [model] [✕] │
   │─────────────────────────────────────│
   │ Selected context                    │
   │ "idempotent to ensure..."           │
   │─────────────────────────────────────│
   │                                     │
   │  What does idempotent mean?         │
   │                                     │
   │  An idempotent operation produces   │
   │  the same result no matter how      │
   │  many times you call it. For        │
   │  example, HTTP GET is idempotent... │▌│
   │─────────────────────────────────────│
   │  [Ask a follow-up...          ] [▶] │
   └─────────────────────────────────────┘
                    ↓
④ Close → continue reading from exactly where you were
```

---

## ✨ Features / 功能

| Feature | Description |
|---------|-------------|
| 🌐 **Works everywhere** | Any webpage — docs, articles, GitHub, news, anything |
| ⚡ **Streaming** | Answers appear word by word, no waiting |
| 🔧 **Any AI API** | OpenAI, Claude, Qwen, MiniMax, local models — your choice |
| 🔒 **Private** | Your data goes directly to your API, nowhere else |
| 💬 **Multi-turn** | Ask follow-ups in the same dialog |
| 🖱️ **Draggable** | Move the dialog anywhere on screen |
| ⌨️ **Shortcut** | `Cmd/Ctrl + Shift + A` — no mouse needed |
| 🎨 **Dark UI** | Easy on the eyes, works on any background |

---

## 📦 Install / 安装

### Chrome / Edge (from source)

```bash
git clone https://github.com/YOUR_USERNAME/InlineAsk.git
```

1. Open `chrome://extensions`
2. Enable **Developer Mode** (top right)
3. Click **Load unpacked** → select the cloned folder
4. 🦞 appears in your toolbar

---

## ⚙️ Setup / 配置

Click the 🦞 icon → fill in your API:

| Field | Example |
|-------|---------|
| Base URL | `https://api.openai.com/v1` |
| Base URL (Qwen) | `https://coding.dashscope.aliyuncs.com/v1` |
| Base URL (MiniMax) | `https://api.minimaxi.com/v1/text/chatcompletion_v2` |
| Base URL (local) | `http://localhost:11434/v1` |
| API Key | `sk-...` (leave empty for local) |
| Model | `gpt-4o` / `qwen3-max` / `claude-sonnet-4-6` |

> **Smart URL detection**: Fill in just the base URL (e.g. `/v1`) and InlineAsk automatically appends `/chat/completions`. Or paste the full endpoint URL for non-standard APIs.

Hit **Test** to verify → **Save** (or it auto-saves as you type).

---

## 🚀 Usage / 使用

1. **Select text** on any webpage (8+ characters)
2. Click the **🦞 Ask** bubble that appears
3. Type your question → press **Enter**
4. Read the streaming answer
5. Ask follow-ups or press **✕** to close

**Keyboard shortcut**: Select text → `Cmd/Ctrl + Shift + A` → skip the bubble entirely

---

## 🌍 Compatible APIs / 兼容的 API

- ✅ OpenAI (`https://api.openai.com/v1`)
- ✅ Anthropic Claude (via compatible proxies)
- ✅ Alibaba Qwen / 通义千问 (`https://coding.dashscope.aliyuncs.com/v1`)
- ✅ MiniMax (`https://api.minimaxi.com/v1/text/chatcompletion_v2`)
- ✅ Ollama local (`http://localhost:11434/v1`)
- ✅ LM Studio (`http://localhost:1234/v1`)
- ✅ Any OpenAI-compatible API

---

## 💝 Support / 打赏

InlineAsk is free and open source. If it saves you time every day, consider buying me a coffee ☕

InlineAsk 完全免费开源。如果它每天帮你节省时间，请考虑请我喝杯咖啡 ☕

**Alipay / 支付宝:**

<img src="./alipay-qr.png" width="180" alt="Alipay QR / 支付宝收款码" />

*¥1, ¥5, ¥10 — any amount keeps the lobster fed and the code maintained 🦞*

*¥1、¥5、¥10 — 任何金额都能让龙虾吃饱、代码持续维护 🦞*

---

## 📝 License

MIT — free to use, fork, and modify.

---

*Built with ❤️ for developers who hate context switching.*

*为讨厌切换上下文的开发者而生。❤️*
