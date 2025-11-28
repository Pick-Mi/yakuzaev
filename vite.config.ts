import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    // Generate source maps for debugging
    sourcemap: true,
    // Disable minification for readable output
    minify: mode === 'production' ? 'esbuild' : false,
    // Keep readable CSS class names
    cssMinify: mode === 'production',
    // Increase chunk size warning limit to handle large dependencies
    chunkSizeWarningLimit: 3000,
    // Preserve original file structure
    rollupOptions: {
      output: {
        // Preserve module structure
        preserveModules: false,
        // Add comments in output
        banner: '/* Yakuza EV - Built with Lovable */',
        // Split large dependencies into separate chunks
        manualChunks(id) {
          // Separate Hugging Face transformers (includes large .wasm files) into its own chunk
          if (id.includes('@huggingface/transformers')) {
            return 'transformers';
          }
          // Separate node_modules into vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
