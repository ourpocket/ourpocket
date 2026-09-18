import AuthLayout from "@/components/layouts/auth-layout";

const WelcomeAlert = () => {
	return (
		<AuthLayout
			icon={<img width={28} height={28} alt="" src="/img/envelope.svg" />}
			title="You’ve got mail!"
			isCentered
			description={`
                Please, enter the 6 digit verification code sent to dominic@gmail.com continue.
            `}
		>
			<div></div>
		</AuthLayout>
	);
};

export default WelcomeAlert;
