const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let serviceAccount;

const keyPath = path.join(__dirname, 'serviceAccountKey.json');
if (fs.existsSync(keyPath)) {
  serviceAccount = require(keyPath);
} else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
}

if (!serviceAccount) {
  throw new Error('Firebase service account not found. Create config/serviceAccountKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

module.exports = { admin, db };
