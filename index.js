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
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});