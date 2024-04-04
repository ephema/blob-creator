import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://blobs.ephema.io",
      lastModified: new Date("2024/04/04 16:30 UTC"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
