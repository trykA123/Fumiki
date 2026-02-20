import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    compilerOptions: {
        runes: true
    },
    kit: {
        adapter: adapter({
            fallback: 'index.html' // SPA mode
        }),
        alias: {
            $components: 'src/lib/components',
            $ui: 'src/lib/components/ui',
            $themes: 'src/lib/themes',
            $stores: 'src/lib/stores',
            $api: 'src/lib/api'
        }
    }
};

export default config;
