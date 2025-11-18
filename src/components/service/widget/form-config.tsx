import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "~/components/ui/checkbox";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import type { ServiceCreateFormData } from "~/lib/schema";
import { WIDGETS } from "~/lib/widgets";

export const WidgetFormConfig = () => {
	const form = useFormContext<ServiceCreateFormData>();

	const selectedWidget = WIDGETS.options.find(
		(widget) => widget.shape.type.value === form.watch("widget.type"),
	);

	return (
		<FieldGroup className="grid gap-1 border-t pt-6">
			<Controller
				control={form.control}
				name="widget.type"
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<FieldLabel>Widget</FieldLabel>
						<Select
							onValueChange={(v) => {
								field.onChange(v);
								form.setValue("widget.config.url", form.getValues().url);
							}}
							value={field.value}
						>
							<SelectTrigger
								className="w-[180px] capitalize"
								data-invalid={fieldState.invalid}
							>
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
						{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
					</Field>
				)}
			/>
			{!!selectedWidget &&
				Object.entries(selectedWidget.shape.config.shape).map(
					([key, schema]) => (
						<Controller
							key={key}
							control={form.control}
							rules={{
								required: true,
								validate: (value) => {
									const res = schema.safeParse(value);
									if (res.success) {
										return true;
									}
									return "Invalid value";
								},
							}}
							// @ts-expect-error Key can't be narrowed here
							name={`widget.config.${key}`}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name} className="capitalize">
										{key}
									</FieldLabel>
									{schema._def.typeName === "ZodBoolean" ? (
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
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					),
				)}
		</FieldGroup>
	);
};
