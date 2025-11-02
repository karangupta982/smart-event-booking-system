# Smart Event Booking System Backend

Node.js and Express backend with MySQL database for the Smart Event Booking System.

## Tech Stack

- Node.js
- Express.js
- MySQL
- Socket.IO
- JWT Authentication
- Express Validator
- CORS

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Project Structure

```
backend/
├── configuration/        # Database configuration
├── controllers/         # Request handlers
├── middleware/         # Custom middleware (auth, validation)
├── routes/            # API routes
├── event_booking.sql  # Database schema
├── socket.js         # Socket.IO setup
├── index.js         # Main application entry
└── package.json    # Dependencies and scripts
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=event_booking
JWT_SECRET=your_jwt_secret
```

## Database Setup

1. Create MySQL database:
   ```sql
   CREATE DATABASE event_booking;
   ```

2. Import schema:
   ```bash
   mysql -u your_username -p event_booking < event_booking.sql
   ```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login

### Events
- GET `/api/events` - List all events
- GET `/api/events/:id` - Get event details
- POST `/api/events` - Create event (Admin only)
- PUT `/api/events/:id` - Update event (Admin only)
- DELETE `/api/events/:id` - Delete event (Admin only)

### Bookings
- POST `/api/bookings` - Create new booking
- GET `/api/bookings` - List user's bookings
- GET `/api/bookings/:id` - Get booking details

## Real-time Features

Socket.IO is implemented for:
- Real-time seat availability updates
- Booking confirmations
- Event updates

## Error Handling

Standardized error responses:
```json
{
  "status": "error",
  "code": 400,
  "message": "Error description",
  "details": {}
}
```

## Development

Start development server with hot reload:
```bash
npm run dev
```

## Production

Start production server:
```bash
npm start
```

## Database Migration

To apply new database changes:
```bash
mysql -u your_username -p event_booking < migration_add_lat_lng.sql
```