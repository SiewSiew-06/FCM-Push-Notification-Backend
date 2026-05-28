# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Single-service Node.js/Express backend for Firebase Cloud Messaging (FCM) push notifications. See `README.md` for API docs and setup steps.

### Running the dev server

```bash
npm run dev
```

Starts nodemon on port 3001. The server requires a `serviceAccountKey.json` file in the project root (gitignored). Without real Firebase credentials, the server will start and the health-check route (`GET /`) will work, but all Firebase-dependent endpoints (`/send`, `/get-uids`, `/get-user`) will return authentication errors.

### Firebase credentials

The server crashes on startup without `serviceAccountKey.json`. For local development with mock credentials, generate a dummy RSA key and create the file with the standard Google service account JSON structure (fields: `type`, `project_id`, `private_key_id`, `private_key`, `client_email`, `client_id`, `auth_uri`, `token_uri`). This lets the server boot and serve the health-check route.

For full end-to-end testing, a real `serviceAccountKey.json` from the Firebase Console is required (see `README.md` > Prerequisites).

### Testing

No automated test suite exists (`npm test` exits with an error by design). Verify the server manually:

```bash
curl http://localhost:3001/          # Should return "Backend running"
curl -X POST http://localhost:3001/get-user -H "Content-Type: application/json" -d '{}'  # Returns validation error
```

### Linting

No linter is configured in this project.
