# Store Locator Backend API

This is a Node.js backend application built with Express.js for a store locator system. It handles authentication, user management, and store data management.

## Features

- User authentication with JWT
- Role-based access for users
- API for managing stores
- Secure error handling
- CORS-enabled for frontend integration

## Technologies Used

- Node.js
- Express.js
- JWT for authentication
- dotenv for environment variable management
- CORS for handling cross-origin requests

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd <project-folder>
```
### Create a .env file in the root directory and add the following:

PORT=5000
DATABASE_URL=<your-database-url>
JWT_SECRET=<your-secret-key>
```
### Start the server:
npm start
```

### API Routes:
Authentication
POST /api/auth/signup - Create a new user

POST /api/auth/login - Login and receive JWT token

Users
GET /api/users/profile - Get user profile

(Additional endpoints based on role)

Stores
GET /api/stores - List all stores

POST /api/stores - Add a new store (protected)

GET /api/stores/:id - Get a specific store

Project Structure
![image](https://github.com/user-attachments/assets/5864ebb2-94ff-4ef3-adeb-6a8dc8a60717)

```
