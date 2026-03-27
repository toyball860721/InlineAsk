# Publishing to Chrome Web Store

## Prerequisites

1. **Chrome Web Store Developer Account**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Pay one-time $5 registration fee
   - Complete developer verification

2. **Extension Package**
   - Use the pre-built `InlineAsk-v2.0.0.zip` in the project root
   - Or rebuild: `zip -r InlineAsk-v2.0.0.zip manifest.json background.js content.js content.css popup.html popup.js icons/ LICENSE README.md`

## Publishing Steps

### 1. Upload Package

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **New Item**
3. Upload `InlineAsk-v2.0.0.zip`
4. Accept the terms

### 2. Fill Store Listing

**Product Details:**
- **Name**: InlineAsk
- **Summary** (132 chars max):
  ```
  Select any text, ask AI instantly. Universal inline assistant for OpenAI/Claude/Qwen/MiniMax. No tab switching.
  ```
- **Description**:
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

**Category**: Productivity

**Language**: English

### 3. Upload Assets

**Icon** (128x128):
- Use `icons/icon128.png`

**Screenshots** (1280x800 or 640x400):
- Need to capture 3-5 screenshots showing:
  1. Text selection with bubble
  2. Dialog with streaming response
  3. Settings page
  4. Multi-turn conversation
  5. Different webpage examples

**Promotional Images** (optional but recommended):
- Small tile: 440x280
- Marquee: 1400x560

### 4. Privacy Practices

**Single Purpose Description**:
```
InlineAsk allows users to select text on any webpage and ask AI questions about it through a floating inline dialog.
```

**Permissions Justification**:
- `storage`: Store user's API configuration (endpoint URL, API key, model preference)
- `tabs`: Inject content script into active tabs to enable text selection
- `scripting`: Execute content script for text selection detection
- `<all_urls>`: Enable text selection on any webpage user visits

**Data Usage**:
- ✅ No data collection
- ✅ No analytics
- ✅ No third-party services
- ✅ All API calls go directly to user's configured endpoint

**Remote Code**: No

### 5. Submit for Review

1. Click **Submit for Review**
2. Review typically takes 1-3 business days
3. You'll receive email notification when approved

### 6. Post-Approval

Once approved:
- Extension will be live on Chrome Web Store
- Users can install with one click
- Update README with Chrome Web Store link
- Announce on social media

## Updating the Extension

For future updates:
1. Update `version` in `manifest.json`
2. Update `CHANGELOG.md`
3. Create new zip package
4. Upload to existing item in dashboard
5. Submit for review

## Tips

- **Screenshots are crucial** - they're the first thing users see
- **Clear description** - explain the problem it solves
- **Keywords** - include in description: AI, ChatGPT, productivity, inline, text selection
- **Privacy** - emphasize no data collection
- **Support** - provide GitHub issues link for support

## Common Rejection Reasons

- Missing or unclear privacy policy
- Insufficient permission justification
- Low-quality screenshots
- Misleading description
- Trademark violations in name/description

---

**Need help?** Check [Chrome Web Store Developer Documentation](https://developer.chrome.com/docs/webstore/)
