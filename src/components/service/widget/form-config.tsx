import { useFormContext } from "react-hook-form";
import { Checkbox } from "~/components/ui/checkbox";
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
import type { ServiceCreateFormData } from "~/lib/schemas";
import { WIDGETS } from "~/lib/widgets";

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
							<Select
								onValueChange={(v) => {
									field.onChange(v);
									form.setValue("widget.config.url", form.getValues().url);
								}}
								value={field.value}
							>
								<SelectTrigger className="w-[180px] capitalize">
									<SelectValue placeholder="Select a widget" />
								</SelectTrigger>
								<SelectContent>
									{WIDGETS.options
										.sort((a, b) =>
											a.shape.type.value === "none"
												? -1
												: a.shape.type.value.localeCompare(b.shape.type.value),
										)
										.map((widget) => (
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
							// @ts-expect-error
							name={`widget.config.${key}`}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="capitalize">{key}</FormLabel>
									<FormControl>
										{schema.def.type === "boolean" ? (
											<div className="flex items-center gap-2">
												<Checkbox
													checked={field.value as boolean}
													onCheckedChange={field.onChange}
												/>
												<span>{(field.value as boolean) ? "Yes" : "No"}</span>
											</div>
										) : (
											<Input
												type={
													["apiKey", "apiSecret", "token", "password"].includes(
														key,
													)
														? "password"
														: "text"
												}
												{...field}
												value={field.value as string}
											/>
										)}
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
