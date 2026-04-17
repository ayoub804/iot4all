# Firebase Deployment Guide

## Prerequisites

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firebase Hosting
3. Note your Firebase Project ID (from project settings)

## Steps to Deploy

### 1. Login to Firebase
```bash
firebase login
```

### 2. Update Project ID
Edit `.firebaserc` and replace `YOUR_FIREBASE_PROJECT_ID` with your actual Firebase Project ID

### 3. Initialize Firebase (Optional)
```bash
firebase init hosting
```

### 4. Deploy Frontend
```bash
cd frontend
npm run build
cd ..
firebase deploy
```

## Deploying Backend

For production, you should deploy your backend separately to platforms like:
- Render
- Railway
- Vercel
- Digital Ocean
- Heroku

Update the `NEXT_PUBLIC_API_URL` in your frontend environment variables to point to your production backend URL.

## Environment Variables

Make sure to set these in your Firebase project or `.env` file:
- `NEXT_PUBLIC_API_URL` - Your backend API URL
- Backend: `MONGO_URI`, `JWT_SECRET`, `PORT`, etc.
