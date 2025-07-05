# Tractor Simulator

Tractor Simulator is a modern web application designed to simulate and visualize the real-time tracking of tractors in a field environment. Built with React, TypeScript, and Vite, the project provides an interactive dashboard for monitoring tractor locations, speeds, and distances, making it ideal for agricultural technology demonstrations, fleet management simulations, or educational purposes.

## Features

- **Live Tracking:** Real-time simulation of tractor positions on a map interface.
- **Dashboard Overview:** Key metrics and statistics displayed in overview cards for quick insights.
- **Charts & Analytics:** Visualize speed and distance data with interactive charts.
- **Mock Data & WebSocket:** Uses mock tractors and simulated WebSocket data for demonstration and testing.
- **Responsive UI:** Clean, modern, and responsive user interface with reusable UI components.
- **Context & Hooks:** Utilizes React Context and custom hooks for state management and modularity.

## Project Structure

- `src/` — Main source code
  - `components/` — UI components (cards, charts, map controls, etc.)
  - `context/` — React Context for tractor tracking state
  - `hooks/` — Custom React hooks (e.g., for Mapbox integration)
  - `mock/` — Mock data and WebSocket simulation
  - `pages/` — Main application pages (Dashboard, MapView)
  - `types/` — TypeScript type definitions
  - `utils/` — Utility functions (GPS, speed calculations)
- `public/` — Static assets
- `index.html` — Main HTML entry point
- `vite.config.js` — Vite configuration

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Running the App

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173` by default.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Linting

```bash
npm run lint
# or
yarn lint
```

## Customization
- Update mock data in `src/mock/MockTracktors.ts` and `src/mock/MockWebsocket.ts`.
- Modify UI components in `src/components/` as needed.
- Extend analytics and charts in `src/components/charts/`.


## Acknowledgements
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Mapbox](https://www.mapbox.com/)
- [TypeScript](https://www.typescriptlang.org/)
