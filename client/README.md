# 🔐 MERN Stack Authentication System

A comprehensive Full-Stack Authentication system built using the MERN stack. This project includes secure user registration, login, email verification via OTP, and password recovery features.

## 🚀 Features

* *User Authentication*: Secure login and registration with hashed passwords.
* *Email Verification*: Automatic OTP generation and email delivery for account verification.
* *Password Reset*: OTP-based password recovery system for forgotten passwords.
* *JWT Security*: Protected routes and user sessions using JSON Web Tokens.
* *Middleware Integration*: Custom userAuth middleware for backend security.
* *Modern UI*: Responsive frontend built with React.js and Vite.

## 🛠️ Tech Stack

* *Frontend*: React.js (Vite)
* *Backend*: Node.js, Express.js
* *Database*: MongoDB
* *Email Service*: Nodemailer (via SMTP)
* *Authentication*: JWT & Bcrypt

## 📂 Folder Structure

* /client: Frontend React application.
* /server: Backend Express API with authentication logic.

## ⚙️ Setup & Installation

1.  *Clone the Repository*:
    bash
    git clone <your-repo-url>
    

2.  *Server Configuration*:
    * Navigate to the server folder.
    * Install dependencies: npm install
    * Create a .env file and add:
        * MONGO_URI
        * JWT_SECRET
        * SENDER_EMAIL & SENDER_PASSWORD (for Nodemailer)

3.  *Frontend Configuration*:
    * Navigate to the client folder.
    * Install dependencies: npm install

4.  *Run the Project*:
    * Start Backend: npm start or npm run dev
    * Start Frontend: npm run dev

---
Created with ❤️ for MERN Developers.