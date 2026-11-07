import React from 'react';
import { CalendarClock, Heart, MessageCircle, Sparkles } from 'lucide-react';

export default function Header({ scheduledCount, onOpenScheduleDashboard, onOpenStoryCreator }) {
  return (
    <>
      {/* Top Prototype Badge Banner */}
      <div className="prototype-badge-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="prototype-pill">Feature Concept</span>
          <span>Story Scheduler Prototype</span>
        </div>
        <button
          onClick={onOpenScheduleDashboard}
          style={{
            background: 'none',
            border: 'none',
            color: '#ff8fc4',
            fontSize: '11px',
            cursor: 'pointer',
            fontWeight: '600',
            textDecoration: 'underline'
          }}
        >
          View Dashboard ({scheduledCount})
        </button>
      </div>

      {/* Main Instagram Header */}
      <header className="ig-header">
        <h1 className="ig-logo">Instagram</h1>

        <div className="header-actions">
          {/* Quick Schedule Button in Header */}
          <button 
            className="schedule-nav-pill" 
            onClick={onOpenScheduleDashboard}
            title="Open Scheduled Stories Dashboard"
          >
            <CalendarClock size={14} />
            <span>Schedule</span>
            {scheduledCount > 0 && (
              <span style={{ 
                background: 'rgba(255,255,255,0.3)', 
                padding: '1px 5px', 
                borderRadius: '8px', 
                fontSize: '10px' 
              }}>
                {scheduledCount}
              </span>
            )}
          </button>

          <button className="icon-btn" title="Activity" onClick={() => alert('Notifications simulation: All caught up!')}>
            <Heart size={22} />
          </button>
          
          <button className="icon-btn" title="Messages" onClick={() => alert('Direct Messages simulation')}>
            <MessageCircle size={22} />
          </button>
        </div>
      </header>
    </>
  );
}
