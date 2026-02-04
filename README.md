# 💖 Valentine's Day Website

A beautiful, interactive Valentine's Day proposal website built with React, featuring 6 sequential stages with smooth animations and a galaxy theme.

## ✨ Features

### 6 Interactive Stages:
1. **Story Timeline** - A scrollable journey through your relationship memories
2. **Catch the Hearts** - An interactive game where she collects floating hearts with sweet messages
3. **Choose Your Future** - A playful interactive story with multiple choice paths
4. **Puzzle Unlock** - A personalized question only she can answer
5. **Night Sky Mode** - Clickable stars that reveal messages and form a constellation
6. **Valentine Question** - The big question with a space-to-pink transition and a "No" button that runs away!

### Theme:
- 🌌 Dark galaxy background with twinkling stars
- 💫 Shooting stars with orange tips
- ✨ Smooth page transitions using Framer Motion
- 💖 Beautiful space-to-pink transition for the final question
- 🏃 Interactive "No" button that runs away from the cursor

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## 🎨 Customization

### Important: Personalize Your Messages!

Before sharing with your girlfriend, make sure to customize these files with YOUR personal memories and details:

#### 1. Story Timeline ([src/components/StoryTimeline.tsx](src/components/StoryTimeline.tsx))
```typescript
const memories = [
  {
    title: "The Day We Met",
    description: "// Add your personal memory here",
    emoji: "✨"
  },
  // ... add your memories
];
```

#### 2. Catch Hearts ([src/components/CatchHearts.tsx](src/components/CatchHearts.tsx))
```typescript
const messages = [
  "Reason #1: You make every day brighter", // Customize these!
  "You're my favorite person to talk to",
  // ... add your messages
];
```

#### 3. Puzzle Unlock ([src/components/PuzzleUnlock.tsx](src/components/PuzzleUnlock.tsx))
```typescript
const question = "What's my favorite nickname for you?";
const correctAnswer = "princess"; // Change this!
const hint = "Think about what I call you...";
```

#### 4. Night Sky Messages ([src/components/NightSky.tsx](src/components/NightSky.tsx))
```typescript
const messages = [
  "I appreciate how you always listen", // Customize these!
  "I love our late-night conversations",
  // ... add your messages
];
```

## 📦 Building for Production

To create a production build:

```bash
npm run build
```

The build files will be in the `dist` folder. You can deploy this to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## 🌐 Deployment Options

### Option 1: Netlify (Easiest)
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Deploy!

### Option 2: Vercel
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Import your GitHub repository
5. Deploy!

### Option 3: GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
```json
"homepage": "https://yourusername.github.io/repository-name",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```
3. Run: `npm run deploy`

## 💡 Tips

- **Test thoroughly** before sending! Go through each stage to make sure everything works
- **Customize everything** - the more personal, the better!
- **Check mobile responsiveness** - she might open it on her phone
- **Share the link** when you're ready - consider sending it with a sweet message

## 🛠️ Built With

- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Framer Motion](https://www.framer.com/motion/) - Animations
- CSS3 - Styling

## ❤️ Final Notes

This website is designed to be:
- **Personal** - Fill it with your unique memories and inside jokes
- **Emotional** - Each stage builds anticipation
- **Interactive** - She's actively participating, not just reading
- **Memorable** - Way better than a generic card!

Good luck! She's going to love it! 💕

---

Made with 💖 for someone special
