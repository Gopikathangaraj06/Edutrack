# Student Progress Benchmarking System

A complete MERN stack web application with gamification for students to track their progress, subjects, and study tasks.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Recharts, Axios, React Router v6
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)

## Features
- **Gamified Dashboard**: Track XP, Levels, and Streaks based on study habits.
- **Progress Tracking**: Add and monitor test scores across various subjects.
- **Analytics**: Visualize progress using Line Charts, Category Bar Charts, and Performance Radars.
- **Task Management**: Keep a daily study plan.
- **Auth**: JWT-based Secure Authentication.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017` or change the `.env` file)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend:
   ```bash
   npm run start
   # or
   node server.js
   ```
   *The server will run on port 5000.*

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   *The frontend will run on port 5173 (usually).*

### Default Users and Data
There is NO fake or static data. All data is dynamically fetched from your database. You must register a new user in the app to begin.
