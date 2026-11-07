// Storage management & demo seeds for Instagram Story Scheduler Prototype

const STORAGE_KEY = 'instagram_scheduled_stories_v2';

export const FRIENDS_LIST = [
  { username: 'alex_photo', name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
  { username: 'travel.diaries', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  { username: 'sarah_foodie', name: 'Sarah Miller', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
  { username: 'tech_insider', name: 'David Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
];

export const INITIAL_STORIES = [
  {
    id: 'demo-story-1',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=80',
    mediaType: 'image',
    caption: 'Golden Hour Sunset ✨ Malibu Coast',
    textOverlay: 'Golden Hour ✨',
    textColor: '#ffffff',
    textBg: 'rgba(0, 0, 0, 0.5)',
    filter: 'normal',
    sticker: 'location',
    stickerText: 'Malibu Beach 🌊',
    mentionedUser: '',
    scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(), // 3 hours from now
    createdAt: new Date().toISOString(),
    status: 'scheduled',
    audience: 'everyone',
    viewsCount: 0
  },
  {
    id: 'demo-story-2',
    mediaUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1080&q=80',
    mediaType: 'image',
    caption: 'Late night coding vibes 💻 Prototype testing',
    textOverlay: 'Coffee & Code ☕',
    textColor: '#ffffff',
    textBg: 'rgba(225, 48, 108, 0.7)',
    filter: 'clarendon',
    sticker: 'time',
    stickerText: '11:45 PM',
    mentionedUser: '',
    scheduledTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago -> already published!
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: 'published',
    audience: 'close_friends',
    viewsCount: 142
  },
  {
    id: 'demo-story-birthday',
    mediaUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1080&q=80',
    mediaType: 'image',
    caption: 'Happy Birthday @alex_photo! 🎂 Midnight Wish Drop 🎉',
    textOverlay: 'HAPPY BIRTHDAY! 🎂✨',
    textColor: '#ffffff',
    textBg: 'rgba(225, 48, 108, 0.85)',
    filter: 'normal',
    sticker: 'birthday',
    stickerText: 'Happy Birthday! 🎂',
    mentionedUser: '@alex_photo',
    scheduledTime: (() => {
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0); // 12:00 AM tonight
      return midnight.toISOString();
    })(),
    createdAt: new Date().toISOString(),
    status: 'scheduled',
    audience: 'close_friends', // Private story
    viewsCount: 0
  },
  {
    id: 'demo-story-3',
    mediaUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1080&q=80',
    mediaType: 'image',
    caption: 'Weekend festival announcement 🎶',
    textOverlay: 'Live Tonight! 🔥',
    textColor: '#ffe600',
    textBg: 'rgba(0, 0, 0, 0.6)',
    filter: 'juno',
    sticker: 'music',
    stickerText: 'Sunset Grooves • Neon Beats',
    mentionedUser: '',
    scheduledTime: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    status: 'failed',
    errorMessage: 'Simulated network timeout during upload',
    audience: 'everyone',
    viewsCount: 0
  }
];

export const getStoredStories = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STORIES));
      return INITIAL_STORIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stories from localStorage:', e);
    return INITIAL_STORIES;
  }
};

export const saveStoredStories = (stories) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  } catch (e) {
    console.error('Error saving stories to localStorage:', e);
  }
};

export const formatScheduledDate = (isoString) => {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Invalid date';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Invalid date';
  }
};

export const formatScheduledTime = (isoString) => {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Invalid time';
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return 'Invalid time';
  }
};

export const getTimeRelativeString = (isoString) => {
  try {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      const pastMin = Math.floor(Math.abs(diffMs) / 60000);
      if (pastMin < 1) return 'Just now';
      if (pastMin < 60) return `${pastMin}m ago`;
      const pastHrs = Math.floor(pastMin / 60);
      if (pastHrs < 24) return `${pastHrs}h ago`;
      return `${Math.floor(pastHrs / 24)}d ago`;
    }

    const min = Math.floor(diffMs / 60000);
    if (min < 60) return `in ${min}m`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `in ${hrs}h ${min % 60}m`;
    const days = Math.floor(hrs / 24);
    return `in ${days}d ${hrs % 24}h`;
  } catch {
    return 'Upcoming';
  }
};

export const SAMPLE_IMAGES = [
  {
    name: 'Sunset Glow',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=80',
    type: 'image'
  },
  {
    name: 'City Skyline',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1080&q=80',
    type: 'image'
  },
  {
    name: 'Aesthetic Cafe',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1080&q=80',
    type: 'image'
  },
  {
    name: 'Neon Party',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1080&q=80',
    type: 'image'
  },
  {
    name: '🎂 Birthday',
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1080&q=80',
    type: 'image'
  }
];

export const DEMO_FRIENDS_STORIES = [
  {
    username: 'travel.diaries',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    hasStory: true,
    isCloseFriend: false,
    stories: [
      {
        url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1080&q=80',
        caption: 'Wandering through the Swiss Alps 🏔️',
        time: '3h ago'
      }
    ]
  },
  {
    username: 'alex_photo',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    hasStory: true,
    isCloseFriend: true,
    stories: [
      {
        url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1080&q=80',
        caption: 'Night neon reflections 🌃 Close friends only',
        time: '5h ago'
      }
    ]
  },
  {
    username: 'sarah_foodie',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    hasStory: true,
    isCloseFriend: false,
    stories: [
      {
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1080&q=80',
        caption: 'Best handmade pasta in town 🍝',
        time: '7h ago'
      }
    ]
  },
  {
    username: 'tech_insider',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    hasStory: true,
    isCloseFriend: false,
    stories: [
      {
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1080&q=80',
        caption: 'New AI feature release keynote 🚀',
        time: '8h ago'
      }
    ]
  }
];
