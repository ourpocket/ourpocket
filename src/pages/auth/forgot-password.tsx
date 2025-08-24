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

const forgotPasswordSchema = z.object({
	email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface FieldProps {
	field: {
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
		value: string;
		name: string;
	};
}

const ForgotPassword = () => {
	const navigate = useNavigate();
	const form = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onSubmit = async (data: ForgotPasswordFormValues) => {
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
