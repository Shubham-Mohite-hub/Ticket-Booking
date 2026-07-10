# Ticket Booking System

## Project Overview

This project is being built as a Full Stack Engineering Assessment.

The primary objective is clean architecture, scalability, maintainability, and production-level code.

---

# Tech Stack

Frontend
- React.js (Vite)
- React Router
- Axios
- CSS Modules / Tailwind (decision later)

Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas

---

# Backend Folder Structure

server/src

config/
constants/
controllers/
emails/
jobs/
middleware/
models/
routes/
services/
socket/
utils/
validators/

app.js
server.js

---

# Coding Rules

- Follow MVC architecture.
- Keep controllers thin.
- Business logic belongs inside services.
- Models should only contain schema definitions.
- Validation must use express-validator.
- Never write business logic inside routes.
- Use async/await only.
- Do not use callbacks.

---

# API Rules

Every API response must follow this structure.

Success

{
  "success": true,
  "message": "...",
  "data": {}
}

Failure

{
  "success": false,
  "message": "...",
  "errors": []
}

---

# Authentication

JWT Authentication

Roles

- customer
- organizer
- admin

Protect private routes using middleware.

---

# Database Collections

User

Venue

Seat

Event

Booking

SeatHold

Waitlist

Ticket

---

# Seat Booking Rules

Seats can be

- Available
- Held
- Booked

Held seats expire automatically after TTL.

Prevent double booking using MongoDB transactions.

---

# Waitlist Rules

Users can join waitlist when seats are unavailable.

If booking expires or is cancelled,

Automatically allocate seats to the first eligible waitlisted user.

---

# Git Rules

Generate code module by module.

Do not modify unrelated files.

Keep commits small and feature-based.

Never regenerate the whole project.

---

# Code Style

Use CommonJS in backend.

Use functional React components.

Meaningful variable names.

No commented code.

No console.log except server startup.

---

# When Generating Code

Always preserve existing project structure.

Reuse existing middleware.  

Reuse existing utilities.

Avoid duplicate code.

Generate only the requested module.