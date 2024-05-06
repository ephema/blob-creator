import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://blobs.ephema.io",
      lastModified: new Date("2024/05/06 14:37 UTC"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
