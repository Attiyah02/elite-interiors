##  1.Live Deployment

**Live Site:** https://elite-interiors-phi.vercel.app/

## 2.Database Access
**MangoDB** invites to have been sent via email to relevant users

FurnitureShop -> furnitureDB

## 3.Admin Credentials

**Email:** admin@furniture.com  
**Password:** Admin123!

## 4.How to Run Locally

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Google Cloud API Key (for AI features)

### Backend Setup

1. Navigate to backend directory:
```bash
   cd backend
```

2. Install dependencies:
```bash
   npm install
```

3. Create `.env` file with:
```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   GOOGLE_CLOUD_API_KEY=your_google_api_key
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   FRONTEND_URL=http://localhost:5173
```

4. Start backend:
```bash
   npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
   cd frontend
```

2. Install dependencies:
```bash
   npm install
```

3. Create `.env` file with:
```
   VITE_API_URL=http://localhost:5000
```

4. Start frontend:
```bash
   npm run dev
```

5. Open browser to: `http://localhost:5173`

## 5.Technology Stack

**Frontend:**
- React + Vite
- React Router
- Axios
- Context API (state management)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Bcrypt password hashing
- Nodemailer (email notifications)

**APIs & Services:**
- Google Cloud Natural Language API
- Google Cloud Vision API
- MongoDB Atlas
- Vercel (frontend hosting)
- Render (backend hosting)
