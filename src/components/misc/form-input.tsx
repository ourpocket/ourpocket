import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	label: string;
	type?: string;
	placeholder?: string;
	className?: string;
}

export function FormInput<T extends FieldValues>({
	control,
	name,
	label,
	type = "text",
	placeholder,
	className = "bg-[#1C1C1C] border-[#2D2D2D] text-white h-11",
}: FormInputProps<T>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="space-y-1.5">
					<FormLabel className="text-sm font-medium text-gray-200">{label}</FormLabel>
					<FormControl>
						<Input type={type} placeholder={placeholder} className={className} {...field} />
					</FormControl>
					<FormMessage className="text-[13px]" />
				</FormItem>
			)}
		/>
	);
}
