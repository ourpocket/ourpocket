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
import { setAuthToken } from "@/lib/session";
import { loginSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
	const navigate = useNavigate();
	const { login } = useAuth();

	const form = useForm<LoginFormValues>({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormValues) => {
		try {
			const response = await login(data);
			setAuthToken(response.token);
			toast.success("Signed in successfully");
			await navigate({ to: "/dashboard" });
		} catch (error) {
			const message = error instanceof Error ? error.message : "Could not sign in";
			toast.error(message);
		}
	};

	return (
		<AuthLayout
			title="Sign in to OurPocket"
			description="Access your projects, wallet providers, and transaction infrastructure."
		>
			<div className="w-full">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="space-y-1.5">
									<FormLabel>Email address</FormLabel>
									<FormControl>
										<Input type="email" placeholder="name@company.com" {...field} />
									</FormControl>
									<FormMessage className="text-[13px]" />
								</FormItem>
							)}
						/>

						<div className="space-y-2">
							<FormLabel>Password</FormLabel>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input type="password" placeholder="Enter your password" {...field} />
										</FormControl>
										<FormMessage className="text-[13px]" />
									</FormItem>
								)}
							/>
						</div>

						<Button type="submit" className={"w-full"} disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? "Signing in…" : "Sign in"}
						</Button>
						<div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-[#2d2d2d] pt-5 text-sm">
							<Link
								to="/auth/forgot-password"
								className="whitespace-nowrap text-zinc-500 transition-colors hover:text-white"
							>
								Forgot password?
							</Link>
							<Link
								to="/auth/verify-email"
								className="whitespace-nowrap text-zinc-500 transition-colors hover:text-white"
							>
								Verify email
							</Link>
							<Link
								to="/auth/register"
								className="whitespace-nowrap text-zinc-500 transition-colors hover:text-white"
							>
								Create an account
							</Link>
						</div>
					</form>
				</Form>
			</div>
		</AuthLayout>
	);
};

export default Login;
