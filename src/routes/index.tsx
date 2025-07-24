import { createFileRoute } from "@tanstack/react-router";
import Homepage from "@/pages/homepage.tsx";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return <Homepage />;
}
