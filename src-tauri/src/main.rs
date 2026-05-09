// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod oauth;

use oauth::{GitHubOAuthConfig, OAuthState, OAuthCredentials, generate_auth_url, exchange_code_for_token};
use std::sync::Mutex;
use tauri::State;

/// Application state for OAuth management
pub struct AppState {
    pub current_state: Mutex<Option<OAuthState>>,
    pub credentials: Mutex<Vec<OAuthCredentials>>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            current_state: Mutex::new(None),
            credentials: Mutex::new(Vec::new()),
        }
    }
}

/// Start GitHub OAuth flow
/// Returns the authorization URL to open in browser
#[tauri::command]
fn start_github_oauth(state: State<'_, AppState>) -> Result<String, String> {
    let config = GitHubOAuthConfig::default();
    let oauth_state = OAuthState::new("github");
    
    // Store state for callback validation
    {
        let mut current = state.current_state.lock().map_err(|e| e.to_string())?;
        *current = Some(oauth_state.clone());
    }
    
    let auth_url = generate_auth_url(&config, &oauth_state);
    Ok(auth_url)
}

/// Handle OAuth callback from GitHub
/// Exchanges the authorization code for an access token
#[tauri::command]
async fn handle_github_callback(
    state: State<'_, AppState>,
    code: String,
    callback_state: String,
) -> Result<OAuthCredentials, String> {
    // Validate state parameter
    {
        let current = state.current_state.lock().map_err(|e| e.to_string())?;
        match current.as_ref() {
            Some(stored_state) if stored_state.state == callback_state => {},
            Some(_) => return Err("State mismatch - possible CSRF attack".to_string()),
            None => return Err("No OAuth state found - please restart the flow".to_string()),
        }
    }
    
    let config = GitHubOAuthConfig::default();
    let stored_state = {
        let current = state.current_state.lock().map_err(|e| e.to_string())?;
        current.clone().ok_or("State not found")?
    };
    
    // Exchange code for token
    let token_response = exchange_code_for_token(&config, &code, &stored_state)
        .await
        .map_err(|e| e.to_string())?;
    
    let credentials = OAuthCredentials {
        provider: "github".to_string(),
        access_token: token_response.access_token,
        refresh_token: token_response.refresh_token,
        expires_at: token_response.expires_in.map(|exp| {
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_secs() + exp
        }),
        scopes: token_response.scope.split_whitespace().map(String::from).collect(),
    };
    
    // Store credentials
    {
        let mut creds = state.credentials.lock().map_err(|e| e.to_string())?;
        creds.push(credentials.clone());
    }
    
    // Clear the state
    {
        let mut current = state.current_state.lock().map_err(|e| e.to_string())?;
        *current = None;
    }
    
    Ok(credentials)
}

/// Get all stored OAuth credentials
#[tauri::command]
fn get_oauth_connections(state: State<'_, AppState>) -> Result<Vec<OAuthCredentials>, String> {
    let creds = state.credentials.lock().map_err(|e| e.to_string())?;
    Ok(creds.clone())
}

/// Remove an OAuth connection
#[tauri::command]
fn remove_oauth_connection(
    state: State<'_, AppState>,
    provider: String,
) -> Result<bool, String> {
    let mut creds = state.credentials.lock().map_err(|e| e.to_string())?;
    let initial_len = creds.len();
    creds.retain(|c| c.provider != provider);
    Ok(creds.len() < initial_len)
}

/// Ping command for IPC connection testing
#[tauri::command]
fn ping(message: String) -> Result<String, String> {
    Ok(format!("Pong! Received: {}. Backend is alive! 🚀", message))
}

fn main() {
    tauri::Builder::default()
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            start_github_oauth,
            handle_github_callback,
            get_oauth_connections,
            remove_oauth_connection,
            ping
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
