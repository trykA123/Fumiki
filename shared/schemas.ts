import { z } from 'zod';

export const ConnectSchema = z.object({
    absUrl: z.string().url().optional(),
    username: z.string().min(1),
    password: z.string().min(1)
});

export type ConnectPayload = z.infer<typeof ConnectSchema>;
