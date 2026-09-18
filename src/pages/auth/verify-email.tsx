import AuthLayout from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

const VerifyEmail = () => {
	const navigate = useNavigate();
	const { requestVerificationEmail, verifyEmail } = useAuth();
	const [email, setEmail] = useState("");
	const [token, setToken] = useState("");

	const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await verifyEmail({ email, token });
		toast.success("Email verified");
		await navigate({ to: "/auth/login" });
	};

	const handleRequest = async () => {
		if (!email) {
			toast.error("Email is required");

			return;
		}

		await requestVerificationEmail(email);
		toast.success("Verification email sent");
	};

	return (
		<AuthLayout
			title="Verify your email"
			description="Enter your email address and the verification token we sent you."
		>
			<form onSubmit={handleVerify}>
				<Input
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					type="email"
					placeholder="name@company.com"
					required
				/>
				<Input
					value={token}
					onChange={(event) => setToken(event.target.value)}
					placeholder="Verification token"
					required
				/>
				<Button type="submit" className="w-full">
					Verify email
				</Button>
				<Button
					type="button"
					variant="outline"
					className="h-12 w-full border-[#343434] bg-transparent text-zinc-300 shadow-none hover:bg-[#1c1c1c] hover:text-white"
					onClick={handleRequest}
				>
					Resend verification email
				</Button>
				<div className="border-t border-[#2d2d2d] pt-5 text-center">
					<Link
						to="/auth/login"
						className="whitespace-nowrap text-sm text-zinc-500 transition-colors hover:text-white"
					>
						Back to login
					</Link>
				</div>
			</form>
		</AuthLayout>
	);
};

export default VerifyEmail;
