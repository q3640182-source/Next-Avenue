"use server";

import { db } from "@/lib/db";
import { sellSubmissions } from "@/db/schema";
import { google } from "googleapis";
import { Resend } from "resend";
import { z } from "zod";
import { eq } from "drizzle-orm";

const formSchema = z.object({
  ownerName: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email().optional().or(z.literal("")),
  propertyType: z.enum(["house", "apartment", "commercial", "office", "plot"]),
  sector: z.string().optional(),
  address: z.string().optional(),
  price: z.string().optional(),
  description: z.string().optional(),
  remarks: z.string().optional(),
});

export async function submitSellForm(data: z.infer<typeof formSchema>) {
  try {
    // 1. Validate data
    const validatedData = formSchema.parse(data);

    // 2. Insert into database (Source of Truth)
    const [submission] = await db
      .insert(sellSubmissions)
      .values({
        ...validatedData,
        price: validatedData.price ? Number(validatedData.price) : null,
        email: validatedData.email || null,
        status: "new",
        sheetSynced: false,
      })
      .returning();

    // 3. Attempt Google Sheets Sync
    let sheetSynced = false;
    try {
      const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
      const sheetId = process.env.GOOGLE_SHEET_ID;

      if (email && privateKey && sheetId) {
        const auth = new google.auth.JWT({
          email,
          key: privateKey,
          scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        // Append row
        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: "Sheet1!A1", // Adjust tab name if necessary
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [
              [
                submission.id,
                validatedData.ownerName,
                validatedData.phone,
                validatedData.email || "",
                validatedData.propertyType,
                validatedData.sector || "",
                validatedData.price || "",
                new Date().toISOString(),
              ],
            ],
          },
        });

        await db
          .update(sellSubmissions)
          .set({ sheetSynced: true })
          .where(eq(sellSubmissions.id, submission.id));

        sheetSynced = true;
      } else {
        console.warn("Google Sheets credentials not fully configured.");
      }
    } catch (sheetError) {
      // Catch but do NOT fail the request. The DB insert succeeded.
      console.error("Google Sheets sync failed:", sheetError);
    }

    // 4. Attempt Email Notification
    try {
      const resendKey = process.env.RESEND_API_KEY;
      const adminEmail = process.env.ADMIN_EMAIL;

      if (resendKey && adminEmail) {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: "Next Avenue <onboarding@resend.dev>",
          to: adminEmail,
          subject: `New Property Listing Request: ${validatedData.propertyType}`,
          html: `
            <h2>New Property Listing Request</h2>
            <p><strong>Name:</strong> ${validatedData.ownerName}</p>
            <p><strong>Phone:</strong> ${validatedData.phone}</p>
            <p><strong>Type:</strong> ${validatedData.propertyType}</p>
            <p><strong>Sector:</strong> ${validatedData.sector || "N/A"}</p>
          `,
        });
      }
    } catch (emailError) {
      console.error("Resend email failed:", emailError);
    }

    return { success: true, sheetSynced };
  } catch (error) {
    console.error("Submission failed:", error);
    return { success: false, error: "Failed to submit form" };
  }
}
