# Affiliate Dashboard - Development Instructions

This is a React + TypeScript + Vite project for building an affiliate dashboard.

## Project Setup Status

- [x] Verify copilot-instructions.md created
- [x] Project scaffolded with Vite + React + TypeScript
- [x] Project structure created
- [x] Core components implemented (Dashboard with income card, counters, cost, account box, platform buttons)
- [ ] Install dependencies
- [ ] Run development server
- [ ] Build for production

## Architecture

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: CSS with dark theme
- **Components**: Dashboard (main component showing metrics, cards, and platform buttons)

## Key Features

- Dark theme dashboard ($1a1a2e background)
- Purple gradient income card ($1080.10)
- Green approved counter (37) and red rejected counter (35)
- Cost card ($12.04)
- Account status box
- Platform buttons (YouTube, Facebook, Twitter, Instagram, TikTok)

## Development Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Run development server:
   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

The dashboard matches the provided screenshot with:
- Dark background (#1a1a2e, #16213e gradient)
- Purple income card with gradient (7b68ee to 6a5acd)
- Green approved metric (#2ecc71)
- Red rejected metric (#e74c3c)
- Glass-morphism effect for secondary cards
- Responsive design for mobile and desktop
- Hover animations and transitions

## File Structure

```
src/
├── components/
│   ├── Dashboard.tsx      # Main dashboard component
│   └── Dashboard.css      # Dashboard styling
├── App.tsx               # Root component
├── App.css              # App styles
├── index.css            # Global styles
└── main.tsx             # Entry point
```

## Next Steps

Once dependencies are installed and dev server is running, the dashboard will be available at http://localhost:5173
