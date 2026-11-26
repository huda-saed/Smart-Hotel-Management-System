🏨 Smart Hotel Management System

<p align="center">
  <strong>A Full-Stack Hotel Management Web Application</strong>
  <br>
  Built with Node.js, Express.js, MySQL & Vanilla JavaScript
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-Backend-black?logo=express" />
  <img src="https://img.shields.io/badge/MySQL-Database-blue?logo=mysql" />
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-yellow?logo=javascript" />
  <img src="https://img.shields.io/badge/Bootstrap-5-purple?logo=bootstrap" />
  <img src="https://img.shields.io/badge/Status-Live-success" />
</p>

⸻

🌐 Live Demo

Explore the application here:

🔗 Smart Hotel Management System

⸻

📖 About The Project

Smart Hotel Management System is a full-stack web application designed to simplify and automate hotel operations.

The system provides a centralized platform for managing hotel rooms, customers, bookings, check-ins, check-outs, payments, and invoices.

It includes secure JWT authentication and six role-based user accounts, ensuring that each staff member can only access the features permitted for their role.

✨ Key Features

🔐 Authentication & Security

* JWT-based authentication.
* Password hashing using bcrypt.
* Role-Based Access Control (RBAC).
* Protected API routes.
* Input validation.

👥 User Roles

The system supports six roles:

1. Super Admin
2. Hotel Manager
3. Receptionist
4. Accountant
5. Housekeeping
6. Restaurant Staff

📊 Dashboard

* Total rooms and room availability.
* Total customers.
* Today’s check-ins and check-outs.
* Daily, monthly, and total revenue.
* Live database statistics.

🛏️ Room Management

* Add, edit, and delete rooms.
* Search and filter rooms.
* Manage room status:
    * Available
    * Occupied
    * Reserved
    * Maintenance
    * Cleaning

👤 Customer Management

* Register new customers.
* Edit and delete customer records.
* Search customers.
* View booking history.

📅 Booking Management

* Create and cancel reservations.
* Automatic price calculation.
* Search bookings.
* Prevent double bookings using database transactions and row locking.

🏨 Check-in & Check-out

* Manage guest check-ins and check-outs.
* Automatic room status updates.
* Prevent check-out when an outstanding balance remains.

💳 Payments & Invoices

* Record cash and card payments (demo only).
* Automatic invoice balance updates.
* Generate printable receipts.

⸻

🧰 Technology Stack

Layer	Technology
Frontend	HTML5, CSS3, JavaScript ES6+
UI Framework	Bootstrap 5
Backend	Node.js, Express.js
Database	MySQL 8
Authentication	JSON Web Tokens (JWT)
Password Security	bcryptjs
API	REST API
Deployment	Railway

⸻

📁 Project Structure

Smart-Hotel-Management-System/
│
├── config/
│   └── Database connection
│
├── middleware/
│   └── Authentication & error handling
│
├── routes/
│   ├── auth
│   ├── rooms
│   ├── customers
│   ├── bookings
│   ├── stay
│   └── billing
│
├── database/
│   ├── schema.sql
│   └── seed.js
│
├── public/
│   └── index.html
│
├── server.js
├── package.json
├── .env.example
└── README.md

⸻

🚀 Installation & Setup

1. Prerequisites

Make sure you have installed:

* Node.js 18 or higher
* MySQL 8
* Git

2. Clone Repository

git clone https://github.com/huda-saed/Smart-Hotel-Management-System.git

3. Navigate to Project

cd Smart-Hotel-Management-System

4. Install Dependencies

npm install

5. Configure Environment Variables

Create a .env file based on .env.example.

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smart_hotel
JWT_SECRET=your_random_secret

6. Setup Database

mysql -u root -p < database/schema.sql

7. Seed Demo Data

npm run seed

8. Start Application

npm start

Open your browser:

http://localhost:3000

⸻

🔑 Demo Login Accounts

All demo accounts use the following password:

Password123!

Username	Role
admin	Super Admin
manager	Hotel Manager
reception	Receptionist
accountant	Accountant
housekeeping	Housekeeping
restaurant	Restaurant Staff

⚠️ Security Notice: Change all demo passwords before using the system in a real-world environment.

⸻

🔌 API Endpoints

Endpoint	Description
POST /api/auth/login	User authentication
/api/rooms	Room management
/api/customers	Customer management
/api/bookings	Booking management
/api/stay/checkin/:id	Guest check-in
/api/stay/checkout/:id	Guest check-out
/api/billing	Payments, invoices & statistics

⸻

🗺️ Future Improvements

The following features are planned for future development:

* [ ]	Restaurant Management Module
* [ ]	Staff Management & Scheduling
* [ ]	Housekeeping Tasks
* [ ]	Maintenance Requests
* [ ]	Reports & Analytics using Chart.js
* [ ]	Room Image Uploads
* [ ]	Booking Editing
* [ ]	Notification System

⸻

👩‍💻 Author

Huda Saed

🔗 GitHub Profile

⸻

📄 License

This project is developed for educational and portfolio purposes.

⸻

<p align="center">
  <strong>🏨 Smart Hotel Management System</strong>
  <br>
  Making Hotel Management Smarter and Easier.
  <br><br>
  ⭐ If you like this project, consider giving it a star!
</p>
