import { Button } from "@/components/ui/button.tsx";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select.tsx";
import { type ProjectApiKey, ProjectApiKeyScope, createProjectApiKey } from "@/lib/api";
import { createApiKey } from "@/schemas/misc.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type GenerateApiKeyFormValues = z.infer<typeof createApiKey>;

interface GenerateApiKeyModalProps {
	projectId: string;
	onGenerated: (apiKey: ProjectApiKey) => void;
}

const GenerateApiKeyModal = ({ projectId, onGenerated }: GenerateApiKeyModalProps) => {
	const form = useForm<GenerateApiKeyFormValues>({
		defaultValues: {
			name: "",
			mode: ProjectApiKeyScope.TEST,
		},
		resolver: zodResolver(createApiKey),
	});

	const onSubmit = async (data: GenerateApiKeyFormValues) => {
		try {
			const apiKey = await createProjectApiKey(projectId, {
				scope: data.mode as ProjectApiKeyScope,
				description: data.name,
			});
			onGenerated(apiKey);
			form.reset({
				name: "",
				mode: ProjectApiKeyScope.TEST,
			});
			toast.success("API key generated");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Could not generate API key";
			toast.error(message);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="mode"
					render={({ field }) => (
						<FormItem className={"w-full "}>
							<FormLabel>Mode</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select mode" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="test">Test</SelectItem>
									<SelectItem value="live">Live</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className={"w-full"} disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting ? "Generating..." : "Generate Key"}
				</Button>
			</form>
		</Form>
	);
};

export { GenerateApiKeyModal };
