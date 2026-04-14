const express = require("express");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// Firebase Admin setup
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/* =========================
   SEND NOTIFICATION API
========================= */
app.post("/send", async (req, res) => {
  const {
    uid,
    title,
    body,
    icon,
    image,
    badge,
    requireInteraction,
    tag,
    link
  } = req.body;

  try {
    const doc = await db.collection("fcm_token").doc(uid).get();

    if (!doc.exists) {
      return res.json({ success: false, error: "No token found" });
    }

    const token = doc.data().token;

    const message = {
      token,

      notification: {
        title,
        body,
      },

      webpush: {
        notification: {
          icon,
          image,
          badge,
          tag,
          requireInteraction: requireInteraction ?? false,
        },

        fcm_options: {
          link,
        },
      },
    };

    const result = await admin.messaging().send(message);

    res.json({ success: true, result });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

/* =========================
   GET USER UID API
========================= */
app.post("/get-user", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ success: false, error: "Missing ID Token" });
  }

  try {
    // Verify the token sent from the frontend
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    res.json({ success: true, uid });
  } catch (err) {
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
});

/* =========================
   GET ALL USER UIDs API
========================= */
app.get("/get-uids", async (req, res) => {
  try {
    const snapshot = await db.collection("fcm_token").get();
    
    // Return an array of all user details with human-readable timestamps (e.g., 14/4/2026, 4:14:41 PM)
    const users = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        ...data,
        createAt: data.createAt?.toDate ? data.createAt.toDate().toLocaleString('en-GB') : data.createAt,
        updateAt: data.updateAt?.toDate ? data.updateAt.toDate().toLocaleString('en-GB') : data.updateAt,
      };
    });

    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});