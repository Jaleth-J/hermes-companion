import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { GitHubOAuth } from './components/OAuth'
import { Sprite } from './components/Sprite/Sprite'
import './App.css'

function App() {
  const [greeting, setGreeting] = useState('')
  const [pingResult, setPingResult] = useState<string | null>(null)

  async function handlePing() {
    try {
      const result = await invoke('ping', { message: 'Hello from React!' })
      setPingResult(result as string)
      setGreeting('Frontend ↔ Backend connected! ✅')
    } catch (error) {
      setPingResult(`Error: ${error}`)
      setGreeting('Connection failed ❌')
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🤖 Hermes Companion</h1>
        <p className="subtitle">Your Personal AI Assistant</p>
      </header>

      <main className="main">
        {/* Sprite Section */}
        <section className="sprite-section">
          <h2>🎨 Hermes Status</h2>
          <Sprite state="idle" />
        </section>

        {/* Connection Test */}
        <section className="test-section">
          <h2>🔌 IPC Connection Test</h2>
          <button onClick={handlePing} className="test-button">
            Test Backend Connection
          </button>
          {pingResult && (
            <div className="result">
              <p><strong>Response:</strong> {pingResult}</p>
              <p className="greeting">{greeting}</p>
            </div>
          )}
        </section>

        {/* OAuth Section */}
        <section className="oauth-section">
          <h2>🔐 GitHub Integration</h2>
          <GitHubOAuth />
        </section>

        {/* Info Section */}
        <section className="info-section">
          <h2>ℹ️ System Info</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Tauri Version</h3>
              <p>2.x</p>
            </div>
            <div className="info-card">
              <h3>React Version</h3>
              <p>18.x</p>
            </div>
            <div className="info-card">
              <h3>Rust Edition</h3>
              <p>2021</p>
            </div>
            <div className="info-card">
              <h3>Platform</h3>
              <p>Linux</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Hermes Companion v0.0.0 • MIT License</p>
      </footer>
    </div>
  )
}

export default App
