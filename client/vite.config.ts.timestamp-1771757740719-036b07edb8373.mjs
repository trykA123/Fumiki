// vite.config.ts
import { sveltekit } from "file:///mnt/Dev/Playground/February/Fumiki/node_modules/.bun/@sveltejs+kit@2.52.2+76796382b4ad3d78/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import { defineConfig } from "file:///mnt/Dev/Playground/February/Fumiki/node_modules/.bun/vite@5.4.21+6c36c64656125e6a/node_modules/vite/dist/node/index.js";
import tailwindcss from "file:///mnt/Dev/Playground/February/Fumiki/node_modules/.bun/@tailwindcss+vite@4.2.0+c2282314e52dab3b/node_modules/@tailwindcss/vite/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    sveltekit(),
    tailwindcss()
  ],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true
      }
    },
    fs: {
      allow: [
        ".."
        // Allow serving from the root workspace
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L0Rldi9QbGF5Z3JvdW5kL0ZlYnJ1YXJ5L0Z1bWlraS9jbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9tbnQvRGV2L1BsYXlncm91bmQvRmVicnVhcnkvRnVtaWtpL2NsaWVudC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vbW50L0Rldi9QbGF5Z3JvdW5kL0ZlYnJ1YXJ5L0Z1bWlraS9jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tICdAc3ZlbHRlanMva2l0L3ZpdGUnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgc3ZlbHRla2l0KCksXG4gICAgICAgIHRhaWx3aW5kY3NzKClcbiAgICBdLFxuICAgIHNlcnZlcjoge1xuICAgICAgICBob3N0OiB0cnVlLFxuICAgICAgICBwcm94eToge1xuICAgICAgICAgICAgJy9hcGknOiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzEyNy4wLjAuMTozMDAwJyxcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZnM6IHtcbiAgICAgICAgICAgIGFsbG93OiBbXG4gICAgICAgICAgICAgICAgJy4uJywgLy8gQWxsb3cgc2VydmluZyBmcm9tIHRoZSByb290IHdvcmtzcGFjZVxuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdULFNBQVMsaUJBQWlCO0FBQzFVLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8saUJBQWlCO0FBRXhCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVM7QUFBQSxJQUNMLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0gsUUFBUTtBQUFBLFFBQ0osUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2xCO0FBQUEsSUFDSjtBQUFBLElBQ0EsSUFBSTtBQUFBLE1BQ0EsT0FBTztBQUFBLFFBQ0g7QUFBQTtBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
