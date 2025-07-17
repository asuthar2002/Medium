# Medium

A full-stack Medium-like blogging platform with Google OAuth, email authentication, and modern React/Node.js stack.

---

## 🚀 Project Structure

- `frontend/` — React (Vite) client
- `backend/` — Node.js/Express/Sequelize API

---

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/asuthar2002/Medium.git
cd Medium
```

### 2. Install dependencies
```bash
cd frontend
npm install
cd ../backend
npm install
```

### 3. Environment Variables
- Copy `.env.example` to `.env` in both `frontend/` and `backend/` (create `.env.example` if not present).
- Fill in all required keys (see below for backend):

**Example `backend/.env`:**
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password_or_app_password
ADMIN_INVITE_CODE=your_admin_code
```

**Example `frontend/.env`:**
```
VITE_GOOGLE_AUTH_URL=http://localhost:5000/api/auth/google
```

---

### 4. Database Setup
- The backend uses MySQL (or your configured DB).
- Make sure your DB is running and credentials are set in `backend/src/models/index.js` or your config file.
- Tables will auto-sync on first run.

---

### 5. Running the App

#### Start Backend
```bash
cd backend
npm run dev
# or
```

#### Start Frontend
```bash
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 🔑 Features
- Google OAuth & Email/Password login
- JWT authentication
- Email verification & password reset
- Create, edit, and delete posts
- Admin panel


---

asuthar2002@gmail.com

8221855154

---

Happy coding!

