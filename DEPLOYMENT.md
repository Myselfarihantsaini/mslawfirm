# Launch at msadvocates.co.in

Prepared Render Blueprint: render.yaml. Requires a paid web service and persistent disk. No service has been provisioned and no purchase has been made.

1. Put the project source in a private Git repository, excluding .env*, data/, backups/, node_modules/ and .next/. Never push local enquiry data, credentials or source backups.
2. Connect that repository to a Render Blueprint. Review the paid service and disk before creating it.
3. Add the Google OAuth client ID and secret in Render's secret environment settings. Allowlisted admin: msadvocates.legal@gmail.com. In Google Cloud, authorise exactly https://msadvocates.co.in/api/auth/google/callback. Add the account as a test user if the consent app is in testing.
4. Verify the Render preview: homepage, all routes, Google login, create/edit/publish/archive a test judgment, image upload, receipt of a test enquiry and sign-out. Check published posts remain visible after restart. Do not assume build success verifies live functionality.
5. Add msadvocates.co.in in Render Custom Domains. Copy the actual DNS records Render supplies to GoDaddy. Do not invent record values. Preserve mail MX/TXT records. Configure www only if desired. Wait for domain validation and HTTPS.
6. Back up the local SQLite database using SQLite's backup API before transferring it, together with data/uploads, if existing content must be retained. Keep credential files off the server's public files. Arrange database and upload backups.
7. Obtain the advocate's content/compliance review and confirm privacy contact, retention arrangements, address/hours and CAT scope. Google credentials are currently missing locally.

The disk mounts at /opt/render/project/src/data, preserving the database and uploads. Run only one instance with SQLite. Editor endpoints remain development-only. The public admin remains passwordless and requires Google authentication. Search indexing remains disabled until final content approval. Production callback/domain environment variables are included in render.yaml; local development settings are unchanged.
