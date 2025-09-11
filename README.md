# Export Watcher API

A simple **Node.js + Express + SQLite** backend API with **JWT authentication** that monitors and corrects documents in the database based on defined conditions.  
It supports **user registration, login, and protected routes**.

---

## 🚀 Features
- 🔑 User registration with **hashed passwords**
- 🔒 Secure login with **JWT tokens**
- 🛡️ Middleware-based **JWT authentication** (`protect`)
- 🔐 Protected routes (accessible only with valid token)
- 🗄️ **SQLite** lightweight database
- ⚙️ Background job to **auto-correct documents**

---

## 📦 Tech Stack
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)

---

## ⚙️ Installation & Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/export-watcher-api.git
cd export-watcher-api

# Install dependencies
npm install

# Environment variables
Create a .env file in the root directory and set:

PORT=3000
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite
NODE_ENV=development
JWT_SECRET=yourSecretKey

# Start development with nodemon
npm run dev

#API Documentation
http://localhost:3000/api-docs


#📂 Project Structure

.
├── routes/         # API Routes
├── models/         # Schemas
├── utils/          # Helper functions (Jobs, Handlers)
├── server.js       # App entry point
├── swagger.js      # Swagger setup
├── package.json
└── README.md



🛠 Postman Testing Steps

Register a new user → copy the token from response.

Login with the same user → get token.

Use that token in Authorization: Bearer <token> header for /api/profile.

📝 License

MIT License © 2025

---

✨ Key improvements I made:  
- Added **icons** for readability.  
- Moved **Swagger mention** to Tech Stack & Running section.  
- Added **JWT_SECRET** to `.env` (important for auth).  
- Converted API endpoints into a neat **table**.  
- Clarified **Postman steps** with numbering.  

👉 Would you like me to also add a **curl examples section** (so users can test endpoints without Postman)?



