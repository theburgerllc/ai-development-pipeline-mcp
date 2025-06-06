/** @type {import('next').NextConfig} */
const nextConfig = {
  // External packages for server components
  serverExternalPackages: ['@modelcontextprotocol/sdk'],

  // TypeScript configuration
  typescript: {
    // Allow production builds to complete even if there are type errors
    // (useful for Vercel deployment)
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Allow production builds to complete even if there are ESLint errors
    ignoreDuringBuilds: false,
  },

  // Environment variables that should be available on the client side
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  // Headers configuration for security
  async headers() {
    return [
      {
        // Apply security headers to all API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Rewrites for API routes (if needed)
  async rewrites() {
    return [
      {
        source: '/mcp',
        destination: '/api/mcp',
      },
    ];
  },

  // Webpack configuration for better compatibility
  webpack: (config, { isServer }) => {
    // Handle Node.js modules that might not work in the browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }

    return config;
  },

  // Output configuration for Vercel
  output: 'standalone',

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Compression
  compress: true,

  // Image optimization (if using Next.js Image component)
  images: {
    domains: [],
    unoptimized: true, // Disable for static export if needed
  },

  // Trailing slash configuration
  trailingSlash: false,

  // Development configuration
  ...(process.env.NODE_ENV === 'development' && {
    // Enable React strict mode in development
    reactStrictMode: true,
  }),
};

module.exports = nextConfig;
