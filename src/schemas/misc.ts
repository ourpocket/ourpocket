import { z } from "zod";

const createApiKey = z.object({
	name: z.string().min(1),
	mode: z.string(),
});

export { createApiKey };
