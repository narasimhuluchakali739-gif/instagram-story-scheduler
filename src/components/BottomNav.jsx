import React from 'react';
import { Home, Search, PlusSquare, Film, CalendarClock } from 'lucide-react';

export default function BottomNav({ 
  currentTab, 
  onSelectTab, 
  onOpenCreator, 
  onOpenScheduleDashboard,
  scheduledCount 
}) {
  return (
    <nav className="bottom-nav">
      {/* Home */}
      <button 
        className="nav-item" 
        onClick={() => onSelectTab('home')}
        title="Home Feed"
      >
        <Home 
          size={24} 
          color={currentTab === 'home' ? '#fff' : '#888'} 
          strokeWidth={currentTab === 'home' ? 2.5 : 2} 
        />
      </button>

      {/* Search */}
      <button 
        className="nav-item" 
        onClick={() => onSelectTab('search')}
        title="Explore"
      >
        <Search 
          size={24} 
          color={currentTab === 'search' ? '#fff' : '#888'} 
        />
      </button>

      {/* Create Story (+) */}
      <button 
        className="nav-item" 
        onClick={onOpenCreator}
        title="Create Story"
      >
        <div style={{
          background: 'linear-gradient(135deg, #e1306c, #833ab4)',
          borderRadius: 8,
          padding: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(225, 48, 108, 0.4)'
        }}>
          <PlusSquare size={20} color="#fff" />
        </div>
      </button>

      {/* Schedule Feature Tab */}
      <button 
        className="nav-item" 
        onClick={onOpenScheduleDashboard}
        title="Scheduled Stories"
      >
        <CalendarClock 
          size={24} 
          color={currentTab === 'dashboard' ? '#ff7bb0' : '#888'} 
        />
        {scheduledCount > 0 && (
          <span className="badge-count">
            {scheduledCount}
          </span>
        )}
      </button>

      {/* Profile */}
      <button 
        className="nav-item" 
        onClick={() => onSelectTab('profile')}
        title="Your Profile"
      >
        <img 
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" 
          alt="Profile" 
          className={`nav-profile-pic ${currentTab === 'profile' ? 'active' : ''}`}
        />
      </button>
    </nav>
  );
}
