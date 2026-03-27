# Chrome Web Store 发布清单

## ✅ 已准备好的材料

### 1. 扩展包
- ✅ `InlineAsk-v2.0.0.zip` (528KB) - 已打包完成

### 2. 商店信息（复制粘贴即可）

#### 名称
```
InlineAsk
```

#### 简短描述（132 字符以内）
```
Select any text, ask AI instantly. Universal inline assistant for OpenAI/Claude/Qwen/MiniMax. No tab switching.
```

#### 详细描述
```
InlineAsk lets you select any text on any webpage and instantly ask AI questions about it. A floating dialog appears right where you selected, providing context-aware answers without leaving your current page.

✨ KEY FEATURES
• Works on any webpage - docs, articles, GitHub, news, anything
• Streaming responses - answers appear word by word in real-time
• Flexible API - use OpenAI, Claude, Qwen, MiniMax, or any OpenAI-compatible API
• Privacy-first - all data stays between you and your chosen API
• Multi-turn conversations - ask follow-ups in the same dialog
• Draggable & resizable dialogs
• Keyboard shortcut - Cmd/Ctrl + Shift + A

🎯 USE CASES
• Learning: Select unfamiliar terms and get instant explanations
• Research: Ask questions about specific paragraphs
• Coding: Get clarification on code snippets
• Translation: Ask for translations or cultural context
• Writing: Get suggestions for selected text

⚙️ SETUP
1. Click the 🦞 icon in your toolbar
2. Enter your API endpoint URL and key
3. Choose your preferred model
4. Start selecting text and asking questions!

🌍 COMPATIBLE APIS
• OpenAI (https://api.openai.com/v1)
• Anthropic Claude (via compatible proxies)
• Alibaba Qwen (https://coding.dashscope.aliyuncs.com/v1)
• MiniMax (https://api.minimaxi.com/v1/text/chatcompletion_v2)
• Ollama (http://localhost:11434/v1)
• LM Studio (http://localhost:1234/v1)
• Any OpenAI-compatible API

📝 OPEN SOURCE
MIT License - Free to use, fork, and modify
GitHub: https://github.com/toyball860721/InlineAsk

💝 SUPPORT
If InlineAsk saves you time, consider supporting development via the GitHub repo.
```

#### 分类
```
Productivity
```

#### 语言
```
English
```

### 3. 隐私信息

#### Single Purpose Description
```
InlineAsk allows users to select text on any webpage and ask AI questions about it through a floating inline dialog.
```

#### 权限说明

**storage**
```
Store user's API configuration (endpoint URL, API key, model preference)
```

**tabs**
```
Inject content script into active tabs to enable text selection detection
```

**scripting**
```
Execute content script for text selection and dialog functionality
```

**<all_urls>**
```
Enable text selection and inline dialog on any webpage user visits
```

#### 数据使用声明
- ✅ No data collection
- ✅ No analytics
- ✅ No third-party services
- ✅ All API calls go directly to user's configured endpoint

#### Remote Code
```
No
```

### 4. 图标
- ✅ `icons/icon128.png` - 已准备好

---

## 📋 发布步骤

### 第 1 步：注册开发者账号（如果还没有）

1. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. 使用 Google 账号登录
3. 支付一次性 $5 注册费
4. 完成开发者验证

### 第 2 步：上传扩展

1. 在 Developer Dashboard 点击 **New Item**
2. 上传 `InlineAsk-v2.0.0.zip`
3. 接受条款

### 第 3 步：填写商店信息

复制上面准备好的内容，粘贴到对应字段：
- [ ] 名称
- [ ] 简短描述
- [ ] 详细描述
- [ ] 分类：Productivity
- [ ] 语言：English

### 第 4 步：上传图标

- [ ] 上传 `icons/icon128.png` 作为商店图标

### 第 5 步：填写隐私信息

复制上面的隐私信息，填写：
- [ ] Single Purpose Description
- [ ] 权限说明（storage, tabs, scripting, <all_urls>）
- [ ] 数据使用声明（勾选"不收集数据"）
- [ ] Remote Code: No

### 第 6 步：提交审核

1. 检查所有信息
2. 点击 **Submit for Review**
3. 等待 1-3 个工作日审核

### 第 7 步：审核通过后

- [ ] 更新 README.md 添加 Chrome Web Store 链接
- [ ] 在 GitHub 创建 Release v2.0.0
- [ ] 推广到各大平台

---

## 🎯 需要截图（可选但强烈推荐）

建议添加 3-5 张截图（1280x800 或 640x400）：

1. **文字选中 + 气泡** - 展示选中文字后出现的 🦞 Ask 气泡
2. **对话框 + 流式输出** - 展示对话框和实时流式回答
3. **设置页面** - 展示 API 配置界面
4. **多轮对话** - 展示追问功能
5. **不同网页示例** - 展示在不同网站上使用

截图工具推荐：
- macOS: Cmd+Shift+4 (系统自带)
- 或使用 CleanShot X

---

## ⚠️ 常见拒绝原因

- 缺少或不清晰的隐私政策
- 权限说明不充分
- 截图质量低
- 描述误导
- 名称侵犯商标

---

## 📞 需要帮助？

- [Chrome Web Store 开发者文档](https://developer.chrome.com/docs/webstore/)
- [GitHub Issues](https://github.com/toyball860721/InlineAsk/issues)

---

**准备好了吗？访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) 开始发布！**
