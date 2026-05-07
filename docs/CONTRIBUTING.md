# Contributing to Hermes Companion

Thank you for your interest in contributing! 🎉

This document provides guidelines and instructions for contributing to Hermes Companion.

---

## 🌟 How Can I Contribute?

### Reporting Bugs
Before creating bug reports, please check existing issues. When creating a bug report, include:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, app version)

**Example:**
```markdown
**Bug Summary:** Sprite stuck in "thinking" state after failed command

**Steps to Reproduce:**
1. Open app
2. Run `rm -rf test/`
3. Command fails with permission error
4. Sprite remains in "thinking" state

**Expected:** Sprite should show "error" state
**Actual:** Sprite stays in "thinking" state indefinitely
```

### Suggesting Features
Feature suggestions are welcome! Please:
- Use a clear, descriptive title
- Provide detailed description
- Explain why this feature would be useful
- List examples of how it would work

### Pull Requests
1. Fork the repository
2. Create a branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit with clear messages (`git commit -m 'Add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## 🏗️ Development Setup

### Prerequisites
- **Node.js** 18+
- **Rust** (latest stable)
- **Python** 3.10+
- **npm** or **yarn**

### Installation
```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/hermes-companion.git
cd hermes-companion

# Install dependencies
npm install
pip install -r hermes-core/requirements.txt

# Run in development mode
npm run tauri dev
```

### Building
```bash
# Build for your current platform
npm run tauri build

# Build for specific platform
npm run tauri build -- --target x86_64-pc-windows-msvc
```

---

## 📐 Coding Standards

### Frontend (React/TypeScript)
- Use TypeScript for all new code
- Follow ESLint rules (`npm run lint`)
- Write components as functions, not classes
- Use hooks for state management
- Keep components small and focused

**Example:**
```typescript
// ✅ Good
interface SpriteProps {
  state: SpriteState;
  theme?: string;
}

export function Sprite({ state, theme = 'default' }: SpriteProps) {
  // Component logic
}

// ❌ Avoid
const Sprite = (props: any) => { ... }
```

### Rust (Tauri Backend)
- Follow Rustfmt guidelines (`cargo fmt`)
- Use Clippy for linting (`cargo clippy`)
- Handle errors with `Result`, not `unwrap()`
- Document public APIs with rustdoc

**Example:**
```rust
// ✅ Good
#[tauri::command]
fn connect_oauth(service: String) -> Result<Token, String> {
    // Implementation
}

// ❌ Avoid
fn connect_oauth(service: String) -> Token {
    // Panics on error
}
```

### Python (Hermes Core)
- Follow PEP 8 style guide
- Use type hints
- Write docstrings for all functions
- Include unit tests for new features

**Example:**
```python
# ✅ Good
def get_sprite_state(event: SpriteEvent) -> SpriteState:
    """
    Determine sprite state based on event type.
    
    Args:
        event: The sprite event to process
        
    Returns:
        The appropriate sprite state
    """
    # Implementation
```

---

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
npm test

# Rust tests
cargo test

# Python tests
pytest hermes-core/tests
```

### Writing Tests
- Unit tests for utility functions
- Integration tests for critical paths
- E2E tests for user flows
- Aim for >80% coverage on new code

---

## 📝 Documentation

### Code Comments
- Explain **why**, not **what**
- Keep comments up-to-date with code
- Use JSDoc for TypeScript
- Use rustdoc for Rust
- Use docstrings for Python

### User Documentation
- Write in clear, simple English
- Include screenshots where helpful
- Provide step-by-step instructions
- Link to related docs

---

## 🎨 Sprite Contributions

We welcome community sprite themes!

### Creating a Sprite Theme
1. Create folder: `src/assets/sprites/your-theme/`
2. Add Lottie files for all 6 states:
   - `idle.json`
   - `listening.json`
   - `thinking.json`
   - `happy.json`
   - `worried.json`
   - `error.json`
3. Add `theme.json` with metadata:
```json
{
  "name": "Your Theme",
  "author": "Your Name",
  "version": "1.0.0",
  "description": "A brief description"
}
```
4. Test in app
5. Submit PR with screenshots

### Sprite Guidelines
- Keep file size under 100KB per state
- Use Lottie format (JSON)
- Ensure animations loop smoothly
- Test on light and dark backgrounds

---

## 🚀 Release Process

1. Version bump (semantic versioning)
2. Update CHANGELOG.md
3. Create git tag
4. Build release binaries
5. Publish to GitHub Releases
6. Announce on Discord/social media

---

## 💬 Community

Join our community discussions:
- **GitHub Issues**: Bug reports, feature requests
- **Discord**: Real-time chat, help, showcase
- **Discussions**: Ideas, questions, off-topic

---

## 📜 Code of Conduct

### Our Pledge
We pledge to make participation in our project a harassment-free experience for everyone.

### Expected Behavior
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Publishing others' private information
- Other unethical conduct

---

**Thank you for contributing to Hermes Companion! 🎨**
