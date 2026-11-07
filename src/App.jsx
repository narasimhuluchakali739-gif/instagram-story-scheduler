import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StoryTray from './components/StoryTray';
import FeedPost from './components/FeedPost';
import StoryCreator from './components/StoryCreator';
import ScheduleModal from './components/ScheduleModal';
import ScheduleSuccessModal from './components/ScheduleSuccessModal';
import ScheduledDashboard from './components/ScheduledDashboard';
import StoryViewer from './components/StoryViewer';
import BottomNav from './components/BottomNav';
import { 
  getStoredStories, 
  saveStoredStories 
} from './utils/storage';
import { Sparkles, Bell, Wifi, Battery, Signal } from 'lucide-react';

export default function App() {
  const [stories, setStories] = useState(() => getStoredStories());
  const [currentTab, setCurrentTab] = useState('home');

  // Modals & Screen states
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [storyDraftToSchedule, setStoryDraftToSchedule] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [justScheduledStory, setJustScheduledStory] = useState(null);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [activeStoryViewer, setActiveStoryViewer] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state to LocalStorage whenever stories change
  useEffect(() => {
    saveStoredStories(stories);
  }, [stories]);

  // AUTO-PUBLISH TICKER:
  // Checks every 3 seconds if any scheduled story has reached its target time!
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let hasChanges = false;

      let publishedToastText = '🔔 A scheduled Story was just published automatically to your profile!';

      const updated = stories.map(story => {
        if (story.status === 'scheduled') {
          const target = new Date(story.scheduledTime);
          if (target <= now) {
            hasChanges = true;
            if (story.mentionedUser) {
              publishedToastText = `🔔 Story live! Mentioned ${story.mentionedUser} in your story.`;
            } else {
              publishedToastText = `🎉 Your scheduled Story ("${story.caption || 'New Story'}") is now live on your profile!`;
            }
            return {
              ...story,
              status: 'published',
              publishedAt: now.toISOString()
            };
          }
        }
        return story;
      });

      if (hasChanges) {
        setStories(updated);
        showToast(publishedToastText);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [stories]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // 1. When user clicks "Schedule Story" inside Creator
  const handleInitiateSchedule = (draftData) => {
    setStoryDraftToSchedule(draftData);
    setIsScheduleModalOpen(true);
  };

  // 2. When user confirms Date & Time in ScheduleModal
  const handleConfirmSchedule = (newScheduledStory) => {
    setStories(prev => [newScheduledStory, ...prev]);
    setIsScheduleModalOpen(false);
    setIsCreatorOpen(false);
    setStoryDraftToSchedule(null);
    setJustScheduledStory(newScheduledStory);
  };

  // 3. Publish immediately (standard Instagram flow)
  const handlePublishImmediately = (draftData, audience = 'everyone') => {
    const instantStory = {
      ...draftData,
      id: 'story-' + Date.now(),
      status: 'published',
      audience,
      scheduledTime: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      viewsCount: 1
    };

    setStories(prev => [instantStory, ...prev]);
    setIsCreatorOpen(false);
    showToast('✨ Story published directly to Your Story!');
  };

  // 4. Delete / Cancel scheduled story
  const handleDeleteStory = (storyId) => {
    if (window.confirm('Cancel and remove this scheduled story?')) {
      setStories(prev => prev.filter(s => s.id !== storyId));
      showToast('Scheduled story cancelled.');
    }
  };

  // 5. Reschedule story
  const handleRescheduleStory = (storyId, newIsoTime) => {
    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        return {
          ...s,
          scheduledTime: newIsoTime,
          status: 'scheduled'
        };
      }
      return s;
    }));
    showToast('Story rescheduled successfully!');
  };

  // 6. Fast-forward / Publish Now Simulation
  const handlePublishNow = (storyId) => {
    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        return {
          ...s,
          status: 'published',
          scheduledTime: new Date().toISOString(),
          publishedAt: new Date().toISOString()
        };
      }
      return s;
    }));
    showToast('🚀 Story auto-published now in demo simulation!');
  };

  // 7. Fast forward all scheduled stories to publish immediately
  const handleFastForwardAll = () => {
    let count = 0;
    setStories(prev => prev.map(s => {
      if (s.status === 'scheduled') {
        count++;
        return {
          ...s,
          status: 'published',
          scheduledTime: new Date().toISOString(),
          publishedAt: new Date().toISOString()
        };
      }
      return s;
    }));
    showToast(`⚡ Fast-forwarded! ${count} stories auto-published.`);
  };

  // 8. Open viewer for a published story from dashboard
  const handleViewPublishedStory = (story) => {
    setActiveStoryViewer({
      username: 'Your Story',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      isUser: true,
      stories: [story]
    });
  };

  // 9. Open viewer from Story tray
  const handleViewStoryTray = (storyGroup) => {
    setActiveStoryViewer(storyGroup);
  };

  const pendingScheduledCount = stories.filter(s => s.status === 'scheduled').length;

  return (
    <div className="app-viewport">
      <main className="mobile-frame">
        {/* Desktop Phone Mockup Status Bar */}
        <div className="phone-notch-bar">
          <span>9:41</span>
          <div className="dynamic-island" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={14} />
          </div>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="toast-banner">
            <Sparkles size={16} color="var(--ig-pink)" style={{ flexShrink: 0 }} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Instagram Header with Scheduled badge */}
        <Header 
          scheduledCount={pendingScheduledCount}
          onOpenScheduleDashboard={() => setIsDashboardOpen(true)}
          onOpenStoryCreator={() => setIsCreatorOpen(true)}
        />

        {/* Feed Scroll Area */}
        <div className="feed-scroll-container">
          {/* Top Story Tray Circles */}
          <StoryTray 
            userStories={stories}
            scheduledStories={stories}
            onOpenCreator={() => setIsCreatorOpen(true)}
            onViewStory={handleViewStoryTray}
          />

          {/* Interactive Instagram Feed Posts */}
          <FeedPost />

          {/* Additional Feed Post */}
          <article className="post-card">
            <div className="post-header">
              <div className="post-user-info">
                <img 
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80" 
                  alt="alex_photo" 
                  className="post-user-avatar"
                />
                <div>
                  <div className="post-username">alex_photo</div>
                  <div className="post-location">Tokyo, Shibuya</div>
                </div>
              </div>
            </div>
            <div className="post-image-container">
              <img 
                src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1080&q=80" 
                alt="Tokyo neon streets" 
                className="post-image"
              />
            </div>
            <div className="post-likes" style={{ marginTop: 10 }}>3,419 likes</div>
            <div className="post-caption-box">
              <span className="post-caption-user">alex_photo</span>
              Rainy reflections in Tokyo 🌧️ Scheduled my stories for prime Tokyo timezone engagement!
            </div>
            <div className="post-time">5 HOURS AGO</div>
          </article>
        </div>

        {/* Bottom Navigation */}
        <BottomNav 
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            if (tab === 'dashboard') setIsDashboardOpen(true);
          }}
          onOpenCreator={() => setIsCreatorOpen(true)}
          onOpenScheduleDashboard={() => setIsDashboardOpen(true)}
          scheduledCount={pendingScheduledCount}
        />

        {/* 1. STORY CREATOR MODAL (Screen 2) */}
        {isCreatorOpen && (
          <StoryCreator 
            onClose={() => setIsCreatorOpen(false)}
            onInitiateSchedule={handleInitiateSchedule}
            onPublishImmediately={handlePublishImmediately}
          />
        )}

        {/* 2. SCHEDULE PICKER SHEET (Screen 3) */}
        {isScheduleModalOpen && (
          <ScheduleModal 
            storyDraft={storyDraftToSchedule}
            onClose={() => setIsScheduleModalOpen(false)}
            onConfirmSchedule={handleConfirmSchedule}
          />
        )}

        {/* 3. SCHEDULE SUCCESS CONFIRMATION (Screen 4) */}
        {justScheduledStory && (
          <ScheduleSuccessModal 
            scheduledStory={justScheduledStory}
            onDone={() => setJustScheduledStory(null)}
            onViewDashboard={() => {
              setJustScheduledStory(null);
              setIsDashboardOpen(true);
            }}
          />
        )}

        {/* 4. SCHEDULED STORIES DASHBOARD (Screen 5) */}
        {isDashboardOpen && (
          <ScheduledDashboard 
            stories={stories}
            onClose={() => setIsDashboardOpen(false)}
            onDeleteStory={handleDeleteStory}
            onRescheduleStory={handleRescheduleStory}
            onPublishNow={handlePublishNow}
            onViewPublishedStory={handleViewPublishedStory}
            onOpenCreator={() => {
              setIsDashboardOpen(false);
              setIsCreatorOpen(true);
            }}
            onFastForwardAll={handleFastForwardAll}
          />
        )}

        {/* 5. STORY VIEWER MODAL (Screen 6) */}
        {activeStoryViewer && (
          <StoryViewer 
            storyGroup={activeStoryViewer}
            onClose={() => setActiveStoryViewer(null)}
          />
        )}
      </main>
    </div>
  );
}
