import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

export default function FeedPost() {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(1284);
  const [saved, setSaved] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  const handleLikeToggle = () => {
    if (!liked) {
      setLikesCount(prev => prev + 1);
      setLiked(true);
    } else {
      setLikesCount(prev => prev - 1);
      setLiked(false);
    }
  };

  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true);
      setLikesCount(prev => prev + 1);
    }
    setShowHeartAnim(true);
    setTimeout(() => {
      setShowHeartAnim(false);
    }, 800);
  };

  return (
    <article className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-user-info">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
            alt="travel.diaries" 
            className="post-user-avatar"
          />
          <div>
            <div className="post-username">travel.diaries</div>
            <div className="post-location">Santorini, Greece</div>
          </div>
        </div>
        <button className="icon-btn" title="Options">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Post Image with double tap to like */}
      <div className="post-image-container" onDoubleClick={handleDoubleTap}>
        <img 
          src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1080&q=80" 
          alt="Sunset in Santorini" 
          className="post-image"
        />
        <Heart 
          size={84} 
          className={`heart-pop-anim ${showHeartAnim ? 'active' : ''}`} 
          fill="currentColor"
        />
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <div className="post-actions-left">
          <button 
            className="icon-btn" 
            onClick={handleLikeToggle}
            style={{ color: liked ? 'var(--ig-red)' : 'inherit' }}
            title={liked ? 'Unlike' : 'Like'}
          >
            <Heart size={22} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button className="icon-btn" title="Comment">
            <MessageCircle size={22} />
          </button>
          <button className="icon-btn" title="Share">
            <Send size={22} />
          </button>
        </div>
        <button 
          className="icon-btn" 
          onClick={() => setSaved(!saved)}
          style={{ color: saved ? 'white' : 'inherit' }}
          title={saved ? 'Remove from Saved' : 'Save'}
        >
          <Bookmark size={22} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Post Meta */}
      <div className="post-likes">
        {likesCount.toLocaleString()} likes
      </div>

      <div className="post-caption-box">
        <span className="post-caption-user">travel.diaries</span>
        Golden hour never looked better in Oia 🌅 Pro tip: Schedule your stories in advance so you can enjoy the sunset without looking at your phone! ✨
      </div>

      <div className="post-time">
        2 HOURS AGO
      </div>
    </article>
  );
}
