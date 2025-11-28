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
    // Preserve original file structure
    rollupOptions: {
      output: {
        // Preserve module structure
        preserveModules: false,
        // Add comments in output
        banner: '/* Yakuza EV - Built with Lovable */',
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
