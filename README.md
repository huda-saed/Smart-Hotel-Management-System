# Smart Hotel Management System — Phase 1
Implemented: auth (JWT, bcrypt, 6 roles), rooms, customers, bookings (transactional double-booking prevention), check-in/out, payments & invoices, dashboard, printable receipts.
Not yet built: restaurant, staff/employees, housekeeping tasks/maintenance, reports/charts, image uploads, booking edit, notifications.
## Setup
1. `npm install`
2. Copy `.env.example` to `.env`, set DB credentials and a long random `JWT_SECRET`
3. `mysql -u root -p < database/schema.sql`
4. `npm run seed` then `npm start`, open http://localhost:3000
## Demo logins (password `Password123!`)
admin, manager, reception, accountant, housekeeping, restaurant
**Change these before any real use.** Payments are demo records only; no card processing.
Status: syntax-checked only. Not run against MySQL.
