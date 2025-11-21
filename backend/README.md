# Pupillix Backend API

RESTful API for Pupillix user authentication and download tracking.

## Features

- ✅ User Registration & Authentication
- ✅ JWT Token-based Authorization
- ✅ Download Tracking
- ✅ User Statistics
- ✅ MongoDB Integration
- ✅ Input Validation
- ✅ Security (Helmet, CORS, Rate Limiting)

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pupillix
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running locally:

```bash
# Windows (if using MongoDB service)
net start MongoDB

# Or using MongoDB Compass
```

### 4. Run the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Verify Token
```
POST /api/auth/verify
Authorization: Bearer <token>
```

### User Management

#### Get Profile
```
GET /api/user/profile
Authorization: Bearer <token>
```

#### Get Download History
```
GET /api/user/download-history
Authorization: Bearer <token>
```

#### Get All Users (Admin)
```
GET /api/user/all
Authorization: Bearer <token>
```

### Download Tracking

#### Track Download
```
POST /api/download/track
Authorization: Bearer <token>
Content-Type: application/json

{
  "version": "1.0.0"
}
```

#### Get Download Stats
```
GET /api/download/stats
Authorization: Bearer <token>
```

### Health Check
```
GET /api/health
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  downloads: [{
    downloadedAt: Date,
    version: String,
    ipAddress: String,
    userAgent: String
  }],
  totalDownloads: Number,
  lastDownload: Date,
  isActive: Boolean,
  registeredAt: Date
}
```

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- CORS protection
- Input validation
- XSS protection

## Testing with Postman/Thunder Client

1. **Register a user** - `POST /api/auth/signup`
2. **Copy the token** from response
3. **Use token** in Authorization header: `Bearer <token>`
4. **Track download** - `POST /api/download/track`
5. **View profile** - `GET /api/user/profile`

## Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=super_secure_random_string
CLIENT_URL=https://yourwebsite.com
```

### Deploy to Heroku
```bash
heroku create pupillix-api
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Deploy to Railway/Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

## MongoDB Atlas Setup (Cloud Database)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## Troubleshooting

**MongoDB Connection Error:**
- Make sure MongoDB is running
- Check connection string in `.env`
- Verify network access in MongoDB Atlas

**Port Already in Use:**
- Change PORT in `.env` file
- Kill process using the port

**Token Expired:**
- Login again to get new token
- Adjust `JWT_EXPIRE` in `.env`

## License

MIT
