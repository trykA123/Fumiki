import { createMiddleware } from 'hono/factory';

// Placeholder empty session context until Task 0.7 Auth Flow
export type Env = {
    Variables: {
        user: any | null; // Will type properly later
    }
}

export const sessionMiddleware = createMiddleware<Env>(async (c, next) => {
    // Pass-through for now
    c.set('user', null);
    await next();
});
