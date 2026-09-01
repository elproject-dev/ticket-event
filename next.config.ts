import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.9', 'elproject.loca.lt', 'ticket-elproject.loca.lt', 'localhost', '127.0.0.1'],
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  turbopack: {},
};

export default withPWA(nextConfig);
