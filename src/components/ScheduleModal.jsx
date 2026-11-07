import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Globe, 
  UserCheck, 
  Info, 
  ArrowLeft, 
  CheckCircle2,
  Sparkles,
  Lock,
  AtSign
} from 'lucide-react';
import { formatScheduledDate, formatScheduledTime, FRIENDS_LIST } from '../utils/storage';

export default function ScheduleModal({ 
  storyDraft, 
  onClose, 
  onConfirmSchedule 
}) {
  // Default target time: 1 hour from now
  const defaultTarget = new Date(Date.now() + 1000 * 60 * 60);

  const formatDateForInput = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatTimeForInput = (d) => {
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${min}`;
  };

  const [dateStr, setDateStr] = useState(formatDateForInput(defaultTarget));
  const [timeStr, setTimeStr] = useState(formatTimeForInput(defaultTarget));
  const [audience, setAudience] = useState(storyDraft?.audience || 'everyone'); // default to public
  const [caption, setCaption] = useState(storyDraft?.caption || storyDraft?.textOverlay || 'My Story');
  const [mentionedUser, setMentionedUser] = useState(storyDraft?.mentionedUser || '');

  // Quick shortcut setters for ANY time convenience
  const setQuickTime = (type) => {
    const now = new Date();
    if (type === '15min') {
      const target = new Date(now.getTime() + 1000 * 60 * 15);
      setDateStr(formatDateForInput(target));
      setTimeStr(formatTimeForInput(target));
    } else if (type === '1hour') {
      const target = new Date(now.getTime() + 1000 * 60 * 60);
      setDateStr(formatDateForInput(target));
      setTimeStr(formatTimeForInput(target));
    } else if (type === 'tomorrow9am') {
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0);
      setDateStr(formatDateForInput(target));
      setTimeStr('09:00');
    } else if (type === 'tomorrow6pm') {
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18, 0);
      setDateStr(formatDateForInput(target));
      setTimeStr('18:00');
    } else if (type === 'midnight') {
      // 12:00 AM tonight
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      setDateStr(formatDateForInput(midnight));
      setTimeStr('00:00');
    }
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!dateStr || !timeStr) {
      alert('Please choose both a valid date and time.');
      return;
    }

    const [yyyy, mm, dd] = dateStr.split('-').map(Number);
    const [hrs, mins] = timeStr.split(':').map(Number);
    const scheduledDateTime = new Date(yyyy, mm - 1, dd, hrs, mins, 0);

    const scheduledStoryItem = {
      ...storyDraft,
      id: 'story-' + Date.now(),
      caption,
      audience,
      mentionedUser,
      scheduledTime: scheduledDateTime.toISOString(),
      createdAt: new Date().toISOString(),
      status: 'scheduled',
      viewsCount: 0
    };

    onConfirmSchedule(scheduledStoryItem);
  };

  // Compute preview string
  const currentPreviewDate = new Date(`${dateStr}T${timeStr}`);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="schedule-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        {/* Header (Back button + Title) */}
        <div className="sheet-header">
          <button 
            className="icon-btn" 
            onClick={onClose} 
            title="Back to story editor"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="sheet-title">
            <Sparkles size={18} style={{ color: 'var(--ig-pink)' }} />
            <span>Schedule Story</span>
          </div>
          <div style={{ width: 32 }} /> {/* Spacer for centering */}
        </div>

        {/* Story Thumbnail & Caption preview */}
        <div className="sheet-preview-card">
          {storyDraft?.mediaType === 'video' ? (
            <video src={storyDraft?.mediaUrl} className="sheet-thumb" />
          ) : (
            <img 
              src={storyDraft?.mediaUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80'} 
              alt="Story Preview" 
              className="sheet-thumb" 
            />
          )}
          <div className="sheet-preview-details">
            <input 
              type="text" 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add story caption or note..."
              className="sheet-preview-caption"
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1px dashed #444',
                padding: '2px 0',
                outline: 'none',
                color: '#fff'
              }}
            />
            <div className="sheet-preview-meta">
              Will publish automatically on{' '}
              <strong style={{ color: '#fff' }}>
                {formatScheduledDate(currentPreviewDate.toISOString())}
              </strong>{' '}
              at{' '}
              <strong style={{ color: '#ff85b8' }}>
                {formatScheduledTime(currentPreviewDate.toISOString())}
              </strong>
            </div>
            {mentionedUser && (
              <div style={{ fontSize: 11, color: '#ff85b8', marginTop: 2 }}>
                Tagged: {mentionedUser}
              </div>
            )}
          </div>
        </div>

        {/* Date & Time Picker Controls (Set ANY specific time) */}
        <div className="picker-group">
          {/* Exact Date Picker */}
          <div className="picker-row">
            <div className="picker-label">
              <Calendar size={18} style={{ color: 'var(--ig-pink)' }} />
              <span>Select Date</span>
            </div>
            <input 
              type="date" 
              value={dateStr}
              min={formatDateForInput(new Date())}
              onChange={(e) => setDateStr(e.target.value)}
              className="picker-input"
            />
          </div>

          {/* Exact Time Picker */}
          <div className="picker-row">
            <div className="picker-label">
              <Clock size={18} style={{ color: 'var(--ig-purple)' }} />
              <span>Select Exact Time</span>
            </div>
            <input 
              type="time" 
              value={timeStr}
              onChange={(e) => setTimeStr(e.target.value)}
              className="picker-input"
            />
          </div>

          {/* Quick timing shortcuts for convenience */}
          <div className="shortcuts-scroll">
            <button className="shortcut-chip" onClick={() => setQuickTime('15min')}>
              ⚡ +15 Mins
            </button>
            <button className="shortcut-chip" onClick={() => setQuickTime('1hour')}>
              🕒 +1 Hour
            </button>
            <button className="shortcut-chip" onClick={() => setQuickTime('tomorrow9am')}>
              🌅 Tomorrow 9:00 AM
            </button>
            <button className="shortcut-chip" onClick={() => setQuickTime('tomorrow6pm')}>
              🌆 Tomorrow 6:00 PM
            </button>
            <button className="shortcut-chip" onClick={() => setQuickTime('midnight')}>
              🌙 Tonight 12:00 AM
            </button>
          </div>
        </div>

        {/* Story Privacy: Public Story vs Private Close Friends */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#aaa', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>Audience / Privacy</span>
          </div>
          <div className="audience-selector">
            <button 
              type="button"
              className={`audience-btn ${audience === 'everyone' ? 'active' : ''}`}
              onClick={() => setAudience('everyone')}
            >
              <Globe size={15} />
              <span>Public Story (Everyone)</span>
            </button>
            <button 
              type="button"
              className={`audience-btn cf ${audience === 'close_friends' ? 'active' : ''}`}
              onClick={() => setAudience('close_friends')}
            >
              <UserCheck size={15} />
              <span>Close Friends (Private)</span>
            </button>
          </div>
        </div>

        {/* Optional Friend Mention */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#aaa', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
            <AtSign size={13} color="var(--ig-pink)" />
            <span>Mention Friend (Optional)</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input 
              type="text" 
              value={mentionedUser} 
              onChange={(e) => setMentionedUser(e.target.value)}
              placeholder="e.g. @friend_username (leave empty for none)"
              className="picker-input"
              style={{ flex: 1 }}
            />
            {FRIENDS_LIST.slice(0, 2).map(f => (
              <button
                key={f.username}
                type="button"
                className="shortcut-chip"
                onClick={() => setMentionedUser(`@${f.username}`)}
                style={{ fontSize: 10, padding: '4px 8px' }}
              >
                @{f.username}
              </button>
            ))}
          </div>
        </div>

        {/* Informative Notice */}
        <div className="prototype-callout">
          <Info size={16} style={{ flexShrink: 0, marginTop: 1, color: '#ff7bb0' }} />
          <div>
            <strong>Auto-Publish Prototype:</strong> This story will be scheduled locally and automatically published at your exact selected date and time.
          </div>
        </div>

        {/* Primary Schedule Button */}
        <button 
          className="btn-schedule-story-hero" 
          onClick={handleScheduleSubmit}
        >
          <CheckCircle2 size={18} />
          <span>Schedule Story for {formatScheduledTime(currentPreviewDate.toISOString())}</span>
        </button>
      </div>
    </div>
  );
}
