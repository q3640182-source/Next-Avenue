"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { sellSubmissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { google } from "googleapis";

// Ensure auth wrapper
async function checkAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function updateSubmissionStatus(id: number, status: "new" | "contacted" | "listed" | "closed") {
  try {
    await checkAdmin();
    await db.update(sellSubmissions).set({ status }).where(eq(sellSubmissions.id, id));
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function retrySheetSync(id: number) {
  try {
    await checkAdmin();
    
    // Fetch submission
    const [submission] = await db.select().from(sellSubmissions).where(eq(sellSubmissions.id, id));
    if (!submission) return { success: false, error: "Not found" };
    if (submission.sheetSynced) return { success: true, message: "Already synced" };

    // Google Sheets integration (Copied logic from Phase 5 sell action)
    const auth_client = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth: auth_client });
    
    const row = [
      submission.id,
      new Date(submission.createdAt).toLocaleString(),
      submission.ownerName,
      submission.phone,
      submission.email || "",
      submission.propertyType,
      submission.sector || "",
      submission.address || "",
      submission.price || "",
      submission.description || "",
      submission.remarks || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "A:K",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    // Mark as synced
    await db.update(sellSubmissions).set({ sheetSynced: true }).where(eq(sellSubmissions.id, id));
    
    return { success: true };
  } catch (error: any) {
    console.error("Retry sync failed:", error);
    return { success: false, error: error.message || "Failed to sync to sheets" };
  }
}

export async function deleteSubmission(id: number) {
  try {
    await checkAdmin();
    await db.delete(sellSubmissions).where(eq(sellSubmissions.id, id));
    return { success: true };
  } catch (error) {
    console.error("Delete submission failed:", error);
    return { success: false, error: "Failed to delete submission" };
}
}
