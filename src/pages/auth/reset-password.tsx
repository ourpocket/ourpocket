import AuthLayout from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface FieldProps {
	field: {
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
		value: string;
		name: string;
	};
}

const resetPasswordSchema = z
	.object({
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
	const form = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
	});

	const onSubmit = async (data: ResetPasswordFormValues) => {
		try {
			console.log(data);
		} catch (error) {
			console.error(error);
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
