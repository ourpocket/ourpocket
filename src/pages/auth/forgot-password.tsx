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
import { requestPasswordReset } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
	const form = useForm<ForgotPasswordFormValues>({
		defaultValues: {
			email: "",
		},
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onSubmit = async (data: ForgotPasswordFormValues) => {
		try {
			await requestPasswordReset(data.email);
			toast.success("Password reset link sent if the account exists.");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Could not send reset link";
			toast.error(message);
		}
	};

	return (
		<AuthLayout>
			<div className="flex flex-col space-y-6 w-full max-w-md mx-auto">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
					<p className="text-sm text-muted-foreground">
						Enter your email address and we'll send you a link to reset your password
					</p>
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

						<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? "Sending reset link..." : "Send reset link"}
						</Button>
					</form>
				</Form>

				<div className="text-center">
					<Link to="/auth/login" className="text-sm text-muted-foreground hover:text-primary">
						Back to login
					</Link>
				</div>
			</div>
		</AuthLayout>
	);
};

export default ForgotPassword;
