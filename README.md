# Hermes Companion 🎨

**Your Personal AI Companion** — Visual, Cross-Platform, and Easy to Use.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/jaleth/hermes-companion?style=social)](https://github.com/jaleth/hermes-companion/stargazers)
[![Discord](https://img.shields.io/discord/123456789?label=Discord&logo=discord)](https://discord.gg/your-invite)

---

## 🌟 What is Hermes Companion?

Hermes Companion is a **visual AI assistant** that solves the 3 biggest pain points of current AI agent systems:

| Problem | Hermes Solution |
|---------|-----------------|
| ❌ Complex API token setup | 🔑 One-Click OAuth flows |
| ❌ Terminal-only (SSH required) | 📱 Native Desktop + Mobile Apps |
| ❌ Cold, abstract interface | 🎨 Expressive Sprite System |

Built for **everyone** — not just developers.

---

## ✨ Features (v1.0 Roadmap)

### 🎨 Sprite System
An expressive avatar that reacts to what's happening — **without burning API tokens**.

- **6 Emotional States**: idle, listening, thinking, happy, worried, error
- **Rule-Based Triggers**: Zero token cost, instant reactions
- **Theme Support**: Custom sprites, community themes
- **Lottie Animations**: Smooth, lightweight (~50KB per state)

### 📱 Cross-Platform App
One app for all your devices, synchronized state.

- **Desktop**: Windows, macOS, Linux (Tauri)
- **Mobile**: iOS, Android (v2.0)
- **Embedded Hermes Web UI**: Full dashboard in-app
- **Native Chat**: Direct chat, no Telegram required
- **Full Device Access**: Terminal, files, network via Tauri APIs

### 🔑 One-Click API Setup
No more manual API keys.

- **OAuth2 Flows**: Google, GitHub, Microsoft
- **Guided Setup**: Step-by-step wizard
- **Secure Storage**: Platform-native keychain (encrypted)
- **Status Dashboard**: See all connections at a glance

### 📖 Interactive Guide
Learn while using — never feel lost.

- **Onboarding Tour**: First-start walkthrough
- **Context Hints**: Explains features as you discover them
- **Tooltips**: Hover for quick explanations
- **Cheat Sheet**: `Ctrl+K` for all commands

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Rust (for Tauri)
- Python 3.10+

### Installation

```bash
# Clone the repository
git clone https://github.com/jaleth/hermes-companion.git
cd hermes-companion

# Install frontend dependencies
npm install

# Install Python dependencies
pip install -r hermes-core/requirements.txt

# Run in development mode
npm run tauri dev
```

### Build for Production

```bash
# Build for your current platform
npm run tauri build

# Outputs in src-tauri/target/release/
```

---

## 📁 Project Structure

```
hermes-companion/
├── src/                      # React Frontend (TypeScript)
│   ├── components/
│   │   ├── Sprite/          # Sprite renderer & state machine
│   │   ├── Chat/            # Chat interface
│   │   └── Guide/           # Onboarding & tooltips
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Helper functions
│   └── assets/
│       └── sprites/         # Lottie sprite files
├── src-tauri/               # Rust Backend (Tauri)
│   ├── src/
│   │   ├── main.rs          # App entry point
│   │   ├── commands.rs      # Tauri commands (Rust ↔ Frontend)
│   │   └── oauth.rs         # OAuth2 flows
│   ├── icons/               # App icons
│   └── tauri.conf.json      # Tauri configuration
├── hermes-core/             # Python Backend (Existing Hermes)
│   ├── sprite_engine/       # Rule-based sprite state machine
│   ├── skills/              # Hermes skills
│   └── requirements.txt     # Python dependencies
├── docs/                    # Documentation
│   ├── guides/              # User guides
│   └── api/                 # API documentation
└── .github/                 # GitHub workflows & templates
```

---

## 🎯 Roadmap

### v1.0 (Current)
- [x] Project scaffolding
- [ ] Tauri app with basic UI
- [ ] Sprite system (6 states, rule-based)
- [ ] OAuth2 for Google & GitHub
- [ ] Interactive guide system
- [ ] Embedded Hermes Web UI

### v1.1
- [ ] Mobile apps (iOS/Android)
- [ ] Cloud sync (optional, E2E encrypted)
- [ ] Community sprite themes
- [ ] Plugin system

### v2.0
- [ ] Voice interaction
- [ ] Screen-aware features
- [ ] Multi-user support

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

### Ways to Help
- 🎨 Create sprite themes
- 📝 Write documentation
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit PRs

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/)
- Sprite animations with [Lottie](https://lottiefiles.com/)
- Powered by [Hermes Agent](https://github.com/jaleth/hermes)

---

**Made with ❤️ by Josh and the Hermes Community**
