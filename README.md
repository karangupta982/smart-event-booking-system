# Smart Event Booking System

A full-stack MERN application for event booking and management with real-time seat availability tracking.

## Live Demo

[View Live Demo](https://smart-event-booking-system-eta.vercel.app/)

## Features

### User Features
- Browse upcoming events with search and filter options
- Real-time seat availability tracking
- Book event tickets with instant confirmation
- View booking history and status
- Interactive event details with location mapping

### Admin Features
- Comprehensive event management (Create, Read, Update, Delete)
- Monitor bookings and seat availability
- Track event statistics and booking trends

## Tech Stack

### Backend
- Node.js
- Express.js
- MySQL
- Socket.IO
- JWT Authentication

### Frontend
- React.js
- Tailwind CSS
- Framer Motion
- Socket.IO Client
- Axios
- React Router DOM

## Project Structure

```
smart-event-booking-system/
├── backend/                 # Node.js server
│   ├── configuration/      # Database and other configs
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── routes/            # API routes
│   └── socket.js          # Socket.IO configuration
│
└── frontend/              # React application
    ├── public/           # Static files
    └── src/
        ├── components/   # React components
        ├── config/       # Configuration files
        ├── context/      # React context providers
        └── assets/       # Images and other assets
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/karangupta982/smart-event-booking-system.git
   cd smart-event-booking-system
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   ```
   See backend/README.md for detailed setup instructions.

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```
   See frontend/README.md for detailed setup instructions.

## Environment Variables

Create `.env` files in both backend and frontend directories. See respective README files for required variables.

## Database Setup

1. Create a MySQL database
2. Import the schema:
   ```bash
   mysql -u your_username -p your_database_name < backend/event_booking.sql
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

## Documentation

- Backend API documentation: See  [backend/README.md](https://github.com/karangupta982/smart-event-booking-system/tree/main/backend)
- Frontend documentation: See [frontend/README.md](https://github.com/karangupta982/smart-event-booking-system/tree/main/frontend)

## License

MIT License