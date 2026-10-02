# Setup Guide: Third-Party Integrations

## 1. Google Sheets API (for Form Sync)

To enable the "Sell Your Property" form to sync submissions to a Google Sheet, follow these steps:

1. **Create a Google Cloud Project**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project (no billing account is required for basic Sheets API usage).

2. **Enable the Google Sheets API**
   - Navigate to **APIs & Services > Library**.
   - Search for "Google Sheets API" and click **Enable**.

3. **Create a Service Account**
   - Navigate to **APIs & Services > Credentials**.
   - Click **Create Credentials > Service Account**.
   - Name it (e.g., `next-avenue-forms`) and create it.
   - Click on the created service account, go to the **Keys** tab, click **Add Key > Create new key**, and choose **JSON**.
   - A JSON file will download. Open it in a text editor.

4. **Prepare the Google Sheet**
   - Create a new Google Sheet.
   - Share it with the `client_email` found in your downloaded JSON file, giving the service account **Editor** access.
   - Note the **Sheet ID** from the URL (it's the long string between `/d/` and `/edit`).

5. **Configure Environment Variables**
   Add the following to your `.env.local`:
   ```env
   GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account-email@project-id.iam.gserviceaccount.com"
   # Make sure to copy the entire private key string including the \n characters
   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEET_ID="your-sheet-id-here"
   ```

---

## 2. Resend (for Email Notifications)

1. **Create an Account**
   - Go to [Resend](https://resend.com) and create an account/project.

2. **Generate an API Key**
   - Navigate to **API Keys** and generate a new key.

3. **Configure Environment Variables**
   Add the following to your `.env.local`:
   ```env
   RESEND_API_KEY="re_..."
   ADMIN_EMAIL="your-email@example.com"
   ```
   *Note: If you are using Resend on a free tier, you can only send emails to the email address registered with your Resend account until you verify a domain.*
