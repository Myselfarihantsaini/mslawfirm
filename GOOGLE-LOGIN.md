# Google admin sign-in setup

Create an OAuth client of type Web application in Google Cloud / Google Auth Platform. Set the authorised redirect URI to exactly:
http://127.0.0.1:3000/api/auth/google/callback

Put GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET into .env.local, and set ADMIN_GOOGLE_EMAILS to the approved admin email(s), comma separated. Keep the existing ADMIN_SECRET private. Restart the local server. Google credentials must remain server-only; do not post the client secret in chat or commit .env.local. In testing mode, add the authorised account as a test user when required by Google.

For deployment, use an HTTPS redirect URI matching the real domain in both Google Cloud and GOOGLE_REDIRECT_URI. Google login requests only identity/email scopes, verifies the ID token and email verification, checks the allowlist, and uses state plus PKCE. Password login is disabled. Live Google login cannot be tested until credentials and the approved email are configured.
