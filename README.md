# Affiliate Dashboard

A modern affiliate dashboard built with React, TypeScript, and Vite. Features a dark theme design with real-time metrics, income tracking, and platform integration buttons.

## Features

- **Dashboard Overview**: Display key metrics at a glance
  - Income: $1080.10
  - Approved Conversions: 37
  - Rejected Conversions: 35
  - Total Cost: $12.04
  
- **Dark Theme Design**: Sleek, professional dark interface with purple, green, and red accent colors

- **Account Management**: Quick view of account status

- **Platform Integration**: Easy access to platform-specific dashboard buttons (YouTube, Facebook, Twitter, Instagram, TikTok)

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and development server
- **CSS3**: Modern styling with gradients and animations

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd affiliate-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Development

### Running the Development Server

```bash
npm run dev
```

The application will automatically reload when you make changes.

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist` directory.

### Previewing the Production Build

```bash
npm run preview
```

## Customization

### Updating Dashboard Metrics

Edit `src/components/Dashboard.tsx` to update the values displayed:
- Income amount
- Approved/Rejected counts
- Cost value
- Account information

### Styling

All component styles are in `src/components/Dashboard.css`. Modify colors, spacing, and animations to match your brand.

### Adding New Components

Create new components in `src/components/` and import them into `src/App.tsx`.

## Project Structure

```
affiliate-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   └── Dashboard.css
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
