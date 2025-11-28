/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.neh.com",
        pathname: "/upload/test/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/api/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/media/**",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_BACKEND_URL
          ? new URL(process.env.NEXT_PUBLIC_BACKEND_URL).hostname
          : "",
      },
      // Add Frontspace CMS endpoint
      ...(process.env.FRONTSPACE_ENDPOINT
        ? [
            {
              protocol: new URL(process.env.FRONTSPACE_ENDPOINT).protocol.replace(':', '') as 'http' | 'https',
              hostname: new URL(process.env.FRONTSPACE_ENDPOINT).hostname,
              port: new URL(process.env.FRONTSPACE_ENDPOINT).port || '',
              pathname: "/api/media/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "img.svenskelitfotboll.se",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
      // Add ostersif.frontspace.se domain
      {
        protocol: "https",
        hostname: "ostersif.frontspace.se",
        pathname: "/api/media/**",
      },
      // Add Frontspace Supabase storage domain
      {
        protocol: "https",
        hostname: "supabasekong-mkssw0ooo80kowwskgggscw4.coolify.frontspace.se",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
