import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout/verify/"],
      },
    ],
    sitemap: "https://lamsah-aldhaqiah.com/sitemap.xml",
    host: "https://lamsah-aldhaqiah.com",
  };
}
