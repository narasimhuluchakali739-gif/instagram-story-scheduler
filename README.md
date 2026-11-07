# Instagram Story Scheduler (Prototype Feature Simulation)

A modern, responsive React prototype demonstrating a proposed **Schedule Story** feature for Instagram.

## 🚀 Key Features

1. **Instagram Dark Theme Aesthetic**: Pixel-accurate UI inspired by Instagram mobile & web dark mode, complete with story tray, feed posts, double-tap heart animation, and bottom navigation.
2. **🎂 12:00 AM Midnight Birthday Drop Scheduler**:
   - One-tap preset that automatically queues stories to publish sharp at **12:00 AM (midnight)** so you're always the first to wish your friends without staying awake!
   - Birthday celebration stickers (`🎂 Midnight Birthday Drop`, `🎉 Happy Birthday`), balloon presets, and celebratory confetti effects.
3. **🔒 Private Story (Close Friends) vs Public Story**:
   - Toggle between **Private Story (Close Friends Only)** and **Public Story (Everyone)**.
   - Distinct green Close Friends ring and badge (`★ Close Friends`).
4. **👤 Friend Mentions (@mention)**:
   - Mention friends directly in the story (`@alex_photo`, `@travel.diaries`, etc.) with interactive clickable sticker tags and simulated drop notifications.
5. **Interactive Story Tray**: Live gradient rings, "Your story" with '+' badge and pending scheduled story indicator, and viewable friends' stories.
6. **Story Creator & Editor**:
   - Upload custom photos & videos from your computer
   - Pre-loaded sample presets (Birthday Party, Sunset, City, Cafe, Party)
   - Text tool (Aa) with custom colors and background fills
   - Stickers (Birthday Drop, Location, Current Time, Music)
   - Visual filters (Normal, Clarendon, Juno, Warm, Tokyo)
7. **Schedule Story Button (New Feature)**:
   - Highlighted in Instagram's signature pink and purple gradient with shimmer effect
8. **Schedule Picker Sheet**:
   - One-tap **"🎂 Set 12:00 AM"** midnight shortcut button
   - Date picker & Time picker
   - Audience toggle (*Private Story (Close Friends)* vs *Public (Everyone)*)
   - Mention friend selector
9. **Animated Confirmation Screen**:
   - Glowing gradient checkmark with confetti celebration
10. **Scheduled Stories Dashboard**:
    - Status & Category filters: `All`, `Scheduled`, `🎂 Birthday Drops`, `🔒 Private`, `Published`
    - Real-time countdowns (`in 15m`, `Tomorrow at 12:00 AM`)
    - Edit, Reschedule (with quick "Set to 12:00 AM" option), and Cancel options
    - **Drop Now (Simulate)** button for instant prototype demonstration
    - **Simulate 12:00 AM Strike** fast-forward tool
11. **Real-Time Auto-Publish Simulation**:
    - Ticker checks every 3 seconds; when target time arrives, automatically promotes the story to `Published`, sends an in-app toast, and lights up your profile's Story ring!
12. **Story Viewer**:
    - Fullscreen story viewer with segmented progress bars, hold-to-pause, tap navigation, clickable friend tags, and direct reply bar.
13. **LocalStorage Persistence**:
    - All created, scheduled, and published stories persist across browser reloads.

---

## 🛠️ Tech Stack

- **React 18**
- **Vite**
- **Lucide React** (Instagram style iconography)
- **Canvas Confetti**
- **Browser LocalStorage**

---

## 🏃‍♂️ Quick Start Guide

### 1. Open the project folder in terminal or VS Code:
```bash
cd "C:\Users\Narasimha\instagram-story-scheduler"
```

### 2. Start the development server:
```bash
npm run dev
```

### 3. Open in Browser:
Navigate to: **`http://localhost:5173`**

---

## 📁 Project Structure

```
instagram-story-scheduler/
├── src/
│   ├── components/
│   │   ├── Header.jsx                 # Top bar with Schedule feature badge
│   │   ├── StoryTray.jsx              # Story circles & gradient rings
│   │   ├── FeedPost.jsx               # Interactive dark feed post with double-tap heart
│   │   ├── StoryCreator.jsx           # Canvas editor + Schedule Story button
│   │   ├── ScheduleModal.jsx          # Date & time picker sheet
│   │   ├── ScheduleSuccessModal.jsx   # Animated success confirmation + confetti
│   │   ├── ScheduledDashboard.jsx     # Scheduled stories manager & action controls
│   │   ├── StoryViewer.jsx            # Story viewer with animated progress bars
│   │   └── BottomNav.jsx              # Bottom tab bar (Home, Explore, Create, Profile)
│   ├── utils/
│   │   └── storage.js                 # LocalStorage persistence & seed data
│   ├── App.jsx                        # Main state & auto-publish ticker
│   ├── index.css                      # Instagram dark theme styles & animations
│   └── main.jsx                       # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## 👤 Author

Developed by **Narasimhulu Chakali** ([@narasimhuluchakali739-gif](https://github.com/narasimhuluchakali739-gif))

---

> **Note**: This application is a prototype simulation created for design and concept demonstration. It runs locally and does not claim to modify or connect to the official Instagram production servers.
