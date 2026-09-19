import { BetaProgram } from "@/components/module/landing/beta-program";
import { DeveloperCta } from "@/components/module/landing/developer-cta";
import { DeveloperReasons } from "@/components/module/landing/developer-reasons";
import { InfrastructureGrid } from "@/components/module/landing/infrastructure-grid";
import { LandingHeader } from "@/components/module/landing/landing-header";
import { LandingHero } from "@/components/module/landing/landing-hero";
import { ProviderMarquee } from "@/components/module/landing/provider-marquee";
import { WorkflowSection } from "@/components/module/landing/workflow-section";
import "../../tokens.css";
import "@/components/module/landing/landing.css";

const Homepage = () => (
	<main className="landing-page">
		<LandingHeader />
		<div className="landing-load-sequence">
			<LandingHero />
			<ProviderMarquee />
		</div>
		<InfrastructureGrid />
		<DeveloperReasons />
		<WorkflowSection />
		<BetaProgram />
		<DeveloperCta />
	</main>
);

export default Homepage;
