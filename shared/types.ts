// Shared types will go here
export interface APIResponse<T> {
    data?: T;
    error?: string;
    detail?: string;
}
