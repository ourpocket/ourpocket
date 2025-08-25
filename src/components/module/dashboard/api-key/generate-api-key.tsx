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
import { createApiKey } from "@/schemas/misc.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const GenerateApiKeyModal = () => {
	const form = useForm({
		defaultValues: {
			name: "",
			mode: "",
		},
		resolver: zodResolver(createApiKey),
	});

	const onSubmit = (data: any) => {
		console.log("Generated API Key:", data);
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

				<Button type="submit" className={"w-full"}>
					Generate Key 🔑
				</Button>
			</form>
		</Form>
	);
};

export { GenerateApiKeyModal };
