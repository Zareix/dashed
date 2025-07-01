import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, PlusIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import WidgetFormConfig from "~/components/service/widget/form-config";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { isAuthorizedDomain } from "~/lib/utils";
import { WIDGETS } from "~/lib/widgets";
import type { Service } from "~/server/db/schema";
import { api } from "~/utils/api";

const serviceEditSchema = z.object({
	id: z.number(),
	name: z.string().min(1),
	url: z.string().min(1).url(),
	alternativeUrls: z
		.array(
			z.object({
				url: z.string().url(),
				name: z.string().min(1),
			}),
		)
		.optional()
		.default([]),
	categoryName: z.string(),
	icon: z.string().min(1),
	openInNewTab: z.boolean(),
	widget: WIDGETS,
});

export type ServiceEditFormData = z.infer<typeof serviceEditSchema>;

const EditServiceButton = ({
	service,
	disabled = false,
}: {
	service: Pick<
		Service,
		| "id"
		| "name"
		| "url"
		| "alternativeUrls"
		| "categoryName"
		| "icon"
		| "openInNewTab"
		| "widget"
	>;
	disabled: boolean;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const utils = api.useUtils();
	const editServiceMutation = (
		service ? api.service.edit : api.service.edit
	).useMutation({
		onSuccess: async () => {
			toast.success("Service edited");
			setIsOpen(false);
			await utils.category.getAll.invalidate();
		},
		onError: () => {
			toast.error("An error occurred while editing service");
		},
	});
	const form = useForm({
		resolver: zodResolver(serviceEditSchema),
		defaultValues: service,
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "alternativeUrls",
	});

	function onSubmit(values: ServiceEditFormData) {
		editServiceMutation.mutate(values);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button disabled={disabled} variant="ghost">
					<PencilIcon />
				</Button>
			</DialogTrigger>
			<DialogContent className="overflow-y-auto max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Edit service</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Service name"
											{...field}
											onBlur={(e) => {
												if (!form.getValues().icon) {
													const icon = e.target.value
														.replaceAll(" ", "-")
														.toLowerCase();
													form.setValue(
														"icon",
														`https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/${icon}.png`,
													);
												}
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="icon"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Icon</FormLabel>
									<FormControl>
										<div className="flex items-center gap-2">
											{field.value &&
												(isAuthorizedDomain(field.value) ? (
													<Image
														src={field.value}
														alt="service icon"
														width={32}
														height={32}
														className="h-8 w-8 object-contain"
													/>
												) : (
													<img
														src={field.value}
														alt="service icon"
														width={32}
														height={32}
														className="h-8 w-8 object-contain"
													/>
												))}
											<Input placeholder="Service icon" {...field} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem>
									<FormLabel>URL</FormLabel>
									<FormControl>
										<Input placeholder="Service url" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<FormLabel>Alternative URLs</FormLabel>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => append({ url: "", name: "" })}
								>
									<PlusIcon className="h-4 w-4 mr-1" />
									Add Alternative URL
								</Button>
							</div>
							{fields.map((field, index) => (
								<div
									key={field.id}
									className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 border rounded-md"
								>
									<FormField
										control={form.control}
										name={`alternativeUrls.${index}.name`}
										render={({ field: nameField }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input
														placeholder="Alternative name"
														{...nameField}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name={`alternativeUrls.${index}.url`}
										render={({ field: urlField }) => (
											<FormItem>
												<FormLabel>URL</FormLabel>
												<FormControl>
													<div className="flex items-center gap-2">
														<Input
															placeholder="Alternative URL"
															{...urlField}
														/>
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => remove(index)}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							))}
						</div>
						<FormField
							control={form.control}
							name="openInNewTab"
							render={({ field }) => (
								<FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-3">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>Open in new tab</FormLabel>
									</div>
								</FormItem>
							)}
						/>
						<WidgetFormConfig />
						<Button
							type="submit"
							disabled={editServiceMutation.isPending}
							className="ml-auto"
						>
							Submit
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default EditServiceButton;
