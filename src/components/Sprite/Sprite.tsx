import React, { useEffect, useRef, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { SpriteState } from '../utils/sprite-types';

interface SpriteProps {
  state: SpriteState;
  theme?: string;
  size?: 'small' | 'medium' | 'large';
  showEmotions?: boolean;
  animationSpeed?: number;
  className?: string;
}

/**
 * Sprite Component - Renders the animated sprite based on current state
 * 
 * Uses Lottie for smooth, lightweight animations (~50KB per state)
 * Zero token cost - state decisions are made by Python backend
 */
export function Sprite({
  state = 'idle',
  theme = 'default',
  size = 'medium',
  showEmotions = true,
  animationSpeed = 1.0,
  className = '',
}: SpriteProps) {
  const playerRef = useRef<Player>(null);
  const [animationData, setAnimationData] = useState<any>(null);
  const [previousState, setPreviousState] = useState<SpriteState>('idle');

  // Size mapping
  const sizeMap = {
    small: 100,
    medium: 200,
    large: 300,
  };

  // Load sprite animation when state changes
  useEffect(() => {
    if (!showEmotions) {
      setAnimationData(null);
      return;
    }

    const loadAnimation = async () => {
      try {
        // In production, these would be imported or fetched
        const response = await fetch(`/sprites/${theme}/${state}.json`);
        const data = await response.json();
        setAnimationData(data);
        setPreviousState(state);
      } catch (error) {
        console.error(`Failed to load sprite for state: ${state}`, error);
        // Fallback to idle if animation fails to load
        if (state !== 'idle') {
          setPreviousState('idle');
        }
      }
    };

    loadAnimation();
  }, [state, theme, showEmotions]);

  // Handle animation events
  const handleAnimationComplete = () => {
    // Loop animations for continuous states (idle, listening, thinking)
    const loopStates: SpriteState[] = ['idle', 'listening', 'thinking'];
    if (playerRef.current && loopStates.includes(state)) {
      playerRef.current.play();
    }
  };

  // Don't render if emotions disabled
  if (!showEmotions) {
    return (
      <div
        className={`sprite-placeholder ${className}`}
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      />
    );
  }

  return (
    <div className={`sprite-container ${className}`}>
      {animationData ? (
        <Player
          ref={playerRef}
          autoplay
          loop={state !== 'happy' && state !== 'error'} // One-shot for reactive states
          speed={animationSpeed}
          src={animationData}
          style={{
            width: sizeMap[size],
            height: sizeMap[size],
          }}
          onEvent={handleAnimationComplete}
        />
      ) : (
        // Loading placeholder
        <div
          style={{
            width: sizeMap[size],
            height: sizeMap[size],
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            animation: 'pulse 1s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
}

/**
 * Sprite with tooltip showing current state (for debugging)
 */
export function SpriteWithTooltip(props: SpriteProps) {
  return (
    <div className="relative">
      <Sprite {...props} />
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
        {props.state}
      </div>
    </div>
  );
}

export default Sprite;
