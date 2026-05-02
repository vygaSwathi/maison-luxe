# Maison Luxe

Luxury fashion e-commerce project with a React frontend and Express/MongoDB backend.

## Project Structure

- `maison-luxe-frontend` - React + Vite + Tailwind CSS client app
- `maison-luxe-backend` - Node.js + Express + MongoDB API

## Tech Stack

- Frontend: React, React Router, React Query, Axios, Framer Motion, Tailwind CSS
- Backend: Express, Mongoose, JWT auth, Multer uploads, Cookie-based sessions
- Database: MongoDB (Atlas/local)

## Prerequisites

- Node.js 18+ (recommended)
- npm
- MongoDB connection string

## Environment Variables (Backend)

Create `maison-luxe-backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## Environment Variables (Frontend)

Create `maison-luxe-frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Installation

### 1) Backend

```bash
cd maison-luxe-backend
npm install
```

### 2) Frontend

```bash
cd ../maison-luxe-frontend
npm install
```

## Running the App

Run backend:

```bash
cd maison-luxe-backend
npm run dev
```

Run frontend in a second terminal:

```bash
cd maison-luxe-frontend
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Available Scripts

### Frontend (`maison-luxe-frontend`)

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run test` - Run frontend tests (Vitest)

### Backend (`maison-luxe-backend`)

- `npm run dev` - Start API with nodemon
- `npm start` - Start API with node
- `npm run seed` - Seed database data
- `npm test` - Run backend tests (Jest)

## Core Features

- User authentication (register/login/logout)
- Product browsing and category-based collections
- Cart persistence with local storage
- Checkout and orders flow
- Admin panel for product/order management
- Hero video upload and homepage hero rendering

## API Overview

Base URL: `http://localhost:5000/api`

- `/auth` - authentication routes
- `/products` - product listing/details
- `/orders` - user/admin order operations
- `/settings` - site settings (hero video URL, etc.)
- `/upload` - admin media uploads

## Notes

- CORS is configured for `http://localhost:5173`.
- Uploaded files are served from `/uploads`.
- If frontend changes are not visible, restart Vite and hard refresh browser (`Ctrl+F5`).
