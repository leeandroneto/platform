import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { withBotId } from "botid/next/config";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const baseConfig: NextConfig = {
  allowedDevOrigins: ["*.loca.lt", "*.trycloudflare.com", "*.ngrok-free.app"],
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: false },
};

export default withBotId(withNextIntl(baseConfig));
