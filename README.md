# 🦞 InlineAsk

[English](#english) | [中文](#中文)

---

<a name="english"></a>

# English

**Select any text. Ask AI. Right there. No tab switching.**

---

## 😤 The Problem

You're reading a long article, documentation, or code review. You hit a sentence you don't understand.

**What do you do?**

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

**~2 minutes per question. 20 questions/day = 40 minutes gone.**

### After InlineAsk

```
Reading article...
  ↓
Select "idempotent" → 🦞 bubble appears → click
  ↓
Answer streams in right there → close → continue reading
```

**~10 seconds per question. Same 20 questions = 3 minutes.**

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
   ├─────────────────────────────────────┤
   │ Selected context                    │
   │ "idempotent to ensure..."           │
   ├─────────────────────────────────────┤
   │                                     │
   │  What does idempotent mean?         │
   │                                     │
   │  An idempotent operation produces   │
   │  the same result no matter how      │
   │  many times you call it...        ▌ │
   ├─────────────────────────────────────┤
   │  [Ask a follow-up...          ] [▶] │
   └─────────────────────────────────────┘
                    ↓
④ Close → continue reading from exactly where you were
```

---

## ✨ Features

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

## 📦 Install

```bash
git clone https://github.com/toyball860721/InlineAsk.git
```

1. Open `chrome://extensions`
2. Enable **Developer Mode** (top right toggle)
3. Click **Load unpacked** → select the cloned folder
4. 🦞 appears in your toolbar

---

## ⚙️ Setup

Click the 🦞 icon → fill in your API details:

| Field | Example |
|-------|---------|
| Base URL | `https://api.openai.com/v1` |
| Base URL (Qwen) | `https://coding.dashscope.aliyuncs.com/v1` |
| Base URL (MiniMax) | `https://api.minimaxi.com/v1/text/chatcompletion_v2` |
| Base URL (local) | `http://localhost:11434/v1` |
| API Key | `sk-...` (leave empty for local APIs) |
| Model | `gpt-4o` / `qwen3-max` / `claude-sonnet-4-6` |

> **Smart URL**: Enter just the base URL (e.g. `https://api.openai.com/v1`) and InlineAsk auto-appends `/chat/completions`. Or paste a full custom endpoint for non-standard APIs.

Click **Test** to verify → **Save** (or just type — auto-saves after 0.8s).

---

## 🚀 Usage

1. **Select text** on any webpage (8+ characters)
2. Click the **🦞 Ask** bubble that appears
3. Type your question → press **Enter**
4. Read the streaming answer
5. Ask follow-ups or click **✕** to close

**Shortcut**: Select text → `Cmd/Ctrl + Shift + A` to skip the bubble entirely.

---

## 🌍 Compatible APIs

- ✅ OpenAI (`https://api.openai.com/v1`)
- ✅ Anthropic Claude (via compatible proxies)
- ✅ Alibaba Qwen (`https://coding.dashscope.aliyuncs.com/v1`)
- ✅ MiniMax (`https://api.minimaxi.com/v1/text/chatcompletion_v2`)
- ✅ Ollama (`http://localhost:11434/v1`)
- ✅ LM Studio (`http://localhost:1234/v1`)
- ✅ Any OpenAI-compatible API

---

## 💝 Support

InlineAsk is free and open source. If it saves you time every day, consider buying me a coffee ☕

**Alipay:**

<img src="./alipay-qr.png" width="180" alt="Alipay QR Code" />

*Any amount keeps the lobster fed and the code maintained 🦞*

---

## 📝 License

MIT — free to use, fork, and modify.

*Built with ❤️ for developers who hate context switching.*

---

---

<a name="中文"></a>

# 中文

**划词即问。就在原地。不用切换标签页。**

---

## 😤 痛点

你正在阅读一篇长文、技术文档或代码审查，遇到了一句看不懂的话。

**你怎么办？**

```
方案 A：开新标签页 → 打开 ChatGPT → 复制文字 → 粘贴 → 等待 →
        切回来 → 找不到刚才看到哪了 → 每天重复 50 次 😩

方案 B：在页面底部提问 → AI 把你已经知道的内容重新输出一遍
        → 浪费 token → 浪费时间 💸

方案 C：🦞 选中文字 → 点击提问 → 获得答案 → 关闭 → 继续 ✅
```

---

## ✨ 为什么你需要它

### 使用 InlineAsk 之前

```
阅读文章中...
  ↓
"幂等性是什么意思？"
  ↓
Cmd+T → 新标签页 → ChatGPT → 输入问题 → 等待 → 阅读答案 →
Cmd+W → 回到文章 → 我刚才看到哪了？→ 滚啊滚啊滚...
```

**每个问题约 2 分钟。每天 20 个问题 = 浪费 40 分钟。**

### 使用 InlineAsk 之后

```
阅读文章中...
  ↓
选中"幂等性" → 🦞 气泡出现 → 点击
  ↓
答案就在原地流式输出 → 关闭 → 继续阅读
```

**每个问题约 10 秒。同样 20 个问题 = 只需 3 分钟。**

---

## 🎬 使用流程

```
① 在任意网页选中文字
   ┌─────────────────────────────────┐
   │  ...该函数必须保证               │
   │  [幂等性]才能确保...             │  ← 选中这里
   └─────────────────────────────────┘
                    ↓
② 选中文字上方出现气泡
   ┌──────────┐
   │ 🦞 Ask  │  ← 点击
   └──────────┘
                    ↓
③ 对话框在原地弹出，自动携带上下文
   ┌─────────────────────────────────────┐
   │ 🦞 Inline Ask          [模型] [✕] │
   ├─────────────────────────────────────┤
   │ 选中内容                            │
   │ "幂等性才能确保..."                 │
   ├─────────────────────────────────────┤
   │                                     │
   │  幂等性是什么意思？                  │
   │                                     │
   │  幂等操作是指无论执行多少次，        │
   │  结果都相同的操作。例如             │
   │  HTTP GET 请求就是幂等的...       ▌ │
   ├─────────────────────────────────────┤
   │  [继续追问...                 ] [▶] │
   └─────────────────────────────────────┘
                    ↓
④ 关闭 → 从刚才的位置继续阅读
```

---

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 🌐 **全网页通用** | 任意网页均可使用——文档、文章、GitHub、新闻等 |
| ⚡ **流式输出** | 答案逐字实时显示，无需等待 |
| 🔧 **任意 AI API** | OpenAI、Claude、通义千问、MiniMax、本地模型均支持 |
| 🔒 **隐私优先** | 数据直接发往你的 API，不经过任何第三方 |
| 💬 **多轮对话** | 在同一对话框中持续追问 |
| 🖱️ **可拖拽** | 随意移动对话框位置 |
| ⌨️ **快捷键** | `Cmd/Ctrl + Shift + A`，无需鼠标 |
| 🎨 **暗色界面** | 护眼设计，适配任何网页背景 |

---

## 📦 安装方法

```bash
git clone https://github.com/toyball860721/InlineAsk.git
```

1. 打开 `chrome://extensions`
2. 开启右上角的**开发者模式**
3. 点击**加载已解压的扩展程序** → 选择克隆的文件夹
4. 工具栏出现 🦞 图标

---

## ⚙️ 配置说明

点击 🦞 图标 → 填写 API 信息：

| 字段 | 示例 |
|------|------|
| Base URL | `https://api.openai.com/v1` |
| Base URL（通义千问）| `https://coding.dashscope.aliyuncs.com/v1` |
| Base URL（MiniMax）| `https://api.minimaxi.com/v1/text/chatcompletion_v2` |
| Base URL（本地）| `http://localhost:11434/v1` |
| API Key | `sk-...`（本地 API 可留空）|
| 模型名称 | `gpt-4o` / `qwen3-max` / `claude-sonnet-4-6` |

> **智能 URL 识别**：填写 Base URL（如 `https://api.openai.com/v1`）时自动拼接 `/chat/completions`；非标准端点可直接填写完整 URL。

点击 **Test** 测试连接 → **保存**（也可直接输入，0.8 秒后自动保存）。

---

## 🚀 使用方法

1. 在任意网页**选中文字**（至少 8 个字符）
2. 点击出现的 **🦞 Ask** 气泡
3. 输入问题 → 按**回车**
4. 实时阅读流式答案
5. 可继续追问，或点击 **✕** 关闭

**快捷键**：选中文字后按 `Cmd/Ctrl + Shift + A`，直接跳过气泡打开对话框。

---

## 🌍 兼容的 API

- ✅ OpenAI (`https://api.openai.com/v1`)
- ✅ Anthropic Claude（通过兼容代理）
- ✅ 阿里通义千问 (`https://coding.dashscope.aliyuncs.com/v1`)
- ✅ MiniMax (`https://api.minimaxi.com/v1/text/chatcompletion_v2`)
- ✅ Ollama 本地 (`http://localhost:11434/v1`)
- ✅ LM Studio (`http://localhost:1234/v1`)
- ✅ 任意 OpenAI 兼容 API

---

## 💝 打赏支持

InlineAsk 完全免费开源。如果它每天帮你节省时间，欢迎请我喝杯咖啡 ☕

**支付宝：**

<img src="./alipay-qr.png" width="180" alt="支付宝收款码" />

*¥1、¥5、¥10 —— 任何金额都能让龙虾吃饱、代码持续维护 🦞*

---

## 📝 许可证

MIT 许可证 —— 自由使用、Fork 和修改。

*为讨厌切换上下文的开发者而生。❤️*
