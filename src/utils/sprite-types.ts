/**
 * Sprite type definitions
 */

export type SpriteState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'happy'
  | 'worried'
  | 'error';

export interface SpriteTheme {
  name: string;
  version: string;
  author: string;
  description: string;
  states: Record<SpriteState, string>;
  settings: {
    animation_speed: number;
    loop: boolean;
    background: string;
  };
}

export interface SpriteEvent {
  event_type: 'user_input' | 'tool_start' | 'tool_complete' | 'timeout';
  tool_name?: string;
  tool_params?: Record<string, any>;
  success?: boolean;
  timestamp?: number;
}

/**
 * Default sprite states with descriptions
 */
export const SPRITE_STATES: Record<SpriteState, { description: string; color: string }> = {
  idle: {
    description: 'Waiting for input',
    color: '#667eea',
  },
  listening: {
    description: 'Listening to user',
    color: '#48bb78',
  },
  thinking: {
    description: 'Processing request',
    color: '#ecc94b',
  },
  happy: {
    description: 'Task completed successfully',
    color: '#48bb78',
  },
  worried: {
    description: 'Dangerous operation detected',
    color: '#ed8936',
  },
  error: {
    description: 'Something went wrong',
    color: '#f56565',
  },
};

/**
 * Available themes (extensible via community contributions)
 */
export const AVAILABLE_THEMES = [
  { id: 'default', name: 'Default', description: 'Classic Hermes sprite' },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neon-futuristic style' },
  { id: 'retro-pixel', name: 'Retro Pixel', description: '8-bit pixel art style' },
  { id: 'minimal', name: 'Minimal', description: 'Clean, simple shapes' },
  { id: 'cozy-cabin', name: 'Cozy Cabin', description: 'Warm, comforting style' },
];
