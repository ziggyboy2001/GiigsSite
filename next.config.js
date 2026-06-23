/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve images directly from /public instead of through the /_next/image
    // optimizer. The screenshots are already sized appropriately, and this
    // avoids host-specific image-optimization failures (e.g. on Netlify).
    unoptimized: true,
  },
};

module.exports = nextConfig;
