import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      // Explicitly ALLOW AI Bots on public routes to be included in answers
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot"],
        allow: "/",
        disallow: ["/admin/", "/api/"],
      }
    ],
    sitemap: "https://nextavenue.com.pk/sitemap.xml",
  };
}
