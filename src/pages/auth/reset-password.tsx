import AuthLayout from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const resetPasswordSchema = z
	.object({
		email: z.string().email("Invalid email address"),
		token: z.string().min(1, "Reset token is required"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
	const navigate = useNavigate();
	const { resetPassword } = useAuth();
	const form = useForm<ResetPasswordFormValues>({
		defaultValues: {
			email: "",
			token: "",
			password: "",
			confirmPassword: "",
		},
		resolver: zodResolver(resetPasswordSchema),
	});

	const onSubmit = async (data: ResetPasswordFormValues) => {
		try {
			await resetPassword({
				email: data.email,
				token: data.token,
				newPassword: data.password,
			});
			toast.success("Password reset. Sign in with your new password.");
			await navigate({ to: "/auth/login" });
		} catch (error) {
			const message = error instanceof Error ? error.message : "Could not reset password";
			toast.error(message);
		}
	};

	return (
		<AuthLayout>
			<div className="flex flex-col space-y-6 w-full max-w-md mx-auto">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
					<p className="text-sm text-muted-foreground">Enter your new password below</p>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input type="email" placeholder="name@example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="token"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Reset Token</FormLabel>
									<FormControl>
										<Input type="text" placeholder="Paste your reset token" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm New Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? "Resetting password..." : "Reset password"}
						</Button>
						<div className="text-center">
							<Link to="/auth/login" className="text-sm text-muted-foreground hover:text-primary">
								Back to login
							</Link>
						</div>
					</form>
				</Form>
			</div>
		</AuthLayout>
	);
};

export default ResetPassword;
