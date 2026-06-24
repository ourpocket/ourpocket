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
import { ensureDefaultProject, login } from "@/lib/api";
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
			await ensureDefaultProject();
			toast.success("Signed in successfully");
			await navigate({ to: "/dashboard" });
		} catch (error) {
			const message = error instanceof Error ? error.message : "Could not sign in";
			toast.error(message);
		}
	};

	return (
		<AuthLayout
			title="Log in to your account"
			description="Welcome back! Please enter your details to access your account."
			isCentered
		>
			<div className="flex flex-col w-full space-y-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="space-y-1.5">
									<FormLabel className="text-sm font-medium text-gray-200">Email Address</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="e.g@example@gmail.com"
											className="bg-[#1C1C1C] border-[#2D2D2D] text-white h-11"
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-[13px]" />
								</FormItem>
							)}
						/>

						<div className="space-y-2">
							<FormLabel className="text-sm font-medium text-gray-200">Password</FormLabel>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												type="password"
												placeholder="Password (Min. Of 8 Characters)"
												className="bg-[#1C1C1C] border-[#2D2D2D] text-white h-11"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-[13px]" />
									</FormItem>
								)}
							/>
						</div>

						<Button type="submit" className={"w-full"} disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? "Signing in..." : "Sign In"}
						</Button>
						<div className="flex justify-center gap-3 text-sm">
							<Link to="/auth/forgot-password" className="text-muted-foreground hover:text-primary">
								Forgot password?
							</Link>
							<Link to="/auth/register" className="text-muted-foreground hover:text-primary">
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
