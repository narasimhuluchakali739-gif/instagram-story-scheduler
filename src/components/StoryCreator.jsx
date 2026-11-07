import React, { useState, useRef } from 'react';
import { 
  X, 
  Type, 
  Smile, 
  Sparkles, 
  Image as ImageIcon, 
  CalendarClock, 
  UserCheck, 
  AtSign, 
  Lock, 
  Globe, 
  MapPin, 
  Clock, 
  Music,
  Cake,
  Hash
} from 'lucide-react';
import { SAMPLE_IMAGES, FRIENDS_LIST } from '../utils/storage';

const FILTERS = [
  { id: 'normal', name: 'Normal' },
  { id: 'clarendon', name: 'Clarendon' },
  { id: 'juno', name: 'Juno' },
  { id: 'warm', name: 'Warm' },
  { id: 'tokyo', name: 'B&W' },
];

const TEXT_COLORS = [
  '#ffffff', '#000000', '#e1306c', '#0095f6', '#ffdd00', '#00ba34'
];

export default function StoryCreator({ 
  onClose, 
  onInitiateSchedule, 
  onPublishImmediately 
}) {
  // Universal clean defaults (works for ANY photo, video, or topic)
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=80');
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'
  const [textOverlay, setTextOverlay] = useState('Golden Hour ✨');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textBg, setTextBg] = useState('rgba(0, 0, 0, 0.5)');
  const [selectedFilter, setSelectedFilter] = useState('normal');
  const [activeSticker, setActiveSticker] = useState(null); // null by default
  const [stickerText, setStickerText] = useState('');
  const [mentionedUser, setMentionedUser] = useState(''); // empty by default
  const [isPrivateStory, setIsPrivateStory] = useState(false); // public by default
  const [isEditingText, setIsEditingText] = useState(false);
  const [showStickerMenu, setShowStickerMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showMentionMenu, setShowMentionMenu] = useState(false);

  const fileInputRef = useRef(null);

  // File upload handler for ANY user photo or video from computer
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video');
    setMediaType(isVideo ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = (event) => {
      setMediaUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (sample) => {
    setMediaUrl(sample.url);
    setMediaType(sample.type);
    if (sample.name.includes('Birthday')) {
      setTextOverlay('Happy Birthday! 🎂🎉');
      setActiveSticker('birthday');
      setStickerText('Midnight Birthday Drop 🎂');
    } else if (sample.name.includes('Cafe')) {
      setTextOverlay('Morning Coffee ☕');
      setActiveSticker(null);
    } else if (sample.name.includes('City')) {
      setTextOverlay('City Lights 🌃');
      setActiveSticker('location');
      setStickerText('Tokyo, Shibuya 📍');
    } else {
      setTextOverlay('Golden Hour ✨');
      setActiveSticker(null);
    }
  };

  // Build the current draft story payload
  const getCurrentStoryData = () => ({
    mediaUrl,
    mediaType,
    caption: textOverlay || 'My Instagram Story',
    textOverlay,
    textColor,
    textBg,
    filter: selectedFilter,
    sticker: activeSticker,
    stickerText,
    mentionedUser,
    audience: isPrivateStory ? 'close_friends' : 'everyone'
  });

  return (
    <div className="story-creator-view">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*,video/*" 
        style={{ display: 'none' }} 
      />

      {/* Top Controls Bar */}
      <div className="story-creator-topbar">
        <button className="creator-tool-btn" onClick={onClose} title="Cancel">
          <X size={20} />
        </button>

        {/* Audience / Privacy Switcher */}
        <button 
          onClick={() => setIsPrivateStory(!isPrivateStory)}
          style={{
            background: isPrivateStory ? 'rgba(0, 186, 52, 0.25)' : 'rgba(255, 255, 255, 0.15)',
            border: isPrivateStory ? '1px solid #00ba34' : '1px solid rgba(255,255,255,0.3)',
            color: isPrivateStory ? '#00e640' : '#fff',
            fontSize: '11px',
            fontWeight: 700,
            padding: '5px 12px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
          title="Click to toggle Public or Private (Close Friends) story"
        >
          {isPrivateStory ? <Lock size={12} /> : <Globe size={12} />}
          <span>{isPrivateStory ? 'Close Friends (Private)' : 'Public Story'}</span>
        </button>

        <div className="creator-tools-group">
          {/* Mention Friend (@) */}
          <button 
            className={`creator-tool-btn ${showMentionMenu || mentionedUser ? 'active' : ''}`}
            onClick={() => {
              setShowMentionMenu(!showMentionMenu);
              setShowStickerMenu(false);
              setShowFilterMenu(false);
            }}
            title="Mention Friend (@)"
          >
            <AtSign size={18} />
          </button>

          {/* Text Tool */}
          <button 
            className={`creator-tool-btn ${isEditingText ? 'active' : ''}`}
            onClick={() => setIsEditingText(!isEditingText)}
            title="Add / Edit Text"
          >
            <Type size={18} />
          </button>

          {/* Stickers */}
          <button 
            className={`creator-tool-btn ${showStickerMenu ? 'active' : ''}`}
            onClick={() => {
              setShowStickerMenu(!showStickerMenu);
              setShowFilterMenu(false);
              setShowMentionMenu(false);
            }}
            title="Stickers, Time, Location & More"
          >
            <Smile size={18} />
          </button>

          {/* Filters */}
          <button 
            className={`creator-tool-btn ${showFilterMenu ? 'active' : ''}`}
            onClick={() => {
              setShowFilterMenu(!showFilterMenu);
              setShowStickerMenu(false);
              setShowMentionMenu(false);
            }}
            title="Visual Filters"
          >
            <Sparkles size={18} />
          </button>

          {/* Upload media from computer */}
          <button 
            className="creator-tool-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Upload photo/video from computer"
          >
            <ImageIcon size={18} />
          </button>
        </div>
      </div>

      {/* Story Canvas / Preview Area */}
      <div className="story-canvas-area">
        {mediaUrl ? (
          <>
            {mediaType === 'video' ? (
              <video 
                src={mediaUrl} 
                autoPlay 
                loop 
                muted 
                playsInline
                className={`story-media-render filter-${selectedFilter}`} 
              />
            ) : (
              <img 
                src={mediaUrl} 
                alt="Story content" 
                className={`story-media-render filter-${selectedFilter}`} 
              />
            )}

            {/* Optional Mention Tag */}
            {mentionedUser && (
              <div 
                className="story-sticker-tag"
                onClick={() => setShowMentionMenu(true)}
                style={{
                  position: 'absolute',
                  top: 75,
                  left: 20,
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#111',
                  fontWeight: 800,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                  cursor: 'pointer'
                }}
              >
                <AtSign size={13} color="var(--ig-pink)" />
                <span>{mentionedUser.replace('@', '')}</span>
              </div>
            )}

            {/* Private Story Badge */}
            {isPrivateStory && (
              <div style={{
                position: 'absolute',
                top: 75,
                right: 20,
                background: 'rgba(0, 186, 52, 0.9)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <UserCheck size={12} />
                <span>Close Friends</span>
              </div>
            )}

            {/* Text Overlay */}
            {textOverlay && (
              <div 
                className="story-overlay-text"
                style={{ 
                  color: textColor, 
                  backgroundColor: textBg 
                }}
                onClick={() => setIsEditingText(true)}
              >
                {textOverlay}
              </div>
            )}

            {/* Render Stickers */}
            {activeSticker === 'location' && (
              <div className="story-sticker-tag sticker-location" style={{ bottom: 120, left: 20 }}>
                <MapPin size={14} />
                <span>{stickerText || 'Malibu Beach 🌊'}</span>
              </div>
            )}
            {activeSticker === 'time' && (
              <div className="story-sticker-tag sticker-time" style={{ bottom: 120, left: 20 }}>
                <Clock size={14} />
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
            {activeSticker === 'music' && (
              <div className="story-sticker-tag sticker-music">
                <Music size={14} />
                <span>Trending Beats • Original Sound</span>
              </div>
            )}
            {activeSticker === 'birthday' && (
              <div 
                className="story-sticker-tag"
                style={{
                  bottom: 120,
                  left: 20,
                  background: 'linear-gradient(135deg, #FF1493, #8A2BE2)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 4px 15px rgba(255, 20, 147, 0.4)'
                }}
              >
                <Cake size={15} />
                <span>{stickerText || 'Midnight Birthday Drop 🎂'}</span>
              </div>
            )}
          </>
        ) : (
          <div className="empty-upload-box">
            <div className="empty-upload-icon">
              <ImageIcon size={36} />
            </div>
            <p style={{ fontWeight: 600, color: '#fff', marginBottom: 4 }}>No Media Selected</p>
            <p style={{ fontSize: 12, marginBottom: 16 }}>Upload any photo or video from your computer</p>
            <button 
              className="action-bubble-btn btn-your-story"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose from Computer
            </button>
          </div>
        )}

        {/* Mention Friend Drawer */}
        {showMentionMenu && (
          <div style={{
            position: 'absolute',
            top: 60,
            left: 16,
            right: 16,
            background: 'rgba(20, 20, 24, 0.98)',
            border: '1px solid #3d3d4a',
            backdropFilter: 'blur(12px)',
            borderRadius: 16,
            padding: 14,
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <AtSign size={16} color="var(--ig-pink)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Mention Friends in Story</span>
              </div>
              <button 
                onClick={() => setShowMentionMenu(false)}
                style={{ background: 'none', border: 'none', color: '#0095f6', fontWeight: 600, cursor: 'pointer' }}
              >
                Done
              </button>
            </div>

            <input 
              type="text" 
              value={mentionedUser} 
              onChange={(e) => setMentionedUser(e.target.value.startsWith('@') || e.target.value === '' ? e.target.value : `@${e.target.value}`)}
              placeholder="Type @username to tag..."
              style={{
                background: '#111',
                border: '1px solid #444',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none'
              }}
            />

            <span style={{ fontSize: 11, color: '#aaa' }}>Quick select:</span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {FRIENDS_LIST.map(f => (
                <button 
                  key={f.username}
                  className="sample-pill-btn"
                  onClick={() => {
                    setMentionedUser(`@${f.username}`);
                    setShowMentionMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    borderColor: mentionedUser === `@${f.username}` ? 'var(--ig-pink)' : '#3d3d3d'
                  }}
                >
                  <img src={f.avatar} style={{ width: 16, height: 16, borderRadius: '50%' }} alt="" />
                  <span>@{f.username}</span>
                </button>
              ))}
              {mentionedUser && (
                <button 
                  className="sample-pill-btn"
                  onClick={() => { setMentionedUser(''); setShowMentionMenu(false); }}
                  style={{ color: '#ff6470' }}
                >
                  ✕ Remove Mention
                </button>
              )}
            </div>
          </div>
        )}

        {/* Text Editing Floating Palette */}
        {isEditingText && (
          <div style={{
            position: 'absolute',
            bottom: 20,
            left: 16,
            right: 16,
            background: 'rgba(20, 20, 24, 0.95)',
            border: '1px solid #333',
            backdropFilter: 'blur(10px)',
            borderRadius: 16,
            padding: 14,
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Edit Story Text</span>
              <button 
                onClick={() => setIsEditingText(false)}
                style={{ background: 'none', border: 'none', color: '#0095f6', fontWeight: 600, cursor: 'pointer' }}
              >
                Done
              </button>
            </div>
            <input 
              type="text" 
              value={textOverlay} 
              onChange={(e) => setTextOverlay(e.target.value)}
              placeholder="Type your story text or caption..."
              style={{
                background: '#111',
                border: '1px solid #444',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 14,
                outline: 'none'
              }}
              autoFocus
            />
            {/* Color swatches */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#aaa' }}>Color:</span>
              {TEXT_COLORS.map(c => (
                <div 
                  key={c} 
                  onClick={() => setTextColor(c)}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: c,
                    cursor: 'pointer',
                    border: textColor === c ? '2px solid #fff' : '1px solid #444',
                    transform: textColor === c ? 'scale(1.15)' : 'none'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stickers Menu Drawer */}
        {showStickerMenu && (
          <div style={{
            position: 'absolute',
            top: 60,
            left: 16,
            right: 16,
            background: 'rgba(20, 20, 24, 0.95)',
            border: '1px solid #333',
            backdropFilter: 'blur(10px)',
            borderRadius: 16,
            padding: 12,
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Add Sticker</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button 
                className={`sample-pill-btn ${activeSticker === 'location' ? 'active' : ''}`}
                onClick={() => { setActiveSticker('location'); setStickerText('Malibu Beach 🌊'); setShowStickerMenu(false); }}
              >
                📍 Location
              </button>
              <button 
                className={`sample-pill-btn ${activeSticker === 'time' ? 'active' : ''}`}
                onClick={() => { setActiveSticker('time'); setShowStickerMenu(false); }}
              >
                🕒 Current Time
              </button>
              <button 
                className={`sample-pill-btn ${activeSticker === 'music' ? 'active' : ''}`}
                onClick={() => { setActiveSticker('music'); setShowStickerMenu(false); }}
              >
                🎵 Music
              </button>
              <button 
                className={`sample-pill-btn ${activeSticker === 'birthday' ? 'active' : ''}`}
                onClick={() => { setActiveSticker('birthday'); setStickerText('Happy Birthday! 🎂'); setShowStickerMenu(false); }}
              >
                🎂 Birthday
              </button>
              <button 
                className="sample-pill-btn"
                onClick={() => { setActiveSticker(null); setShowStickerMenu(false); }}
                style={{ color: '#ff6470' }}
              >
                ✕ Clear Sticker
              </button>
            </div>
          </div>
        )}

        {/* Filters Menu Drawer */}
        {showFilterMenu && (
          <div style={{
            position: 'absolute',
            top: 60,
            left: 16,
            right: 16,
            background: 'rgba(20, 20, 24, 0.95)',
            border: '1px solid #333',
            backdropFilter: 'blur(10px)',
            borderRadius: 16,
            padding: 12,
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Photo Filter</span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FILTERS.map(f => (
                <button 
                  key={f.id}
                  className={`sample-pill-btn ${selectedFilter === f.id ? 'active' : ''}`}
                  onClick={() => { setSelectedFilter(f.id); setShowFilterMenu(false); }}
                  style={{
                    borderColor: selectedFilter === f.id ? 'var(--ig-pink)' : '#3d3d3d',
                    background: selectedFilter === f.id ? '#331525' : '#262626'
                  }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preset Quick Selectors */}
      <div style={{ padding: '6px 16px', background: '#0a0a0c', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#777', whiteSpace: 'nowrap' }}>Presets:</span>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {SAMPLE_IMAGES.map((sample, idx) => (
            <button 
              key={idx}
              className="sample-pill-btn"
              onClick={() => handleApplyPreset(sample)}
            >
              {sample.name}
            </button>
          ))}
        </div>
      </div>

      {/* Story Creator Bottom Actions (Screen 2) */}
      <div className="story-creator-bottombar">
        {/* NEW FEATURE HIGHLIGHT: SCHEDULE STORY BUTTON */}
        <button 
          className="btn-schedule-story-hero"
          onClick={() => onInitiateSchedule(getCurrentStoryData())}
        >
          <CalendarClock size={19} />
          <span>Schedule Story</span>
          <span className="new-feature-badge">Set Date & Time</span>
        </button>

        {/* Existing Instagram Options */}
        <div className="creator-bottom-row">
          <button 
            className="action-bubble-btn btn-your-story"
            onClick={() => onPublishImmediately(getCurrentStoryData(), 'everyone')}
            title="Publish now to your story"
          >
            <span>Your Story (Public)</span>
          </button>

          <button 
            className="action-bubble-btn btn-close-friends"
            onClick={() => onPublishImmediately(getCurrentStoryData(), 'close_friends')}
            title="Publish now to close friends"
          >
            <UserCheck size={14} />
            <span>Close Friends (Private)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
