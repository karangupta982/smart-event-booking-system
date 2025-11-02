# Smart Event Booking System Frontend

React.js frontend application for the Smart Event Booking System with real-time updates and animations.

## Tech Stack

- React.js
- Vite
- Tailwind CSS
- Framer Motion
- Socket.IO Client
- Axios
- React Router DOM

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── components/  # React components
│   │   ├── admin/  # Admin dashboard components
│   │   ├── auth/   # Authentication components
│   │   ├── common/ # Shared components
│   │   ├── events/ # Event related components
│   │   └── pages/  # Page components
│   ├── config/     # Configuration files
│   ├── context/    # React context providers
│   ├── assets/     # Images and other assets
│   ├── App.jsx     # Root component
│   └── main.jsx    # Application entry point
├── index.html      # HTML template
└── vite.config.js  # Vite configuration
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features

### Pages
- Landing Page - Animated hero section and featured events
- Event Listing - Search and filter events
- Event Details - Interactive event information with map
- Booking Flow - Animated checkout process
- Admin Dashboard - Event management interface

### Components
- Interactive Event Cards
- Real-time Seat Availability Indicator
- Google Maps Integration
- Animated Success/Error Notifications
- Protected Route Handler

## State Management

- AuthContext for user authentication
- SocketContext for real-time updates

## Routing

Protected routes are handled by the `ProtectedRoute` component:
- Admin routes require admin authentication
- Booking routes require user authentication

## API Integration

Axios instance is configured in `src/config/axios.js` with:
- Base URL configuration
- Authentication header
- Error handling
- Request/Response interceptors

## Real-time Features

Socket.IO client is implemented for:
- Live seat availability updates
- Booking confirmations
- Event updates

## Build and Deployment

1. Create production build:
   ```bash
   npm run build
   ```

2. Preview production build:
   ```bash
   npm run preview
   ```

## Development Guidelines

1. Component Structure:
   - Functional components with hooks
   - Props validation with PropTypes
   - Separate components for reusable UI elements

2. Styling:
   - Tailwind CSS for styling
   - Framer Motion for animations
   - Responsive design patterns

3. Error Handling:
   - Try-catch blocks for async operations
   - Error boundaries for component errors
   - User-friendly error messages
