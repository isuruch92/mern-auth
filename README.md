# MERN Authentication Project

A fullstack MERN authentication project that implements user authentication using JWT (JSON Web Tokens) for secure login, signup, email verification, forgot password, and reset password functionalities. This project is built with **React** for the frontend, **Node.js** with **Express.js** for the backend, and **MongoDB** for the database.

# Live Demo

Coming soon

## Features

- JWT-based authentication (Signup, Login, Logout)
- Email verification using Mailtrap
- Forgot password & reset password flow
- Secure password storage with bcrypt
- Zuständ state management for the frontend
- Responsive UI with modern libraries like **Lucide-react** for icons and **Framer-motion** for animations
- Toast notifications for user feedback using **Hot-toast**

## Tech Stack

### Backend:

- **Node.js** with **Express.js** for building the RESTful API
- **MongoDB** with **Mongoose** for database interactions
- **JWT (JSON Web Token)** for authentication
- **Mailtrap** for sending email verification and password reset links

### Frontend:

- **React** with **React Router DOM** for dynamic routing
- **Zustand** for state management
- **Axios** for handling HTTP requests
- **Framer-motion** for smooth UI animations
- **Lucide-react** for modern icons

## Libraries Used

### Backend:

- **express**: Backend framework for building the API and handling CRUD operations.
- **cookie-parser**: Parse cookies from incoming requests.
- **mailtrap**: Email delivery platform for sending verification emails.
- **bcryptjs**: Hashing library for securely storing passwords.
- **dotenv**: For loading environment variables from `.env` files.
- **jsonwebtoken**: Used for creating and verifying JWT tokens for authentication.
- **mongoose**: MongoDB object modeling for managing data.
- **crypto**: Native node.js library used for generating secure random numbers (e.g., for email verification codes).

### Frontend:

- **React**: Core library for building the frontend.
- **react-router-dom**: For routing and navigation between pages.
- **zustand**: A lightweight state management solution.
- **axios**: For making HTTP requests from the frontend to the backend.
- **lucide-react**: A modern icon library for UI.
- **framer-motion**: Used for adding animations to the user interface.
- **react-hot-toast**: Toast notifications for user feedback.

## Setup Instructions

### Prerequisites:

- **Node.js** installed on your system
- **MongoDB Atlas** account (for the database)
- **Mailtrap** account (for sending emails) --> `**NOTE** : You have to use the gmail address used to create the mailtrap account, otherwise the signup functionalities will not work because Mailtrap does not allow to send emails to other email addresses unless you provide them with your own domain.`

### 1. Clone the repository:

```bash
git clone <repository-url>
cd <repository-folder>
```

### 1.5. Check the scripts:

If you are running on a windows machine, set the root package.json scripts as this

```bash
  "scripts": {
    "dev": "SET NODE_ENV=development&& nodemon backend/index.js",
    "start": "SET NODE_ENV=production&& node backend/index.js",
    "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend"
  },
```

### 2. Install Backend Dependencies:

At the root directory

```bash
npm install
```

### 3. Install Frontend Dependencies:

```bash
cd frontend
npm install
```

### 4. Environment Variables:

Create a `.env` file in the root of the project and provide the following environment variables:

```bash
MONGO_URI=<your-mongodb-cluster-url>         # MongoDB connection string
PORT=5000                                    # Server port
JWT_SECRET=<your-jwt-secret>                 # JWT secret key for token signing
NODE_ENV=development                         # Environment mode
MAILTRAP_TOKEN=<your-mailtrap-token>         # Mailtrap token for sending emails
CLIENT_URL=http://localhost:5173             # Frontend URL for local development
```

### 5. Running the Backend (Node.js):

To start the backend server: At the root directory,

```bash
npm run dev
```

### 6. Running the Frontend (React):

Navigate to the `frontend` directory and start the React app:

```bash
cd frontend
npm run dev
```

### 7. Visit the Application:

Once both servers are running, open the app in your browser at:

```
http://localhost:5173
```

## API Endpoints

- **POST /api/auth/signup**: Create a new user account
- **POST /api/auth/login**: Log in and retrieve a JWT token
- **POST /api/auth/logout**: Log out the user and clear the cookie
- **POST /api/auth/verify-email**: Send email verification code to the user
- **POST /api/auth/forgot-password**: Initiate the forgot password process
- **POST /api/auth/reset-password**: Reset the user's password

## Folder Structure

```
/backend
  ├── /controllers       # Business logic for auth, user handling
  ├── /models            # Mongoose models for User and Token
  ├── /routes            # Express routes for authentication
  ├── /middleware        # Middleware for JWT auth
  ├── /utils             # Helper functions for sending emails, generating tokens
  └── index.js           # Entry point for backend server

/frontend
  ├── /public            # Static assets
  ├── /src
      ├── /components    # Reusable React components
      ├── /pages         # Page components for routing
      ├── /store         # Zustand store for state management
      ├── /utils         # Helper functions
      └── App.js         # Main React app entry point
```

## Libraries and Tools

- **Mailtrap**: Used for sending verification emails and reset password emails during development.
- **MongoDB Atlas**: A cloud-hosted MongoDB instance for storing user data.
- **JWT**: For generating authentication tokens for users.
- **Zustand**: For simple and scalable state management in React.
- **Framer Motion**: For adding beautiful UI animations.

## Credits

This project was inspired by a tutorial from the YouTube channel [As a Programmer](https://www.youtube.com/@asaprogrammer_). The tutorial provided the foundation for building the authentication system using MERN stack technologies.

I have made several improvements and customizations to the project, including:

- A different theme and UI enhancements to better suit the design requirements.
- Backend improvements such as:
  - **Resend Verification Email** functionality.
  - **Pending User Schema** to prevent unauthorized email signups, ensuring only verified users are stored in the database.
  - Automatic deletion of unverified users after email verification.

Special thanks to [As a Programmer](https://www.youtube.com/@asaprogrammer_) for providing valuable guidance in the original tutorial.
