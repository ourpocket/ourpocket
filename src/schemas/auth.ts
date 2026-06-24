import { z } from "zod";
const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerSchema = z
	.object({
		fullName: z.string().min(2, "Full name must be at least 2 characters"),
		companyName: z.string().optional(),
		country: z.string().min(2, "Country is required"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
		acceptTerms: z.boolean().refine((value) => value, {
			message: "You must accept the terms",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export { loginSchema, registerSchema };
