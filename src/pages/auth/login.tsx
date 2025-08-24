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
import { loginSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import type * as z from "zod";

type LoginFormValues = z.infer<typeof loginSchema>;

interface FieldProps {
	field: {
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
		value: string;
		name: string;
	};
}

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
			console.log(data);
		} catch (error) {
			console.error(error);
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

						<Button type="submit" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? "Signing in..." : "Sign In"}
						</Button>
					</form>
				</Form>
			</div>
		</AuthLayout>
	);
};

export default Login;
