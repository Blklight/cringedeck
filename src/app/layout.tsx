import { GeistPixelCircle, GeistPixelSquare } from "geist/font/pixel";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { QueryProvider } from "@/components/query-provider";
import { ServiceWorker } from "@/components/service-worker";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { withBasePath } from "@/lib/env";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Cartas Contra a Humanidade",
  description: "Cards Against Humanity online, direto do navegador (P2P).",
  applicationName: "Cringedeck",
  appleWebApp: {
    capable: true,
    title: "Cringedeck",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: withBasePath("/icons/favicon-48.png"), sizes: "48x48" },
      { url: withBasePath("/icons/icon-192.png"), sizes: "192x192" },
    ],
    apple: withBasePath("/icons/apple-touch-icon.png"),
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f7" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        inter.variable,
        "font-mono",
        jetBrainsMono.variable,
        GeistPixelSquare.variable,
        GeistPixelCircle.variable,
      )}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={["light", "dark", "book"]}
          disableTransitionOnChange
        >
          <QueryProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster />
            <ServiceWorker />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
