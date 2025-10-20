# EstateHubIndia

EstateHubIndia is a modern React + Vite web application for finding and viewing real estate listings in India, with a focus on the Delhi region.  
Built with TypeScript, Tailwind CSS, and Shadcn UI components.

## Features

- Single-page React application powered by Vite for fast build and hot-reload
- Map integration using React Leaflet to show a random location pin for Delhi
- Clean UI using Tailwind CSS + Shadcn UI components for consistent design
- TypeScript support for stronger typing and better developer experience
- Mobile and desktop responsive design

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm (comes with Node.js) or Yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/naveenkm21/EstateHubIndia.git
cd EstateHubIndia

# Install dependencies
npm install
```

### Running in Development

```bash
npm run dev
```

This will start the development server and open your app at `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

This generates the production-ready build in the `dist/` folder.

### Previewing Production Build

```bash
npm run preview
```

This serves the production build locally so you can test before deploying.

## Project Structure

```
EstateHubIndia/
├─ public/          # Static assets (images, icons, etc.)
├─ src/             
│  ├─ components/   # Reusable UI components
│  ├─ pages/        # Routeable pages/screens
│  ├─ hooks/        # Custom React hooks
│  ├─ utils/        # Utility functions and helpers
│  ├─ assets/       # Images, SVGs, fonts
│  ├─ App.tsx       # Root component
│  └─ main.tsx      # Entry point
├─ tsconfig.json     # TypeScript configuration
├─ vite.config.ts    # Vite configuration
├─ tailwind.config.js# Tailwind configuration
└─ package.json      # Dependencies and scripts
```

## Map Integration

One of the main features is showing a random location pin in Delhi on the map when the page loads.

This is achieved by:
- Pre-defining a list of popular Delhi locations (India Gate, Connaught Place, Hauz Khas, etc.) with coordinates
- Selecting one at random in React and centering the map on that location
- Using OpenStreetMap tiles with React Leaflet for markers and map controls

## Gitignore

Recommended `.gitignore` for the project:

```
# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Vite / Build
dist/
.env
.DS_Store

# IDEs
.vscode/
.idea/
```

## Deployment

You can deploy the build to platforms such as Netlify, Vercel, or any static hosting service.

After running `npm run build`, point the hosting service to serve the `dist/` folder.

Recommended deployment steps:
1. Connect your GitHub repo to the hosting service
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add required environment variables in the hosting dashboard (if any)

## Future Enhancements

- Add search filters (location, price, property type)
- Bookmark/favorites functionality
- Integrate real estate listing API for dynamic content
- Clustering for multiple map pins in region views
- User authentication and profile management
- Improve performance and accessibility

## Contributing

Contributions are welcome. Steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to the branch and open a Pull Request
5. Ensure changes are tested and documented

## License

MIT © Naveen Kumar Mohanarajan
