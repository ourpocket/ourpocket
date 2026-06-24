import AuthLayout from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { register as registerAccount } from "@/lib/api";
import { registerSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
	const navigate = useNavigate();
	const form = useForm<RegisterFormValues>({
		defaultValues: {
			fullName: "",
			companyName: "",
			country: "Nigeria",
			email: "",
			password: "",
			confirmPassword: "",
			acceptTerms: false,
		},
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterFormValues) => {
		try {
			await registerAccount({
				name: data.fullName,
				email: data.email,
				password: data.password,
				companyName: data.companyName,
				country: data.country,
				provider: "local",
				acceptTerms: data.acceptTerms,
			});
			toast.success("Account created. Sign in to continue.");
			await navigate({ to: "/auth/login" });
		} catch (error) {
			const message = error instanceof Error ? error.message : "Could not create account";
			toast.error(message);
		}
	};

	return (
		<AuthLayout
			title="Let's get started"
			description="Create your account to start managing your finances effectively."
			isCentered
		>
			<div className="flex flex-col space-y-6 w-full max-w-md mx-auto">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="fullName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input type="text" placeholder="John Doe" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="companyName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Company Name</FormLabel>
									<FormControl>
										<Input type="text" placeholder="Acme Marketplace" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="country"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Country</FormLabel>
									<FormControl>
										<Input type="text" placeholder="Nigeria" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

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
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
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
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="acceptTerms"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center gap-3">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={(checked) => field.onChange(Boolean(checked))}
											/>
										</FormControl>
										<FormLabel className="text-sm text-muted-foreground">
											I agree to the terms and privacy policy
										</FormLabel>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? "Creating account..." : "Create account"}
						</Button>
					</form>
				</Form>

				<div className="text-center">
					<Link to="/auth/login" className="text-sm text-muted-foreground hover:text-primary">
						Already have an account? Sign in
					</Link>
				</div>
			</div>
		</AuthLayout>
	);
};

export default Register;
