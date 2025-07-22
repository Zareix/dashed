import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ServiceIcon } from "~/components/ServiceIcon";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { WIDGETS } from "~/lib/widgets";
import type { Category } from "~/server/db/schema";
import { api } from "~/utils/api";

const serviceCreateSchema = z.object({
	name: z.string().min(1),
	url: z.url(),
	alternativeUrls: z
		.array(
			z.object({
				url: z.url(),
				name: z.string().min(1),
			}),
		)
		.optional(),
	categoryName: z.string(),
	icon: z.string().min(1),
	openInNewTab: z.boolean(),
	widget: WIDGETS,
});

export type ServiceCreateFormData = z.infer<typeof serviceCreateSchema>;

const CreateServiceButton = ({
	categories,
	category,
}: {
	categories: Array<Pick<Category, "name">>;
	category?: Pick<Category, "name">;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const utils = api.useUtils();
	const createServiceMutation = api.service.create.useMutation({
		onSuccess: async () => {
			toast.success("Service created");
			setIsOpen(false);
			form.reset();
			await utils.category.getAll.invalidate();
		},
		onError: () => {
			toast.error("An error occurred while creating service");
		},
	});
	const form = useForm({
		resolver: zodResolver(serviceCreateSchema),
		defaultValues: {
			name: "",
			url: "",
			alternativeUrls: [],
			icon: "",
			categoryName: category?.name,
			openInNewTab: false,
			widget: {
				type: "none",
				config: {},
			},
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "alternativeUrls",
	});

	function onSubmit(values: ServiceCreateFormData) {
		createServiceMutation.mutate(values);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>
					<PlusIcon />
					Add service
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a new service</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
						<FormField
							control={form.control}
							name="categoryName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<FormControl>
										<Select
											onValueChange={(value) => {
												field.onChange(Number.parseInt(value));
											}}
											value={field.value?.toString()}
										>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
											<SelectContent>
												{categories.map((cat) => (
													<SelectItem value={cat.name} key={cat.name}>
														{cat.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
											{field.value && (
												<ServiceIcon
													service={{ name: "New Service", icon: field.value }}
												/>
											)}
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
							disabled={createServiceMutation.isPending}
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

export default CreateServiceButton;
