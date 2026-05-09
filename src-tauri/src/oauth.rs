//! OAuth2 Flow Implementation for GitHub
//! 
//! Implements Authorization Code Grant with PKCE extension for secure authentication.

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use base64::{Engine, engine::general_purpose::URL_SAFE_NO_PAD};
use rand::Rng;
use std::collections::HashMap;

/// OAuth2 configuration for GitHub
#[derive(Debug, Clone)]
pub struct GitHubOAuthConfig {
    pub client_id: String,
    pub client_secret: String,
    pub redirect_uri: String,
    pub auth_url: String,
    pub token_url: String,
    pub scopes: Vec<String>,
}

impl Default for GitHubOAuthConfig {
    fn default() -> Self {
        Self {
            client_id: std::env::var("GITHUB_OAUTH_CLIENT_ID").unwrap_or_default(),
            client_secret: std::env::var("GITHUB_OAUTH_CLIENT_SECRET").unwrap_or_default(),
            redirect_uri: "http://localhost:3001/oauth/callback".to_string(),
            auth_url: "https://github.com/login/oauth/authorize".to_string(),
            token_url: "https://github.com/login/oauth/access_token".to_string(),
            scopes: vec![
                "repo".to_string(),
                "workflow".to_string(),
                "read:org".to_string(),
            ],
        }
    }
}

/// PKCE Code Verifier and Challenge
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PKCE {
    pub code_verifier: String,
    pub code_challenge: String,
}

impl PKCE {
    /// Generate a new PKCE code verifier and challenge
    pub fn generate() -> Self {
        // Generate random bytes for code verifier (43-128 chars)
        let mut rng = rand::thread_rng();
        let bytes: Vec<u8> = (0..32).map(|_| rng.gen()).collect();
        let code_verifier = URL_SAFE_NO_PAD.encode(&bytes);
        
        // Generate code challenge (SHA256 hash of verifier)
        let mut hasher = Sha256::new();
        hasher.update(code_verifier.as_bytes());
        let hash = hasher.finalize();
        let code_challenge = URL_SAFE_NO_PAD.encode(&hash);
        
        Self {
            code_verifier,
            code_challenge,
        }
    }
}

/// OAuth2 state for tracking authentication flow
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OAuthState {
    pub state: String,
    pub pkce: PKCE,
    pub provider: String,
}

impl OAuthState {
    /// Generate a new OAuth state with random state parameter
    pub fn new(provider: &str) -> Self {
        let mut rng = rand::thread_rng();
        let state_bytes: Vec<u8> = (0..16).map(|_| rng.gen()).collect();
        let state = URL_SAFE_NO_PAD.encode(&state_bytes);
        
        Self {
            state,
            pkce: PKCE::generate(),
            provider: provider.to_string(),
        }
    }
}

/// GitHub OAuth2 token response
#[derive(Debug, Deserialize, Serialize)]
pub struct GitHubTokenResponse {
    pub access_token: String,
    pub token_type: String,
    pub scope: String,
    #[serde(default)]
    pub refresh_token: Option<String>,
    #[serde(default)]
    pub expires_in: Option<u64>,
}

/// Stored credentials (encrypted in production)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OAuthCredentials {
    pub provider: String,
    pub access_token: String,
    pub refresh_token: Option<String>,
    pub expires_at: Option<u64>,
    pub scopes: Vec<String>,
}

/// Generate the authorization URL for GitHub OAuth
pub fn generate_auth_url(config: &GitHubOAuthConfig, state: &OAuthState) -> String {
    let mut params: HashMap<&str, String> = HashMap::new();
    params.insert("client_id", config.client_id.clone());
    params.insert("redirect_uri", config.redirect_uri.clone());
    params.insert("state", state.state.clone());
    params.insert("scope", config.scopes.join(" "));
    params.insert("response_type", "code".to_string());
    params.insert("code_challenge", state.pkce.code_challenge.clone());
    params.insert("code_challenge_method", "S256".to_string());
    
    let query_string = params
        .iter()
        .map(|(k, v)| format!("{}={}", urlencoding::encode(k), urlencoding::encode(v)))
        .collect::<Vec<_>>()
        .join("&");
    
    format!("{}?{}", config.auth_url, query_string)
}

/// Exchange authorization code for access token
pub async fn exchange_code_for_token(
    config: &GitHubOAuthConfig,
    code: &str,
    state: &OAuthState,
) -> Result<GitHubTokenResponse, OAuthError> {
    let client = reqwest::Client::new();
    
    let mut params: HashMap<&str, String> = HashMap::new();
    params.insert("client_id", config.client_id.clone());
    params.insert("client_secret", config.client_secret.clone());
    params.insert("code", code.to_string());
    params.insert("redirect_uri", config.redirect_uri.clone());
    params.insert("grant_type", "authorization_code".to_string());
    params.insert("code_verifier", state.pkce.code_verifier.clone());
    
    let response = client
        .post(&config.token_url)
        .header("Accept", "application/json")
        .form(&params)
        .send()
        .await
        .map_err(|e| OAuthError::RequestFailed(e.to_string()))?;
    
    let token_response: GitHubTokenResponse = response
        .json()
        .await
        .map_err(|e| OAuthError::ParseFailed(e.to_string()))?;
    
    Ok(token_response)
}

/// OAuth2 error types
#[derive(Debug, thiserror::Error)]
pub enum OAuthError {
    #[error("Authorization failed: {0}")]
    AuthorizationFailed(String),
    
    #[error("Token exchange failed: {0}")]
    TokenExchangeFailed(String),
    
    #[error("Request failed: {0}")]
    RequestFailed(String),
    
    #[error("Failed to parse response: {0}")]
    ParseFailed(String),
    
    #[error("State mismatch")]
    StateMismatch,
    
    #[error("Invalid code verifier")]
    InvalidCodeVerifier,
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_pkce_generation() {
        let pkce = PKCE::generate();
        assert!(!pkce.code_verifier.is_empty());
        assert!(!pkce.code_challenge.is_empty());
        assert!(pkce.code_verifier.len() >= 43);
    }
    
    #[test]
    fn test_state_generation() {
        let state = OAuthState::new("github");
        assert!(!state.state.is_empty());
        assert_eq!(state.provider, "github");
    }
}
