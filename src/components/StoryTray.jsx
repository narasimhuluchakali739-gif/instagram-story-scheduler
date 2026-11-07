import React from 'react';
import { Plus, Clock } from 'lucide-react';
import { DEMO_FRIENDS_STORIES } from '../utils/storage';

export default function StoryTray({ 
  userStories, 
  scheduledStories, 
  onOpenCreator, 
  onViewStory 
}) {
  const publishedStories = userStories.filter(s => s.status === 'published');
  const pendingScheduled = scheduledStories.filter(s => s.status === 'scheduled');
  const hasPublishedStory = publishedStories.length > 0;
  const isLatestCloseFriends = hasPublishedStory && publishedStories[0]?.audience === 'close_friends';
  const hasBirthdayScheduled = pendingScheduled.some(s => s.isBirthday || s.caption?.toLowerCase().includes('birthday'));

  const handleYourStoryClick = () => {
    if (hasPublishedStory) {
      onViewStory({
        username: 'Your Story',
        isUser: true,
        stories: publishedStories
      });
    } else {
      onOpenCreator();
    }
  };

  return (
    <div className="stories-tray">
      {/* User's Own Story */}
      <div className="story-circle-item" onClick={handleYourStoryClick}>
        <div className={`story-ring-wrapper ${
          hasPublishedStory 
            ? (isLatestCloseFriends ? 'story-ring-closefriends' : 'story-ring-active') 
            : pendingScheduled.length > 0 
              ? 'story-ring-scheduled' 
              : 'story-ring-none'
        }`}>
          <div className="story-avatar-inner">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" 
              alt="Your avatar" 
              className="story-avatar-img"
            />
          </div>
          
          {/* Add story badge (+) */}
          <button 
            className="add-story-badge"
            title="Create Story"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCreator();
            }}
          >
            <Plus size={14} strokeWidth={3} />
          </button>

          {/* Pending scheduled story badge */}
          {pendingScheduled.length > 0 && !hasPublishedStory && (
            <div 
              className="schedule-clock-badge" 
              title={hasBirthdayScheduled ? '🎂 12:00 AM Birthday drop scheduled' : `${pendingScheduled.length} scheduled stories waiting`}
            >
              {hasBirthdayScheduled ? '🎂' : <Clock size={11} strokeWidth={2.5} />}
            </div>
          )}
        </div>
        <span className="story-username">Your story</span>
      </div>

      {/* Demo Friends' Stories */}
      {DEMO_FRIENDS_STORIES.map((friend) => (
        <div 
          key={friend.username} 
          className="story-circle-item"
          onClick={() => onViewStory(friend)}
        >
          <div className={`story-ring-wrapper ${
            friend.isCloseFriend ? 'story-ring-closefriends' : 'story-ring-active'
          }`}>
            <div className="story-avatar-inner">
              <img 
                src={friend.avatar} 
                alt={friend.username} 
                className="story-avatar-img"
              />
            </div>
          </div>
          <span className="story-username">{friend.username}</span>
        </div>
      ))}
    </div>
  );
}
