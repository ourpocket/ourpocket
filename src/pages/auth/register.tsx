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
import { useAuth } from "@/hooks/use-auth";
import { registerSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
	const navigate = useNavigate();
	const { register } = useAuth();

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
			await register({
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
			title="Create your account"
			description="Set up your workspace and start building with unified wallet infrastructure."
		>
			<div className="w-full">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="fullName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input type="text" placeholder="Your full name" {...field} />
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
										<Input type="text" placeholder="Your company" {...field} />
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
										<FormLabel className="text-sm font-normal text-zinc-400">
											I agree to the terms and privacy policy
										</FormLabel>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? "Creating account…" : "Create account"}
						</Button>
					</form>
				</Form>

				<div className="border-t border-[#2d2d2d] pt-5 text-center">
					<Link
						to="/auth/login"
						className="whitespace-nowrap text-sm text-zinc-500 transition-colors hover:text-white"
					>
						Already have an account? Sign in
					</Link>
				</div>
			</div>
		</AuthLayout>
	);
};

export default Register;
