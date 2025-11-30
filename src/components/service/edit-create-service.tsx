import { actions } from "astro:actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PlusIcon, Trash2 } from "lucide-react";
import {
	Controller,
	FormProvider,
	useFieldArray,
	useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { WidgetFormConfig } from "~/components/service/widget/form-config";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import type { Category, Service } from "~/lib/db/schema";
import { type ServiceCreateFormData, serviceCreateSchema } from "~/lib/schema";
import { queryClient } from "~/lib/store";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";

type Props = {
	category?: Pick<Category, "id">;
	service?: Pick<
		Service,
		| "id"
		| "name"
		| "url"
		| "pingUrl"
		| "alternativeUrls"
		| "categoryId"
		| "icon"
		| "iconDark"
		| "openInNewTab"
		| "widget"
	>;
	onFinish?: () => void;
};

export const EditCreateServiceForm: React.FC<Props> = ({
	category,
	service,
	onFinish,
}) => {
	const categoriesQuery = useQuery(
		{
			queryKey: ["categories"],
			queryFn: actions.category.getAll,
			select: (res) => {
				if (res.error) {
					throw new Error(res.error.message);
				}
				return res.data;
			},
		},
		queryClient,
	);
	const createServiceMutation = useMutation(
		{
			mutationFn: actions.service.create,
			onSuccess: async (res) => {
				if (res.error) {
					throw new Error(res.error.message);
				}
				toast.success(`Service ${res.data.name} created`);
				onFinish?.();
				form.reset();
				queryClient.invalidateQueries({
					queryKey: ["categories", "with-services"],
				});
			},
			onError: () => {
				toast.error("An error occurred while creating service");
			},
		},
		queryClient,
	);
	const editServiceMutation = useMutation(
		{
			mutationFn: actions.service.edit,
			onSuccess: async (res) => {
				if (res.error) {
					throw new Error(res.error.message);
				}
				toast.success(`Service ${res.data.name} edited`);
				onFinish?.();
				form.reset();
				queryClient.invalidateQueries({
					queryKey: ["categories", "with-services"],
				});
			},
			onError: () => {
				toast.error("An error occurred while editing service");
			},
		},
		queryClient,
	);
	const form = useForm({
		resolver: zodResolver(serviceCreateSchema),
		defaultValues: {
			name: service?.name ?? "",
			url: service?.url ?? "https://",
			pingUrl: service?.pingUrl ?? "",
			alternativeUrls: service?.alternativeUrls ?? [],
			icon: service?.icon ?? "",
			categoryId: service?.categoryId ?? category?.id,
			openInNewTab: service?.openInNewTab ?? false,
			widget: service?.widget ?? {
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
		if (service) {
			editServiceMutation.mutate({
				...values,
				id: service.id,
			});
		} else {
			createServiceMutation.mutate(values);
		}
	}
	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
			<FieldGroup>
				<Controller
					control={form.control}
					name="categoryId"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Category</FieldLabel>
							<Select
								onValueChange={(value) => {
									field.onChange(Number(value));
								}}
								value={field.value ? String(field.value) : undefined}
							>
								<SelectTrigger
									id={field.name}
									aria-invalid={fieldState.invalid}
									className="w-[180px]"
									disabled={field.disabled || categoriesQuery.isLoading}
								>
									<SelectValue placeholder="Select a category" />
								</SelectTrigger>
								<SelectContent>
									{(categoriesQuery.data ?? []).map((cat) => (
										<SelectItem value={String(cat.id)} key={cat.name}>
											{cat.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Controller
					control={form.control}
					name="name"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Name</FieldLabel>
							<Input
								{...field}
								id={field.name}
								placeholder="Service name"
								aria-invalid={fieldState.invalid}
								onBlur={(e) => {
									if (!form.getValues().icon) {
										const icon = e.target.value
											.replaceAll(" ", "-")
											.toLowerCase();
										if (icon === "") return;
										form.setValue(
											"icon",
											`https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/${icon}.png`,
										);
									}
								}}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Controller
					control={form.control}
					name="icon"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Icon</FieldLabel>
							<div className="flex items-center gap-2">
								{field.value && (
									<img
										src={field.value}
										alt="Service icon"
										className="h-6 w-6"
									/>
								)}
								<Input
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									placeholder="Service icon"
								/>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Controller
					control={form.control}
					name="iconDark"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Icon Dark</FieldLabel>
							<div className="flex items-center gap-2">
								{field.value && (
									<img
										src={field.value}
										alt="Service dark icon"
										className="h-6 w-6"
									/>
								)}
								<Input
									{...field}
									id={field.name}
									placeholder="Service dark icon"
									value={field.value ?? undefined}
									aria-invalid={fieldState.invalid}
								/>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Controller
					control={form.control}
					name="url"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>URL</FieldLabel>
							<Input
								{...field}
								placeholder="Service url"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Controller
					control={form.control}
					name="pingUrl"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Ping URL (optional)</FieldLabel>
							<Input
								{...field}
								placeholder="Custom ping URL"
								aria-invalid={fieldState.invalid}
								value={field.value ?? ""}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<FieldLabel>Alternative URLs</FieldLabel>
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
							<Controller
								control={form.control}
								name={`alternativeUrls.${index}.name`}
								render={({ field: nameField, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Name</FieldLabel>
										<Input
											{...nameField}
											placeholder="Alternative URL name"
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name={`alternativeUrls.${index}.url`}
								render={({ field: urlField, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>URL</FieldLabel>
										<div className="flex items-center gap-2">
											<Input
												{...urlField}
												placeholder="Alternative URL"
												aria-invalid={fieldState.invalid}
											/>
											<Button
												type="button"
												variant="destructive"
												size="sm"
												onClick={() => remove(index)}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>
					))}
				</div>

				<Controller
					control={form.control}
					name="openInNewTab"
					render={({ field, fieldState }) => (
						<Field
							orientation="horizontal"
							data-invalid={fieldState.invalid}
							className="flex items-start space-x-3 space-y-0 rounded-md border p-3"
						>
							<Checkbox
								name={field.name}
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
							<div className="space-y-1 leading-none">
								<FieldLabel htmlFor={field.name}>Open in new tab</FieldLabel>
							</div>
						</Field>
					)}
				/>

				<FormProvider {...form}>
					<WidgetFormConfig />
				</FormProvider>

				<Button
					type="submit"
					disabled={
						createServiceMutation.isPending || editServiceMutation?.isPending
					}
					className="ml-auto"
				>
					Submit
				</Button>
			</FieldGroup>
		</form>
	);
};
