import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Unsplash - Images gratuites
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/**",
      },
      // Bing Images
      {
        protocol: "https",
        hostname: "tse1.mm.bing.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tse2.mm.bing.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tse3.mm.bing.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tse4.mm.bing.net",
        port: "",
        pathname: "/**",
      },
      // Google Images
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.google.com",
        port: "",
        pathname: "/**",
      },
      // Cloudinary - Service d'images populaire
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      // Imgur - Hébergement d'images
      {
        protocol: "https",
        hostname: "i.imgur.com",
        port: "",
        pathname: "/**",
      },
      // Pexels - Images gratuites
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      // PNGTree - Images et arrière-plans
      {
        protocol: "https",
        hostname: "fr.pngtree.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pngtree.com",
        port: "",
        pathname: "/**",
      },
      // Shutterstock
      {
        protocol: "https",
        hostname: "image.shutterstock.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
        port: "",
        pathname: "/**",
      },
      // Getty Images
      {
        protocol: "https",
        hostname: "media.gettyimages.com",
        port: "",
        pathname: "/**",
      },
      // Domaines génériques pour hébergement d'images
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.freepik.com",
        port: "",
        pathname: "/**",
      },
      // Pour les images locales ou domaines personnalisés
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      // Assets NST
      {
        protocol: "https",
        hostname: "assets.nst.com.my",
        port: "",
        pathname: "/**",
      },
    ],
    // Configuration pour optimiser les images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60, // Cache pendant 60 secondes minimum
    
  },
};

export default nextConfig;

