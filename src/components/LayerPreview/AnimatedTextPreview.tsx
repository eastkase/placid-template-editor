import React, { useEffect, useState, useRef } from 'react';
import { TextLayer } from '../../types';

interface AnimatedTextPreviewProps {
  layer: TextLayer;
  isPlaying?: boolean;
  onAnimationEnd?: () => void;
}

const AnimatedTextPreview: React.FC<AnimatedTextPreviewProps> = ({ 
  layer, 
  isPlaying = false,
  onAnimationEnd 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const cursorIntervalRef = useRef<number | undefined>(undefined);
  
  const animation = layer.animation;
  const fullText = layer.text;
  
  useEffect(() => {
    if (!isPlaying || !animation || animation.type === 'none') {
      setDisplayText(fullText);
      setShowCursor(false);
      return;
    }
    
    // Clear any existing animations
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (cursorIntervalRef.current) {
      clearInterval(cursorIntervalRef.current);
    }
    
    const startTime = performance.now();
    
    if (animation.type === 'typewriter' && animation.typewriter) {
      const { duration, startDelay, charDelay = 50, cursor, cursorChar = '|' } = animation.typewriter;
      const totalDuration = duration * 1000; // Convert to milliseconds
      const delayMs = startDelay * 1000;
      
      // Start cursor blinking
      if (cursor) {
        setShowCursor(true);
        cursorIntervalRef.current = window.setInterval(() => {
          setShowCursor(prev => !prev);
        }, 500);
      }
      
      const animate = (timestamp: number) => {
        const elapsed = timestamp - startTime - delayMs;
        
        if (elapsed < 0) {
          // Still in delay period
          setDisplayText('');
          animationRef.current = requestAnimationFrame(animate);
          return;
        }
        
        const progress = Math.min(elapsed / totalDuration, 1);
        const charactersToShow = Math.floor(fullText.length * progress);
        
        setDisplayText(fullText.substring(0, charactersToShow));
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Animation complete
          if (cursorIntervalRef.current) {
            clearInterval(cursorIntervalRef.current);
          }
          setShowCursor(false);
          onAnimationEnd?.();
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current);
      }
    };
  }, [isPlaying, animation, fullText, onAnimationEnd]);
  
  const getFadeStyle = () => {
    if (!animation || animation.type !== 'fade' || !animation.fade || !isPlaying) {
      return {};
    }
    
    const { duration, startDelay } = animation.fade;
    
    return {
      animation: `fadeIn ${duration}s ease-in-out ${startDelay}s forwards`,
      opacity: 0
    };
  };
  
  const getSlideStyle = () => {
    if (!animation || animation.type !== 'slide' || !animation.slide || !isPlaying) {
      return {};
    }
    
    const { duration, startDelay, direction } = animation.slide;
    let transform = '';
    
    switch (direction) {
      case 'left':
        transform = 'translateX(-100%)';
        break;
      case 'right':
        transform = 'translateX(100%)';
        break;
      case 'top':
        transform = 'translateY(-100%)';
        break;
      case 'bottom':
        transform = 'translateY(100%)';
        break;
    }
    
    return {
      animation: `slideIn${direction} ${duration}s ease-out ${startDelay}s forwards`,
      transform: transform
    };
  };
  
  const textToDisplay = animation?.type === 'typewriter' && isPlaying 
    ? displayText 
    : fullText;
  
  const cursorChar = animation?.typewriter?.cursorChar || '|';
  const shouldShowCursor = animation?.type === 'typewriter' && 
                          animation.typewriter?.cursor && 
                          showCursor && 
                          isPlaying;
  
  return (
    <div
      style={{
        fontSize: `${layer.font?.size || layer.fontSize || 32}px`,
        fontFamily: layer.font?.family || layer.fontFamily || 'Arial',
        fontWeight: layer.font?.weight || layer.fontWeight || 'normal',
        fontStyle: layer.font?.style || 'normal',
        textAlign: layer.alignment || layer.textAlign || 'left',
        color: layer.color || '#000000',
        lineHeight: layer.lineHeight || 1.2,
        letterSpacing: layer.letterSpacing ? `${layer.letterSpacing}px` : undefined,
        textTransform: layer.textTransform || 'none',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: layer.verticalAlignment === 'top' ? 'flex-start' :
                    layer.verticalAlignment === 'bottom' ? 'flex-end' : 'center',
        justifyContent: layer.alignment === 'left' ? 'flex-start' :
                       layer.alignment === 'right' ? 'flex-end' : 'center',
        padding: layer.textBox?.padding 
          ? `${layer.textBox.padding.top}px ${layer.textBox.padding.right}px ${layer.textBox.padding.bottom}px ${layer.textBox.padding.left}px`
          : '0',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        ...getFadeStyle(),
        ...getSlideStyle()
      }}
    >
      <span>
        {textToDisplay}
        {shouldShowCursor && <span className="typing-cursor">{cursorChar}</span>}
      </span>
    </div>
  );
};

export default AnimatedTextPreview;