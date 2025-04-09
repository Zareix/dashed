import { useFormContext } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { WIDGETS } from "~/lib/widgets";
import type { ServiceCreateFormData } from "../create";

const WidgetFormConfig = () => {
	const form = useFormContext<ServiceCreateFormData>();

	const selectedWidget = WIDGETS.options.find(
		(widget) => widget.shape.type.value === form.watch("widget.type"),
	);

	return (
		<div className="grid gap-1 border-t pt-2">
			<FormField
				control={form.control}
				name="widget.type"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Widget</FormLabel>
						<FormControl>
							<Select onValueChange={field.onChange} value={field.value}>
								<SelectTrigger className="w-[180px] capitalize">
									<SelectValue placeholder="Select a widget" />
								</SelectTrigger>
								<SelectContent>
									{WIDGETS.options.map((widget) => (
										<SelectItem
											value={widget.shape.type.value}
											key={widget.shape.type.value}
											className="capitalize"
										>
											{widget.shape.type.value}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			{!!selectedWidget &&
				Object.entries(selectedWidget.shape.config.shape).map(
					([key, schema]) => (
						<FormField
							key={key}
							control={form.control}
							rules={{
								required: true,
								validate: (value) => {
									const res = schema.safeParse(value);
									console.log(res);

									if (res.success) {
										return true;
									}
									return "Invalid value";
								},
							}}
							// @ts-ignore
							name={`widget.config.${key}`}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="capitalize">{key}</FormLabel>
									<FormControl>
										{/* @ts-ignore */}
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					),
				)}
		</div>
	);
};

export default WidgetFormConfig;
