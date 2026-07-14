Ticket Booking System – Architecture & Design

The Ticket Booking System is built using the MERN stack (React, Node.js, Express.js, MongoDB) following a layered architecture consisting of presentation, API, service, and database layers. The application supports three roles (Customer, Organizer, and Admin) with JWT-based authentication and role-based authorization.

1. Seat Hold & TTL Mechanism

When a customer selects seats, the system does not immediately confirm the booking. Instead, the selected seats are temporarily placed in the Held state.

A dedicated SeatHold collection stores the temporary reservation along with an expiration timestamp. The hold duration is configurable (10 minutes by default).

A background scheduler runs every minute and performs the following:

Finds expired seat holds.
Changes the corresponding seat status from Held back to Available.
Removes the expired hold document.
Makes the seat immediately available to other customers.

This prevents abandoned checkout sessions from blocking inventory and ensures efficient seat utilization.

2. Concurrency Prevention

The system prevents multiple users from reserving or booking the same seat simultaneously.

Each seat maintains a status:

Available
Held
Booked

Seat reservation and booking operations use atomic MongoDB update queries inside transactions wherever required.

Before changing a seat's status, the API verifies its current state.

Example:

User A and User B attempt to reserve the same seat.
Only the first atomic update succeeds.
The second request finds that the seat is no longer available and receives an error.

This guarantees that the same seat cannot be held or booked by multiple customers.

3. Waitlist Auto-Assignment Flow

If all seats in a category are sold out, customers may join the waitlist for that specific seat category.

Each waitlist entry stores:

Event
Customer
Seat Category
Queue Status
Join Timestamp

The waitlist follows a First-In-First-Out (FIFO) strategy.

When a booking is cancelled:

The cancelled seat becomes available.
The system searches the oldest waiting customer for the same event and seat category.
That customer receives a temporary booking opportunity.
The seat is changed to Held specifically for the waitlisted customer.

This automation ensures cancelled seats are efficiently reassigned without manual intervention.

4. Time-Limited Offer Handling

After a customer is promoted from the waitlist:

A WaitlistOffer document is created.
The offer contains an expiration timestamp (10 minutes).
The customer receives an email containing a secure booking link.

If the customer accepts within the allotted time:

The seat status changes from Held to Booked.
The waitlist entry is marked as converted.
The booking is confirmed.

If the offer expires:

The scheduler detects the expired offer.
The seat is released.
The next eligible customer in the queue can be promoted.

This mechanism ensures fairness while preventing seats from remaining locked indefinitely.

5. QR Ticket Generation

After successful payment and booking confirmation:

A unique booking record is created.
A QR code containing the booking reference is generated.
A confirmation email containing booking details and the QR ticket is sent to the customer using SMTP.

The QR code can later be scanned during event entry to validate the booking.

6. Overall Architecture

The backend follows a modular service-oriented architecture.

Frontend

React
React Router
Tailwind CSS

Backend

Express.js
JWT Authentication
REST APIs

Database

MongoDB
Mongoose ODM

Supporting Components

Background Scheduler
Email Service
QR Code Generator
Waitlist Engine

This architecture separates business logic from routing and controllers, making the application scalable, maintainable, and easy to extend with features such as online payments, WebSocket-based real-time seat updates, and distributed caching.

Project Structure
Client (React)
        │
 REST API
        │
Express Controllers
        │
Service Layer
        │
MongoDB (Events, Seats, Bookings, Waitlist, Users)
        │
Scheduler + Email Service + QR Generator