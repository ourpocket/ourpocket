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
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
	const { requestPasswordReset } = useAuth();

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
		<AuthLayout
			title="Recover your account"
			description="Enter your email address and we’ll send password reset instructions."
		>
			<div className="w-full">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input type="email" placeholder="name@company.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? "Sending instructions…" : "Send reset instructions"}
						</Button>
					</form>
				</Form>

				<div className="border-t border-[#2d2d2d] pt-5 text-center">
					<Link
						to="/auth/login"
						className="whitespace-nowrap text-sm text-zinc-500 transition-colors hover:text-white"
					>
						Back to login
					</Link>
				</div>
			</div>
		</AuthLayout>
	);
};

export default ForgotPassword;
