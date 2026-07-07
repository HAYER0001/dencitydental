import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DENCITY Dental Care",
    short_name: "DENCITY",
    description: "Modern, gentle dental care — Progressive Web App.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F1717",
    theme_color: "#0A5C5C",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
