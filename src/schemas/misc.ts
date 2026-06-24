import { z } from "zod";

const createApiKey = z.object({
	name: z.string().min(1),
	mode: z.enum(["test", "live"]),
});

export { createApiKey };
