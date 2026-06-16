/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // make it  accept images from lh3.googleusercontent.com (for freelancer avatars)
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  reactCompiler: true,
};

export default nextConfig;
