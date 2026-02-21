import { writable } from 'svelte/store';

export interface ToastMessage {
    id: string;
    message: string;
    intent: 'info' | 'success' | 'error' | 'warning';
    duration: number;
}

function createToastStore() {
    const { subscribe, set, update } = writable<ToastMessage[]>([]);

    return {
        subscribe,
        add: (message: string, intent: ToastMessage['intent'] = 'info', duration = 4000) => {
            const id = crypto.randomUUID();
            const newToast: ToastMessage = { id, message, intent, duration };

            update(toasts => [...toasts, newToast]);
            return id;
        },
        remove: (id: string) => {
            update(toasts => toasts.filter(t => t.id !== id));
        },
        clear: () => set([])
    };
}

export const toast = createToastStore();
