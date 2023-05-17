/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    app_secret: process.env.APP_SECRET,
  },
};

module.exports = nextConfig;
