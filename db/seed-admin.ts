import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
  const { auth } = await import("../lib/auth");
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
    process.exit(1);
  }

  console.log(`Seeding admin user: ${email}...`);

  try {
    const res = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: "Admin",
      },
    });

    console.log("Admin seeded successfully:", res.user.email);
    process.exit(0);
  } catch (error: any) {
    console.error("Failed to seed admin. They might already exist or there was an error.", error?.message || error);
    process.exit(1);
  }
}

main();
