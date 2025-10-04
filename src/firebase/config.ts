const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBGoiR4anhjIegDmZNnayDTpVVB7-4Nj9Q",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-347648346-b57e9.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-347648346-b57e9",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-347648346-b57e9.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "648907285239",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:648907285239:web:0821acac2a1dda4271e9f2",
};

export { firebaseConfig };