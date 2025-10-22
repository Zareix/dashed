"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImportIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4-mini";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";

const importSchema = z.object({
	type: z.enum(["dashed", "homepage"]),
	eraseExisting: z.boolean(),
	data: z.string().check(z.minLength(1, "Data is required")),
});

const ImportButton = () => {
	const [isOpen, setIsOpen] = useState(false);
	const utils = api.useUtils();
	const importMutation = api.category.import.useMutation({
		onSuccess: async () => {
			toast.success("Service created");
			setIsOpen(false);
			form.reset();
			await utils.category.getAllWithServices.invalidate();
		},
		onError: () => {
			toast.error("An error occurred while creating service");
		},
	});
	const form = useForm<z.infer<typeof importSchema>>({
		resolver: zodResolver(importSchema),
		defaultValues: {
			type: "dashed",
			eraseExisting: false,
			data: "",
		},
	});

	function onSubmit(values: z.infer<typeof importSchema>) {
		importMutation.mutate(values);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>
					<ImportIcon /> Import
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Import</DialogTitle>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<div className="flex gap-4">
							<Controller
								control={form.control}
								name="type"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Type</FieldLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger
												className="w-[180px]"
												id={field.name}
												aria-invalid={fieldState.invalid}
											>
												<SelectValue placeholder="Type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="dashed">Dashed</SelectItem>
												<SelectItem value="homepage">Homepage</SelectItem>
											</SelectContent>
										</Select>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="eraseExisting"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Erase existing</FieldLabel>
										<div className="flex items-center gap-2 mt-1">
											<Checkbox
												id={field.name}
												aria-invalid={fieldState.invalid}
												checked={field.value}
												onCheckedChange={field.onChange}
												className="w-3.5!"
											/>
											<span>{field.value ? "Yes" : "No"}</span>
										</div>
									</Field>
								)}
							/>
						</div>
						<Controller
							control={form.control}
							name="data"
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Data</FieldLabel>
									<Textarea
										{...field}
										id={field.name}
										placeholder="data"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Button
							type="submit"
							disabled={importMutation.isPending}
							className="ml-auto"
						>
							Submit
						</Button>
					</FieldGroup>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ImportButton;
