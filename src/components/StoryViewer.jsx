import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, Sparkles, MapPin, Clock, Music, Cake, AtSign, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatScheduledTime } from '../utils/storage';

export default function StoryViewer({ 
  storyGroup, 
  onClose 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [liked, setLiked] = useState(false);

  const stories = storyGroup?.stories || [];
  const currentStory = stories[currentIndex] || {};
  const STORY_DURATION = 5000; // 5 seconds per story

  const startTimeRef = useRef(null);
  const pausedAtRef = useRef(0);

  const isBirthday = currentStory.isBirthday || currentStory.caption?.toLowerCase().includes('birthday');
  const isPrivate = currentStory.audience === 'close_friends';

  // Fire birthday confetti if opening a birthday story
  useEffect(() => {
    if (isBirthday) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#FF1493', '#8A2BE2', '#FFD700', '#00BA34', '#FFFFFF']
        });
      } catch (e) {
        // safe fallback
      }
    }
  }, [currentIndex, isBirthday]);

  useEffect(() => {
    setProgress(0);
    pausedAtRef.current = 0;
    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      if (isPaused) return;

      const elapsed = Date.now() - startTimeRef.current + pausedAtRef.current;
      const pct = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        handleNext();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, stories.length]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
      pausedAtRef.current = 0;
      startTimeRef.current = Date.now();
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
      pausedAtRef.current = 0;
      startTimeRef.current = Date.now();
    } else {
      setProgress(0);
      pausedAtRef.current = 0;
      startTimeRef.current = Date.now();
    }
  };

  const handleMouseDown = () => {
    setIsPaused(true);
  };

  const handleMouseUp = () => {
    setIsPaused(false);
    startTimeRef.current = Date.now();
    pausedAtRef.current = (progress / 100) * STORY_DURATION;
  };

  return (
    <div 
      className="story-viewer-modal"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      {/* Segmented Top Progress Bars */}
      <div className="viewer-progress-bars">
        {stories.map((s, idx) => {
          let fillWidth = 0;
          if (idx < currentIndex) fillWidth = 100;
          else if (idx === currentIndex) fillWidth = progress;
          else fillWidth = 0;

          return (
            <div key={idx} className="progress-bar-track">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${fillWidth}%` }} 
              />
            </div>
          );
        })}
      </div>

      {/* Viewer Header */}
      <div className="viewer-header">
        <div className="viewer-user-meta">
          <img 
            src={storyGroup.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"} 
            alt={storyGroup.username} 
            className="viewer-avatar"
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="viewer-username">{storyGroup.username}</span>
              
              {/* Private Story / Close Friends badge */}
              {isPrivate && (
                <span style={{
                  background: 'rgba(0, 186, 52, 0.25)',
                  border: '1px solid #00ba34',
                  color: '#00e640',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3
                }}>
                  <UserCheck size={10} />
                  <span>Close Friends</span>
                </span>
              )}

              {storyGroup.isUser && !isPrivate && (
                <span style={{
                  background: 'rgba(225, 48, 108, 0.3)',
                  border: '1px solid rgba(225, 48, 108, 0.6)',
                  color: '#ff85b8',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 8
                }}>
                  Auto-Published
                </span>
              )}
            </div>
            <div className="viewer-time">
              {currentStory.time || (currentStory.scheduledTime ? formatScheduledTime(currentStory.scheduledTime) : 'Just now')}
            </div>
          </div>
        </div>

        <button className="icon-btn" onClick={onClose} title="Close story">
          <X size={24} color="#fff" />
        </button>
      </div>

      {/* Main Story Content */}
      <div className="viewer-media-viewport">
        {/* Click zones for navigation */}
        <div className="viewer-tap-left" onClick={(e) => { e.stopPropagation(); handlePrev(); }} />
        <div className="viewer-tap-right" onClick={(e) => { e.stopPropagation(); handleNext(); }} />

        {currentStory.mediaType === 'video' ? (
          <video 
            src={currentStory.mediaUrl || currentStory.url} 
            autoPlay 
            loop 
            muted 
            playsInline
            className={`viewer-media-img filter-${currentStory.filter || 'normal'}`} 
          />
        ) : (
          <img 
            src={currentStory.mediaUrl || currentStory.url} 
            alt="Story" 
            className={`viewer-media-img filter-${currentStory.filter || 'normal'}`} 
          />
        )}

        {/* Clickable Mention Tag */}
        {currentStory.mentionedUser && (
          <div 
            className="story-sticker-tag"
            onClick={(e) => {
              e.stopPropagation();
              alert(`Profile tag: Mentioned friend ${currentStory.mentionedUser} received a 12:00 AM Birthday notification!`);
            }}
            style={{
              position: 'absolute',
              top: 75,
              left: 20,
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#111',
              fontWeight: 800,
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <AtSign size={13} color="var(--ig-pink)" />
            <span>{currentStory.mentionedUser.replace('@', '')}</span>
          </div>
        )}

        {/* Text Overlay */}
        {(currentStory.textOverlay || currentStory.caption) && (
          <div 
            className="story-overlay-text"
            style={{
              color: currentStory.textColor || '#fff',
              backgroundColor: currentStory.textBg || 'rgba(0,0,0,0.5)'
            }}
          >
            {currentStory.textOverlay || currentStory.caption}
          </div>
        )}

        {/* Birthday Sticker */}
        {isBirthday && (
          <div 
            className="story-sticker-tag"
            style={{
              bottom: 120,
              left: 20,
              background: 'linear-gradient(135deg, #FF1493, #8A2BE2)',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(255, 20, 147, 0.5)'
            }}
          >
            <Cake size={16} />
            <span>12:00 AM Midnight Birthday Drop 🎂</span>
          </div>
        )}

        {/* Location / Music Stickers */}
        {currentStory.sticker === 'location' && (
          <div className="story-sticker-tag sticker-location" style={{ bottom: 120, left: 20 }}>
            <MapPin size={14} />
            <span>{currentStory.stickerText || 'Malibu Beach'}</span>
          </div>
        )}
        {currentStory.sticker === 'time' && (
          <div className="story-sticker-tag sticker-time" style={{ bottom: 120, left: 20 }}>
            <Clock size={14} />
            <span>{currentStory.stickerText || '12:00 AM'}</span>
          </div>
        )}
        {currentStory.sticker === 'music' && (
          <div className="story-sticker-tag sticker-music">
            <Music size={14} />
            <span>Birthday Beats • Party Mix</span>
          </div>
        )}
      </div>

      {/* Bottom Reply Bar */}
      <div className="viewer-bottom-bar">
        <input 
          type="text" 
          placeholder={`Reply to ${storyGroup.username}...`} 
          className="viewer-reply-input"
          onClick={(e) => e.stopPropagation()}
        />
        <button 
          className="icon-btn" 
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          style={{ color: liked ? 'var(--ig-red)' : '#fff' }}
        >
          <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
        </button>
        <button 
          className="icon-btn" 
          onClick={(e) => {
            e.stopPropagation();
            alert('Story shared via DM!');
          }}
        >
          <Send size={22} color="#fff" />
        </button>
      </div>
    </div>
  );
}
