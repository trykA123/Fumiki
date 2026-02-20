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
    proxy: {
      "/api": {
        target: "http://localhost:11111",
        changeOrigin: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L0Rldi9QbGF5Z3JvdW5kL0ZlYnJ1YXJ5L0Z1bWlraS9jbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9tbnQvRGV2L1BsYXlncm91bmQvRmVicnVhcnkvRnVtaWtpL2NsaWVudC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vbW50L0Rldi9QbGF5Z3JvdW5kL0ZlYnJ1YXJ5L0Z1bWlraS9jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBzdmVsdGVraXQgfSBmcm9tICdAc3ZlbHRlanMva2l0L3ZpdGUnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgc3ZlbHRla2l0KCksXG4gICAgICAgIHRhaWx3aW5kY3NzKClcbiAgICBdLFxuICAgIHNlcnZlcjoge1xuICAgICAgICBwcm94eToge1xuICAgICAgICAgICAgJy9hcGknOiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDoxMTExMScsXG4gICAgICAgICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1QsU0FBUyxpQkFBaUI7QUFDMVUsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxpQkFBaUI7QUFFeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLElBQ0wsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLEVBQ2hCO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSixPQUFPO0FBQUEsTUFDSCxRQUFRO0FBQUEsUUFDSixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsTUFDbEI7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
