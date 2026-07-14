# 📚 Book Store Backend API
---

## Overview

This project is a **Node.js + Express.js backend REST API** designed for a Book Store / E‑commerce–style application. It implements **secure authentication, role‑based access control (RBAC), and modular routing** following industry‑standard backend architecture.

The goal of this project is to build a **production‑ready backend** that demonstrates clean code structure, security best practices, and scalability — suitable for real‑world applications and technical interviews.

---

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** JWT (JSON Web Tokens)
* **Authorization:** Role‑Based Access Control (RBAC)
* **Password Security:** bcrypt
* **Environment Management:** dotenv

---

## Project Structure

```
BOOK-STORE-BACKEND
│
├── Documentation/          # API & project documentation
├── imgsrc/                 # Assets / images (if needed)
│
├── Models/                 # Mongoose schemas
│   ├── books.js
│   ├── cart.js
│   ├── order.js
│   └── users.js
│
├── Routes/                 # Express route handlers
│   ├── adminRoute.js
│   ├── bookRoute.js
│   ├── cartRoute.js
│   ├── orderRoute.js
│   └── userRoute.js
│
├── adminAuth.js             # Admin authentication logic
├── jwtAuthMiddleWare.js     # JWT verification middleware
├── rbacAuth.js              # Role‑based access control
├── db.js                    # Database connection
├── server.js                # Application entry point
│
├── .env                     # Environment variables
├── package.json
└── package-lock.json
```

---

## Core Features

### Authentication

* User registration & login
* Secure password hashing using **bcrypt**
* JWT generation and validation

### Authorization

* Role‑based access control (Admin / User)
* Protected routes using middleware

### Modules

* User management
* Book management
* Cart management
* Order management

---

## Security Practices

* Passwords are never stored in plain text
* JWT used for stateless authentication
* Role checks enforced at route level
* Environment variables used for secrets

---

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## Installation & Setup

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start the server
npm start
```

Server will run at:

```
http://localhost:3000
```

---

## API Testing

* Tested using **Postman**
* Authorization handled via **Bearer Token**

Example:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Current Status

🚧 **This project is actively under development.**

Planned improvements:

* API documentation (Swagger)
* Input validation (Joi / Zod)
* Pagination & filtering
* Centralized error handling
* Unit & integration tests

---

## Purpose

This project is built to:

* Demonstrate backend engineering skills
* Practice real‑world authentication & authorization
* Prepare for **Node.js backend interviews**
* Serve as a scalable base for future features

---

## Author

**Abhinendra Singh**
Aspiring Backend Developer (Node.js)

---

⭐ *This repository will continue to evolve as new features are added.*
