1. Push to GitHub, import in Vercel.
2. Storage > Blob store (PUBLIC) connected to project -> adds BLOB_READ_WRITE_TOKEN.
3. Storage > create a second Blob store set to PRIVATE, connect it to the project with env prefix "PRIVATE" (variable must end up named PRIVATE_BLOB_READ_WRITE_TOKEN or PRIVATE_READ_WRITE_TOKEN; if different, edit lib/auth.js).
4. Env var ADMIN_PASSWORD. Redeploy.
Manage everything at /admin. Edit text in lib/config.js. Discord card: set discordId and join discord.gg/lanyard.
