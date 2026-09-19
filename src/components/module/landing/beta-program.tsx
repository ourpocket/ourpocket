import { Typography } from "@/components/ui/typography";
import { apiRequest } from "@/services/api-client";
import { ArrowRight, Check, MessageSquareText } from "lucide-react";
import { type FormEvent, useState } from "react";

type BetaUseCase = "payments" | "payouts" | "virtual_accounts" | "other";

const betaUseCases: ReadonlyArray<{ value: BetaUseCase; label: string }> = [
	{ value: "payments", label: "Payments and checkout" },
	{ value: "payouts", label: "Payouts" },
	{ value: "virtual_accounts", label: "Virtual accounts" },
	{ value: "other", label: "Another provider workflow" },
];

function isBetaUseCase(value: string): value is BetaUseCase {
	return betaUseCases.some((useCase) => useCase.value === value);
}

export function BetaProgram() {
	const [email, setEmail] = useState("");
	const [companyName, setCompanyName] = useState("");
	const [useCase, setUseCase] = useState<BetaUseCase>("payments");
	const [state, setState] = useState<"idle" | "submitting" | "received" | "error">("idle");
	const [error, setError] = useState("");

	const submit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setState("submitting");
		setError("");
		try {
			await apiRequest("/beta-applications", {
				method: "POST",
				auth: false,
				body: JSON.stringify({
					email,
					companyName: companyName || undefined,
					useCase,
				}),
			});
			setState("received");
		} catch (reason) {
			setState("error");
			setError(reason instanceof Error ? reason.message : "Could not submit your beta request.");
		}
	};

	return (
		<section id="beta" className="beta-program" aria-labelledby="beta-title">
			<div className="landing-shell beta-program-layout">
				<div>
					<Typography as="p" variant="label" className="beta-program-kicker">
						Private beta
					</Typography>
					<Typography as="h2" variant="display" id="beta-title" className="beta-program-title">
						Build alongside the team shaping the provider layer.
					</Typography>
				</div>
				<div className="beta-program-panel">
					{state === "received" ? (
						<div className="beta-program-confirmation" role="status">
							<Check aria-hidden="true" size={21} strokeWidth={1.75} />
							<Typography as="h3" variant="heading" className="beta-program-confirmation-title">
								Request received.
							</Typography>
							<Typography className="beta-program-copy">
								We’ll review your use case and contact you with the next beta step.
							</Typography>
						</div>
					) : (
						<>
							{/* <MessageSquareText aria-hidden="true" size={21} strokeWidth={1.75} /> */}
							<Typography className="beta-program-copy">
								Beta teams get a Sandbox workspace, guided provider onboarding, and a direct
								feedback channel.
							</Typography>
							<form className="beta-program-form" onSubmit={(event) => void submit(event)}>
								<label>
									<Typography as="span" variant="caption">
										Work email
									</Typography>
									<input
										type="email"
										value={email}
										onChange={(event) => setEmail(event.target.value)}
										autoComplete="email"
										required
									/>
								</label>
								<label>
									<Typography as="span" variant="caption">
										Company <span aria-hidden="true">(optional)</span>
									</Typography>
									<input
										type="text"
										value={companyName}
										onChange={(event) => setCompanyName(event.target.value)}
										autoComplete="organization"
										maxLength={160}
										className="beta-program-company !w-full"
									/>
								</label>
								<label>
									<Typography as="span" variant="caption">
										What are you building?
									</Typography>
									<select
										value={useCase}
										onChange={(event) => {
											if (isBetaUseCase(event.target.value)) setUseCase(event.target.value);
										}}
									>
										{betaUseCases.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</label>
								<button
									className="landing-button landing-button-primary"
									type="submit"
									disabled={state === "submitting"}
								>
									{state === "submitting" ? "Submitting…" : "Request beta access"}{" "}
									<ArrowRight size={17} />
								</button>
							</form>
							{state === "error" && (
								<Typography role="alert" variant="caption" className="beta-program-error">
									{error}
								</Typography>
							)}
							<Typography variant="caption" className="beta-program-note">
								Start with Sandbox. Connect a live provider only when your team is ready.
							</Typography>
						</>
					)}
				</div>
			</div>
		</section>
	);
}
