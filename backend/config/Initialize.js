// INITIALIZE FIREBASE
const admin = require('firebase-admin')
const serviceAccount = require('./key/firebase-sdk.js')
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

// DEFAULT VARIABLE
exports.db = admin.firestore()
exports.auth = admin.auth()
exports.storage = admin.storage()