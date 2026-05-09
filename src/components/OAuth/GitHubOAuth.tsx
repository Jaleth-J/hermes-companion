import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-shell';
import { Github, Check, X, Loader2, Key } from 'lucide-react';

interface OAuthConnection {
  provider: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  scopes: string[];
}

interface GitHubOAuthButtonProps {
  onAuthComplete?: (credentials: OAuthConnection) => void;
}

export function GitHubOAuthButton({ onAuthComplete }: GitHubOAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Start OAuth flow and get authorization URL
      const authUrl: string = await invoke('start_github_oauth');
      
      // Open browser for user to authenticate
      await open(authUrl);
      
      // Start listening for callback (localhost:3001/oauth/callback)
      setIsListening(true);
      
      // In a real implementation, you'd start a local server here
      // For now, we'll show instructions to the user
      alert(
        'GitHub OAuth Flow gestartet!\n\n' +
        '1. Melde dich im Browser bei GitHub an\n' +
        '2. Nach der Autorisierung wirst du zurückgeleitet\n' +
        '3. Die App empfängt den Callback automatisch'
      );
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OAuth failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleGitHubLogin}
        disabled={isLoading || isListening}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg 
                   hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed 
                   transition-colors duration-200"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isListening ? (
          <Loader2 className="w-5 h-5 animate-spin text-green-400" />
        ) : (
          <Github className="w-5 h-5" />
        )}
        {isLoading ? 'Starte...' : isListening ? 'Warte auf Callback...' : 'Mit GitHub verbinden'}
      </button>
      
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}

interface OAuthConnectionStatusProps {
  connections: OAuthConnection[];
  onDisconnect?: (provider: string) => void;
}

export function OAuthConnectionStatus({ connections, onDisconnect }: OAuthConnectionStatusProps) {
  const formatExpiry = (expiresAt?: number) => {
    if (!expiresAt) return 'Läuft nicht ab';
    const expires = new Date(expiresAt * 1000);
    return expires.toLocaleString('de-DE');
  };

  const formatScopes = (scopes: string[]) => {
    return scopes.join(', ');
  };

  const handleDisconnect = async (provider: string) => {
    try {
      await invoke('remove_oauth_connection', { provider });
      onDisconnect?.(provider);
    } catch (err) {
      console.error('Failed to disconnect:', err);
    }
  };

  if (connections.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        Keine verbundenen Konten
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {connections.map((conn) => (
        <div
          key={conn.provider}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="font-medium capitalize flex items-center gap-2">
                {conn.provider === 'github' && <Github className="w-4 h-4" />}
                {conn.provider}
              </div>
              <div className="text-xs text-gray-500">
                <Key className="w-3 h-3 inline mr-1" />
                Token gespeichert
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Scopes: {formatScopes(conn.scopes)}
              </div>
              <div className="text-xs text-gray-500">
                Läuft ab: {formatExpiry(conn.expires_at)}
              </div>
            </div>
          </div>
          <button
            onClick={() => handleDisconnect(conn.provider)}
            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            Trennen
          </button>
        </div>
      ))}
    </div>
  );
}
