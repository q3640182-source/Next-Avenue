import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { blogPosts } from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const posts = [
  {
    title: "Step-by-step guide to selling your property in Pakistan",
    slug: "step-by-step-guide-selling-property-pakistan",
    excerpt: "Navigating the real estate market in Pakistan can be daunting. Here is a comprehensive guide to getting the best price for your home with zero hassle.",
    content: `
Selling a property in Pakistan involves multiple steps, from valuation to legal transfer. Whether you are selling a commercial plaza in Blue Area or a residential house in F-7, the fundamental principles remain the same.

## 1. Accurate Valuation

The most common mistake sellers make is overpricing. 
An overpriced property sits on the market for months, eventually becoming "stale". Buyers assume there is something wrong with it. Use a professional agency to run a comparative market analysis (CMA).

## 2. Prepare the Property

First impressions matter. 
- Fix leaky faucets
- Repaint faded walls (stick to neutral colors)
- Ensure the front lawn is manicured

## 3. Marketing

Gone are the days of just putting a "For Sale" banner outside. Your property needs high-quality photos, video tours, and targeted digital marketing. This is where Next Avenue excels.

## 4. Legal Documentation

Ensure your chain of ownership documents (Fard, Allotment Letter, NDC) are clear and updated. Title disputes can kill a deal at the last minute.
    `,
    coverImage: "https://res.cloudinary.com/ld4eqh8j/image/upload/v1727083000/mock/blog1_qweasd.jpg", // Placeholder
    author: "Tariq Ali",
    published: true,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
  },
  {
    title: "Understanding Capital Gains Tax on Real Estate in 2026",
    slug: "understanding-cgt-real-estate-2026",
    excerpt: "With the recent budget changes, understanding how Capital Gains Tax (CGT) affects your real estate transaction is more important than ever.",
    content: `
Taxes are inevitable, but being surprised by them shouldn't be. The recent fiscal budget introduced revised slabs for Capital Gains Tax (CGT) on real estate transactions.

### What is CGT?

Capital Gains Tax is levied on the profit you make from selling a capital asset (like real estate). The rate depends on two main factors:
1. **Filer Status:** Active taxpayers (filers) pay significantly less than non-filers.
2. **Holding Period:** The longer you hold the property, the lower the tax rate.

### Holding Period Breakdown

For open plots:
- Held for less than 1 year: 15%
- Held between 1-2 years: 12.5%
- Held for over 6 years: 0%

> **Pro Tip:** Always calculate your net proceeds *after* CGT and agent commissions before agreeing to a final selling price.

Consult a certified tax consultant before finalizing your transaction to ensure full compliance with FBR regulations.
    `,
    coverImage: "https://res.cloudinary.com/ld4eqh8j/image/upload/v1727083000/mock/blog2_qweasd.jpg", // Placeholder
    author: "Aisha Khan",
    published: true,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
  {
    title: "Why Islamabad's D-12 Sector is the Hottest Investment Right Now",
    slug: "why-islamabad-d12-hottest-investment",
    excerpt: "Nestled at the foothills of the Margallas, Sector D-12 offers a unique blend of scenic beauty and rapid capital appreciation.",
    content: `
Islamabad's real estate market has seen shifts over the last decade, with growth pushing outwards towards the new airport. However, Sector D-12 remains a crown jewel for both end-users and investors.

## Unmatched Location

D-12 sits right against the Margalla Hills. The elevation provides cooler breezes and stunning views that newer sectors simply cannot match. It also benefits from direct access via the newly completed Margalla Avenue, drastically cutting commute times to the city center.

## Price Appreciation

Over the last 3 years, 1-Kanal plots in D-12 have outperformed neighboring sectors by nearly 18%. Why?
1. **Scarcity:** There is no more land available this close to the hills.
2. **Development:** CDA has rapidly completed the remaining infrastructure work.
3. **Commercial Hub:** The Markaz is booming with new cafes, banks, and retail outlets.

If you are looking for a secure investment that also promises a premium lifestyle, D-12 should be at the top of your list.
    `,
    coverImage: "https://res.cloudinary.com/ld4eqh8j/image/upload/v1727083000/mock/blog3_qweasd.jpg", // Placeholder
    author: "Zain Malik",
    published: true,
    publishedAt: new Date(), // Today
  }
];

async function main() {
  console.log("Seeding blog posts...");
  for (const post of posts) {
    await db.insert(blogPosts).values(post);
  }
  console.log("Blog posts seeded successfully.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
