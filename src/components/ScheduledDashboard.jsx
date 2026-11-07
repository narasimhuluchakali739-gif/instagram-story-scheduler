import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Trash2, 
  Edit3, 
  Play, 
  Plus, 
  RotateCcw, 
  AtSign,
  Lock,
  Globe,
  FastForward,
  Eye
} from 'lucide-react';
import { 
  formatScheduledDate, 
  formatScheduledTime, 
  getTimeRelativeString 
} from '../utils/storage';

export default function ScheduledDashboard({ 
  stories, 
  onClose, 
  onDeleteStory, 
  onRescheduleStory, 
  onPublishNow, 
  onViewPublishedStory,
  onOpenCreator,
  onFastForwardAll
}) {
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'scheduled' | 'published' | 'private'
  const [reschedulingId, setReschedulingId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // Filter stories according to active tab
  const filteredStories = stories.filter(story => {
    if (filterTab === 'all') return true;
    if (filterTab === 'scheduled') return story.status === 'scheduled';
    if (filterTab === 'published') return story.status === 'published';
    if (filterTab === 'private') return story.audience === 'close_friends';
    return true;
  });

  const scheduledCount = stories.filter(s => s.status === 'scheduled').length;
  const privateCount = stories.filter(s => s.audience === 'close_friends').length;
  const publishedCount = stories.filter(s => s.status === 'published').length;

  const handleStartReschedule = (story) => {
    setReschedulingId(story.id);
    const d = new Date(story.scheduledTime);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    setNewDate(`${yyyy}-${mm}-${dd}`);
    setNewTime(`${hh}:${min}`);
  };

  const handleSaveReschedule = (storyId) => {
    if (!newDate || !newTime) return;
    const [yyyy, mm, dd] = newDate.split('-').map(Number);
    const [hrs, mins] = newTime.split(':').map(Number);
    const target = new Date(yyyy, mm - 1, dd, hrs, mins, 0);

    onRescheduleStory(storyId, target.toISOString());
    setReschedulingId(null);
  };

  return (
    <div className="dashboard-view">
      {/* Header */}
      <div className="dashboard-header">
        <button className="icon-btn" onClick={onClose} title="Back">
          <ArrowLeft size={20} />
        </button>
        <div className="dashboard-title">
          <Calendar size={18} style={{ color: 'var(--ig-pink)' }} />
          <span>Scheduled Stories</span>
        </div>
        <button 
          className="icon-btn" 
          onClick={onOpenCreator} 
          title="Schedule New Story"
          style={{ color: 'var(--ig-pink)' }}
        >
          <Plus size={22} />
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="dashboard-tabs">
        <button 
          className={`dash-tab-btn ${filterTab === 'all' ? 'active' : ''}`}
          onClick={() => setFilterTab('all')}
        >
          All ({stories.length})
        </button>
        <button 
          className={`dash-tab-btn ${filterTab === 'scheduled' ? 'active' : ''}`}
          onClick={() => setFilterTab('scheduled')}
        >
          Scheduled ({scheduledCount})
        </button>
        <button 
          className={`dash-tab-btn ${filterTab === 'private' ? 'active' : ''}`}
          onClick={() => setFilterTab('private')}
          style={filterTab === 'private' ? {} : { color: '#00e640' }}
        >
          🔒 Private ({privateCount})
        </button>
        <button 
          className={`dash-tab-btn ${filterTab === 'published' ? 'active' : ''}`}
          onClick={() => setFilterTab('published')}
        >
          Published ({publishedCount})
        </button>
      </div>

      {/* Stories Cards List */}
      <div className="scheduled-cards-list">
        {filteredStories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
            <Calendar size={48} style={{ color: '#333', marginBottom: 12 }} />
            <p style={{ fontWeight: 600, color: '#aaa', fontSize: 14 }}>No stories found</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Schedule any story for your preferred date and time.</p>
            <button 
              className="action-bubble-btn btn-your-story" 
              style={{ marginTop: 16, marginInline: 'auto' }}
              onClick={onOpenCreator}
            >
              <Plus size={14} />
              <span>Schedule a Story</span>
            </button>
          </div>
        ) : (
          filteredStories.map((story) => (
            <div key={story.id} className="scheduled-item-card">
              <div className="card-main-row">
                {/* Media Thumbnail */}
                {story.mediaType === 'video' ? (
                  <video src={story.mediaUrl} className="card-story-thumb" />
                ) : (
                  <img 
                    src={story.mediaUrl} 
                    alt={story.caption} 
                    className="card-story-thumb" 
                  />
                )}

                {/* Content & Metadata */}
                <div className="card-content-area">
                  <div className="card-header-line">
                    <span className="card-title">
                      {story.caption || story.textOverlay || 'Untitled Story'}
                    </span>
                    <span className={`status-pill status-${story.status}`}>
                      {story.status}
                    </span>
                  </div>

                  {/* Optional Tags */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                    {story.mentionedUser && (
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3
                      }}>
                        <AtSign size={10} color="var(--ig-pink)" />
                        <span>{story.mentionedUser}</span>
                      </span>
                    )}

                    <span style={{
                      background: story.audience === 'close_friends' ? 'rgba(0, 186, 52, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                      border: story.audience === 'close_friends' ? '1px solid rgba(0, 186, 52, 0.4)' : '1px solid rgba(255, 255, 255, 0.15)',
                      color: story.audience === 'close_friends' ? '#00e640' : '#aaa',
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3
                    }}>
                      {story.audience === 'close_friends' ? (
                        <>
                          <Lock size={10} />
                          <span>Close Friends</span>
                        </>
                      ) : (
                        <>
                          <Globe size={10} />
                          <span>Public</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="card-schedule-info">
                    <Clock size={13} style={{ color: 'var(--ig-pink)', flexShrink: 0 }} />
                    <div>
                      {story.status === 'scheduled' ? (
                        <>
                          <span>Publishes: </span>
                          <span className="card-time-highlight">
                            {formatScheduledDate(story.scheduledTime)} at {formatScheduledTime(story.scheduledTime)}
                          </span>
                          <span style={{ color: '#888', marginLeft: 4 }}>
                            ({getTimeRelativeString(story.scheduledTime)})
                          </span>
                        </>
                      ) : story.status === 'published' ? (
                        <>
                          <span style={{ color: '#00e640' }}>Published live</span>
                          <span style={{ color: '#888', marginLeft: 4 }}>
                            • {formatScheduledDate(story.scheduledTime)}
                          </span>
                        </>
                      ) : (
                        <span style={{ color: '#ff6470' }}>
                          Upload failed (Simulated network test)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Inline Reschedule Editor (Select ANY Date and Time) */}
              {reschedulingId === story.id && (
                <div style={{
                  background: '#1d1d23',
                  padding: 10,
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  border: '1px solid #3d3d4a'
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#ff7bb0' }}>
                    Reschedule Date & Time
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input 
                      type="date" 
                      value={newDate} 
                      onChange={(e) => setNewDate(e.target.value)}
                      className="picker-input"
                      style={{ flex: 1, padding: 6, fontSize: 12 }}
                    />
                    <input 
                      type="time" 
                      value={newTime} 
                      onChange={(e) => setNewTime(e.target.value)}
                      className="picker-input"
                      style={{ flex: 1, padding: 6, fontSize: 12 }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button 
                      className="card-action-btn"
                      onClick={() => setReschedulingId(null)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="card-action-btn primary"
                      onClick={() => handleSaveReschedule(story.id)}
                    >
                      Save New Time
                    </button>
                  </div>
                </div>
              )}

              {/* Footer Action Buttons */}
              <div className="card-footer-actions">
                <div style={{ display: 'flex', gap: 6 }}>
                  {story.status === 'scheduled' && (
                    <>
                      {/* Publish Now (Simulation helper) */}
                      <button 
                        className="card-action-btn primary"
                        onClick={() => onPublishNow(story.id)}
                        title="Simulate instant publish now"
                      >
                        <Play size={12} fill="currentColor" />
                        <span>Publish Now</span>
                      </button>

                      {/* Reschedule */}
                      <button 
                        className="card-action-btn"
                        onClick={() => handleStartReschedule(story)}
                        title="Change to any other date or time"
                      >
                        <Edit3 size={12} />
                        <span>Reschedule</span>
                      </button>
                    </>
                  )}

                  {story.status === 'published' && (
                    <button 
                      className="card-action-btn"
                      onClick={() => onViewPublishedStory(story)}
                      title="View live story"
                    >
                      <Eye size={12} />
                      <span>View Story</span>
                    </button>
                  )}

                  {story.status === 'failed' && (
                    <button 
                      className="card-action-btn primary"
                      onClick={() => onPublishNow(story.id)}
                      title="Retry publish"
                    >
                      <RotateCcw size={12} />
                      <span>Retry Publish</span>
                    </button>
                  )}
                </div>

                {/* Cancel / Delete */}
                <button 
                  className="card-action-btn danger"
                  onClick={() => onDeleteStory(story.id)}
                  title="Remove from schedule"
                >
                  <Trash2 size={13} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Demo Fast-Forward Simulation Bar */}
      <div className="sim-controls-bar">
        <span className="sim-controls-title">Simulation Tools:</span>
        <button 
          className="sim-btn-pill"
          onClick={onFastForwardAll}
          title="Fast-forwards clock to auto-publish all scheduled stories"
        >
          <FastForward size={13} style={{ color: 'var(--ig-pink)' }} />
          <span>Simulate Target Time Now</span>
        </button>
      </div>
    </div>
  );
}
