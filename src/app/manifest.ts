import type { MetadataRoute } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/brand";
import { withBasePath } from "@/lib/env";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: withBasePath("/"),
    name: APP_NAME,
    short_name: APP_NAME,
    description: APP_DESCRIPTION,
    start_url: withBasePath("/"),
    scope: withBasePath("/"),
    display: "standalone",
    orientation: "any",
    background_color: "#111111",
    theme_color: "#111111",
    categories: ["games", "entertainment"],
    icons: [
      {
        src: withBasePath("/icons/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/icon-maskable-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
