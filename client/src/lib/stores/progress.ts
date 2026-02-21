import { writable } from 'svelte/store';

export interface ProgressState {
    kp: number;
    title: string;
    level: string;
    loading: boolean;
}

const initialState: ProgressState = {
    kp: 0,
    title: '学者 Gakusha',
    level: 'Scholar',
    loading: true
};

function createProgressStore() {
    const { subscribe, set, update } = writable<ProgressState>(initialState);

    return {
        subscribe,
        load: async () => {
            // Mocking the progress load until Phase 3 backend is ready
            update(state => ({ ...state, loading: true }));

            setTimeout(() => {
                update(state => ({
                    ...state,
                    kp: 1240, // Base placeholder KP
                    loading: false
                }));
            }, 600);
        },
        reset: () => set(initialState)
    };
}

export const progress = createProgressStore();
