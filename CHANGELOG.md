# Changelog

All notable changes to InlineAsk will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-03-27

### Added
- Universal webpage support - works on any website, not just OpenClaw
- Flexible API configuration - supports any OpenAI-compatible API
- Smart URL detection - auto-appends `/chat/completions` or accepts full endpoint URLs
- Auto-save settings - saves after 0.8s of typing
- Keyboard shortcut - `Cmd/Ctrl + Shift + A` to open dialog instantly
- Draggable and resizable dialog windows
- Multi-turn conversations within the same dialog
- Streaming response support with real-time output
- Context-aware questioning - selected text automatically included as context
- Support for multiple AI providers:
  - OpenAI
  - Anthropic Claude (via proxies)
  - Alibaba Qwen
  - MiniMax
  - Local models (Ollama, LM Studio)

### Changed
- Renamed from ClawInlineAsk to InlineAsk
- Removed OpenClaw-specific dependencies
- Improved error handling and user feedback
- Enhanced UI with refined dark theme and amber accents

### Technical
- Manifest V3 compliance
- Background service worker for API calls (bypasses CORS)
- Safe message handling with context invalidation detection
- Automatic settings synchronization across tabs

## [1.0.0] - 2025-03-25

### Added
- Initial release as ClawInlineAsk
- OpenClaw-specific inline text selection assistant
- Basic streaming chat functionality
- Token auto-detection from OpenClaw dashboard

---

[2.0.0]: https://github.com/toyball860721/InlineAsk/releases/tag/v2.0.0
[1.0.0]: https://github.com/toyball860721/InlineAsk/releases/tag/v1.0.0
