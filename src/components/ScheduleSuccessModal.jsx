import React, { useEffect } from 'react';
import { Check, Calendar, ArrowRight, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatScheduledDate, formatScheduledTime } from '../utils/storage';

export default function ScheduleSuccessModal({ 
  scheduledStory, 
  onDone, 
  onViewDashboard 
}) {
  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#e1306c', '#833ab4', '#f77737', '#00ba34', '#ffffff']
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  return (
    <div className="modal-overlay">
      <div className="schedule-sheet" style={{ borderTopRadius: 28 }}>
        <div className="sheet-handle" />

        <div className="success-screen-card">
          {/* Animated Glowing Ring Checkmark */}
          <div className="success-icon-ring">
            <Check size={42} strokeWidth={3} color="#fff" />
          </div>

          <h2 className="success-title">Story Scheduled!</h2>

          <p className="success-description">
            Your Story has been queued successfully and will be published automatically on{' '}
            <span className="highlight-time">
              {formatScheduledDate(scheduledStory.scheduledTime)}
            </span>{' '}
            at{' '}
            <span className="highlight-time">
              {formatScheduledTime(scheduledStory.scheduledTime)}
            </span>.
          </p>

          {/* Quick thumbnail recap */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: '#222228',
            padding: '8px 14px',
            borderRadius: 14,
            border: '1px solid #333',
            width: '100%',
            maxWidth: 320,
            marginTop: 4
          }}>
            <img 
              src={scheduledStory.mediaUrl} 
              alt="Story" 
              style={{ width: 44, height: 60, borderRadius: 8, objectFit: 'cover' }}
            />
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                {scheduledStory.caption || 'Good Vibes ✨'}
              </div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                Audience: {scheduledStory.audience === 'close_friends' ? '🟢 Close Friends' : '🌐 Everyone'}
              </div>
            </div>
          </div>

          {/* Primary Action: View Dashboard */}
          <button 
            className="btn-schedule-story-hero"
            style={{ marginTop: 12 }}
            onClick={onViewDashboard}
          >
            <span>View Scheduled Stories</span>
            <ArrowRight size={17} />
          </button>

          {/* Secondary Action: Return Home */}
          <button 
            className="action-bubble-btn btn-your-story"
            style={{ width: '100%', padding: '12px', marginTop: 4 }}
            onClick={onDone}
          >
            <Home size={16} />
            <span>Done / Return Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
