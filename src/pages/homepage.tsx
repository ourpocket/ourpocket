import { DeveloperCta } from "@/components/module/landing/developer-cta";
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
		<WorkflowSection />
		<DeveloperCta />
	</main>
);

export default Homepage;
