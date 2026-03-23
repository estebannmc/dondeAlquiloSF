const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();

// En producción se cargaría desde un archivo JSON o una variable de entorno con el JSON base64
// Para prototipado rápido asumimos que las credenciales están en FIREBASE_SERVICE_ACCOUNT
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null;

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  console.warn("Firebase Service Account not found. Firestore will not work.");
}

const db = admin.firestore();
module.exports = { admin, db };
