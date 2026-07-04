import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 768, 1024, 1280, 1440, 1920],
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
