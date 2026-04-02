import { initializeApp } from "firebase/app";

let app = null;

const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;

if (apiKey && projectId && !apiKey.includes('Demo')) {
  const firebaseConfig = {
    apiKey: apiKey,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: projectId,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  };
  app = initializeApp(firebaseConfig);
}

export const logCustomEvent = (eventName, eventParams) => {
  console.log(`[Analytics] Event: ${eventName}`, eventParams);
};

export { app };
