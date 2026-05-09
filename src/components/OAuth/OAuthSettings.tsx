import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { GitHubOAuthButton, OAuthConnectionStatus, OAuthConnection } from './GitHubOAuth';
import { Settings, Link, RefreshCw } from 'lucide-react';

export function OAuthSettings() {
  const [connections, setConnections] = useState<OAuthConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadConnections = async () => {
    try {
      const conns = await invoke<OAuthConnection[]>('get_oauth_connections');
      setConnections(conns);
    } catch (err) {
      console.error('Failed to load connections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  const handleDisconnect = () => {
    loadConnections();
  };

  const handleAuthComplete = () => {
    // Reload connections after successful auth
    setTimeout(loadConnections, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">API Verbindungen</h1>
        </div>
        <p className="text-gray-600">
          Verbinde deine Konten für One-Click Zugriff. Tokens werden sicher in der Platform-Keychain gespeichert.
        </p>
      </div>

      <div className="space-y-6">
        {/* GitHub Section */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-900 rounded-lg">
              <Link className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">GitHub</h2>
              <p className="text-sm text-gray-500">
                Für Repository-Zugriff und GitHub Actions
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <GitHubOAuthButton onAuthComplete={handleAuthComplete} />
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Verbundene Konten
              </h3>
              {isLoading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Lade Verbindungen...
                </div>
              ) : (
                <OAuthConnectionStatus
                  connections={connections.filter(c => c.provider === 'github')}
                  onDisconnect={handleDisconnect}
                />
              )}
            </div>
          </div>
        </section>

        {/* Google Section (Placeholder for future) */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm opacity-60">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Link className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Google</h2>
              <p className="text-sm text-gray-500">
                Für Google Drive, Calendar, Gmail (kommt bald)
              </p>
            </div>
          </div>
          <button
            disabled
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
          >
            Bald verfügbar
          </button>
        </section>

        {/* Microsoft Section (Placeholder for future) */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm opacity-60">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Link className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Microsoft</h2>
              <p className="text-sm text-gray-500">
                Für Microsoft 365, OneDrive, Outlook (kommt bald)
              </p>
            </div>
          </div>
          <button
            disabled
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
          >
            Bald verfügbar
          </button>
        </section>
      </div>

      {/* Security Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          🔒 Sicherheitshinweis
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Tokens werden verschlüsselt in der Platform-Keychain gespeichert</li>
          <li>• OAuth2 mit PKCE für maximalen Schutz</li>
          <li>• Kein manuelles API-Key-Management erforderlich</li>
          <li>• Jederzeit trennbar in den Einstellungen</li>
        </ul>
      </div>
    </div>
  );
}
