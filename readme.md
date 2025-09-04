## 🍽️ Restaurant Reservation & Payment System
    - A full-stack application for booking tables at restaurants, managing reservations, and handling secure online payments using Stripe.

## 🚀 Features
- 👤 User
    - Browse restaurants with details (menu, photos, opening hours, table capacity).
    - Book a table with date, time, guests, and table type.
    - Pay online (Stripe Checkout / PaymentIntent).
    - View upcoming and past reservations.
    - Cancel reservations before booking time.

- 👨‍🍳 Restaurant Manager
    - Register/Login as a manager.
    - Create and manage restaurant profiles.
    - Upload and delete restaurant photos.
    - Set menu, table capacity, and price range.
    - View reservations for their restaurant.

- 💳 Payment
    - Integrated with Stripe test mode.
    - Users choose amount or price per guest.
    - Reservation is marked pending until payment is confirmed.
    - On successful payment → reservation status becomes confirmed.

- 🛡️ Admin
    - Manage all users (activate, deactivate, delete).
    - Manage all restaurants (approve, update, or remove).
    - View all reservations in the system.
    - View all reviews in the system.
    - View all restaurants.

## 🛠️ Tech Stack
    - Frontend (React.js)
    - React 18 + Vite/CRA
    - Redux Toolkit (state management)
    - Axios (API calls)
    - Tailwind CSS (UI styling)
    - Stripe (payment integration)
    - Backend (Node.js + Express)
    - Express.js (REST API)
    - MongoDB + Mongoose (Database)
    - Stripe (payment gateway)
    - JWT Auth (authentication)
    - Multer (file uploads for photos)
    - Nodemailer

## 📌 API Endpoints
- Auth
    - POST /api/auth/register → User/Manager/Admin registration
    - POST /api/auth/login → Login
- Restaurants
    - GET /api/restaurants → List restaurants (User/Admin)
    - POST /api/restaurants → Create restaurant (Manager only)
    - PUT /api/restaurants/:id → Update (Manager/Admin)
    - DELETE /api/restaurants/:id → Delete (Manager/Admin)
- Reservations
    - POST /api/reservations/create → User creates reservation + payment intent
    - POST /api/reservations/confirm → Confirm payment
    - GET /api/reservations/me → User’s reservations
    - GET /api/reservations/all → Admin only (view all reservations)
    - PUT /api/reservations/:id → Update (User/Manager/Admin)
    - DELETE /api/reservations/:id → Cancel (User/Admin)
- Admin
    - GET /api/admin/users → List all users
    - PUT /api/admin/users/:id/role → Change role (User → Manager/Admin)
    - DELETE /api/admin/users/:id → Remove user

## 🖼️ Flow Diagram
    
          ┌─────────────┐
          │   User      │
          └─────┬────── ┘
                │
        Browse Restaurants
                │
                ▼
          ┌─────────────┐
          │ Select      │
          │ Restaurant  │
          └─────┬────── ┘
                │
         Choose Date/Time/Guests
                │
                ▼
          ┌─────────────┐
          │ Book & Pay  │
          └─────┬──────┘
                │
        Backend Checks Availability
                │
        ┌───────┴────────┐
        │ Available?      │
        │ Yes → Continue  │
        │ No → Error Msg  │
        └───────┬────────┘
                │
       Create Reservation (Pending)
                │
                ▼
       Create Stripe Checkout Session
                │
                ▼
        User Pays via Stripe
                │
        ┌───────┴────────┐
        │ Payment Success │
        │ Update Reservation:
        │ status = confirmed
        │ paymentStatus = paid
        └───────┬──────── ┘
                │
                ▼
         Show Reservation to User

## 🛠️ How It Works
1. User Actions
    - Browse Restaurants
    - Users can explore all restaurants with filters like cuisine, city, price range, and features.
    - Select a Restaurant
    - View detailed restaurant info including menu, photos, location, and opening hours.
    - Book a Table
    - Users select date, time, number of guests, table type, and payment amount.

2. Reservation Flow
    - Check Availability
    - Backend checks if the selected time slot has enough available tables.
    - Create Reservation (Pending)
    - If available, a reservation is created with:
    - status = pending
    - paymentStatus = unpaid
    - Stripe Payment Integration
    - A Stripe checkout session is created for the reservation amount.
    - User is redirected to Stripe payment page.
    - Payment Confirmation
    - On successful payment, backend updates:
    - Paid amount is stored in the reservation record.

3. Manager Actions
    - Create & Update Restaurant
    - Managers can add new restaurants, update details, upload photos, and delete them.
    - View Reservations
    - Managers can see reservations for their restaurants.
    - Manage Table Availability
    - Managers can adjust table capacities and respond to user queries if needed.

4. Admin Actions
    - Manage Users & Managers
    - Admin can view all users, managers, and their activities.
    - Manage Restaurants
    - Admin can add, update, or delete any restaurant.
    - View All Reservations
    - Admin has access to all reservations for monitoring purposes.

5. Backend Overview
    - Node.js + Express.js handles API requests for:
    - Restaurants
    - Reservations
    - User authentication
    - Payment integration with Stripe

MongoDB stores:
    - Users
    - Restaurants
    - Reservations
    - Stripe handles secure payments:
    - Test mode for development
    - Stores payment status and amount in reservation records

6. Frontend Overview
    - Built with React.js + Redux for state management.
    - Protected Routes ensure only authorized users can access dashboards.
    - Forms and Modals handle booking, login, registration, and profile updates.
    - Stripe Checkout handles payments seamlessly.

## Deployed Link :
- 