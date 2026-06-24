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
			description="Enter the verification token sent to your email."
			isCentered
		>
			<form onSubmit={handleVerify} className="space-y-4">
				<Input
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					type="email"
					placeholder="name@example.com"
					required
				/>
				<Input
					value={token}
					onChange={(event) => setToken(event.target.value)}
					placeholder="Verification token"
					required
				/>
				<Button type="submit" className="w-full">
					Verify Email
				</Button>
				<Button type="button" className="w-full bg-gray-700/20" onClick={handleRequest}>
					Resend Verification Email
				</Button>
				<div className="text-center">
					<Link to="/auth/login" className="text-sm text-muted-foreground hover:text-primary">
						Back to login
					</Link>
				</div>
			</form>
		</AuthLayout>
	);
};

export default VerifyEmail;
