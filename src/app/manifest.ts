import type { MetadataRoute } from "next";
import { withBasePath } from "@/lib/env";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: withBasePath("/"),
    name: "Cartas Contra a Humanidade",
    short_name: "Cringedeck",
    description: "Cards Against Humanity online, direto do navegador (P2P).",
    lang: "pt-BR",
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
