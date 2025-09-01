import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'krishi-logo.svg', 'site.webmanifest'],
      manifest: {
        name: 'KrishiBondhu - Agricultural Platform',
        short_name: 'KrishiBondhu',
        description: 'Connecting farmers, customers, warehouses, and delivery partners',
        theme_color: '#16a34a',
        background_color: '#f8fdf8',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/krishi-logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/krishi-logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets'
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  build: {
    // Terser configuration for JavaScript minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production', // Remove console.log in production
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : [],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-toast'],
          'animation-vendor': ['gsap', 'lenis'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // App chunks
          'customer': [
            './src/pages/customer/CustomerDashboard.tsx',
            './src/pages/customer/Checkout.tsx',
            './src/pages/customer/CustomerOrders.tsx'
          ],
          'farmer': [
            './src/pages/farmer/FarmerDashboard.tsx',
            './src/pages/farmer/CropRecommendations.tsx',
            './src/pages/farmer/SellProducts.tsx'
          ],
          'admin': [
            './src/pages/admin/AdminDashboard.tsx',
            './src/pages/admin/UserManagement.tsx',
            './src/pages/admin/AdminAnalytics.tsx'
          ]
        }
      }
    },
    // Build optimizations
    target: 'esnext',
    cssCodeSplit: true,
    sourcemap: mode === 'development',
    // Asset optimization
    assetsInlineLimit: 4096, // 4kb
    chunkSizeWarningLimit: 1000,
  },
  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'gsap',
      'lenis',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-toast',
      'react-hook-form',
      'zod'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
