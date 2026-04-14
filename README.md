# Nuxt FCM Push Notification Backend

A lightweight Node.js/Express backend for sending Firebase Cloud Messaging (FCM) push notifications. This server integrates with Firebase Admin SDK and Firestore to manage device tokens and trigger web push notifications.

## Features
- **Token Management**: Automatically retrieves FCM tokens from Firestore based on User ID (`uid`).
- **Web Push Support**: Customizes notifications with icons, images, badges, and target links.
- **V1 API Integration**: Uses the modern Firebase Cloud Messaging V1 API.

## Prerequisites
- Node.js (v18+ recommended)
- A Firebase Project
- A `serviceAccountKey.json` from the Firebase Console (Settings > Service Accounts > Generate new private key)

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SiewSiew-06/FCM-Push-Notification-Backend.git
   cd FCM-Push-Notification-Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   Place your `serviceAccountKey.json` in the root directory of the project.

4. **Run the server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   node index.js
   ```
   The server will start on `http://localhost:3001`.

## API Documentation

### Send Notification
Triggers a push notification to a specific user.

- **URL:** `/send`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**

| Property | Type | Description |
| :--- | :--- | :--- |
| `uid` | `string` | The document ID in the `fcm_token` Firestore collection. |
| `title` | `string` | The title of the notification. |
| `body` | `string` | The main message content. |
| `icon` | `string` (Optional) | URL of the icon to display. |
| `image` | `string` (Optional) | URL of a large image within the notification. |
| `link` | `string` (Optional) | URL to open when the notification is clicked. |
| `tag` | `string` (Optional) | A unique ID used to replace existing notifications. |

**Example Request:**
```json
{
  "uid": "USER123",
  "title": "New Notification",
  "body": "Hello from your backend!",
  "link": "https://your-app.com"
}
```

