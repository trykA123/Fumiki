import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { themes, type ThemeConfig } from '../themes';

type ThemeId = ThemeConfig['id'];

function createThemeStore() {
    const { subscribe, set, update } = writable<ThemeId>('sumi');

    return {
        subscribe,
        init: () => {
            if (!browser) return;
            const storedTheme = localStorage.getItem('fumiki-theme') as ThemeId | null;
            if (storedTheme && themes[storedTheme]) {
                set(storedTheme);
                document.documentElement.setAttribute('data-theme', storedTheme);
            } else {
                document.documentElement.setAttribute('data-theme', 'sumi');
            }
        },
        setTheme: (id: ThemeId) => {
            if (!themes[id]) return;
            set(id);
            if (browser) {
                localStorage.setItem('fumiki-theme', id);
                document.documentElement.setAttribute('data-theme', id);
            }
        }
    };
}

export const themeId = createThemeStore();
export const theme = derived(themeId, ($id) => themes[$id]);
