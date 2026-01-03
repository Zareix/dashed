import { actions } from "astro:actions";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { GripVertical } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { DeleteServiceButton } from "~/components/service/delete";
import { EditServiceButton } from "~/components/service/edit";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { TableCell, TableRow } from "~/components/ui/table";
import type { Service } from "~/lib/db/schema";
import { serviceEditSchema } from "~/lib/schema";
import { queryClient } from "~/lib/store";
import { cn } from "~/lib/utils";

export function SortableServiceRow({
	service,
	loading = false,
}: {
	service?: Pick<
		Service,
		| "id"
		| "name"
		| "url"
		| "pingUrl"
		| "alternativeUrls"
		| "icon"
		| "iconDark"
		| "categoryId"
		| "openInNewTab"
		| "widget"
	>;
	loading?: boolean;
}) {
	const editServiceMutation = useMutation(
		{
			mutationFn: actions.service.edit,
			onSuccess: async (res) => {
				if (res.error) {
					throw new Error(res.error.message);
				}
				toast.success(`Service '${res.data.name}' edited`);
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
		resolver: zodResolver(serviceEditSchema),
		defaultValues: service,
	});
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: service?.id ?? "" });

	const editSubmit = form.handleSubmit((data) => {
		editServiceMutation.mutate(data);
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: only watching service
	useEffect(() => {
		form.reset(service);
	}, [service]);

	if (!service) {
		return null;
	}

	return (
		<TableRow
			ref={setNodeRef}
			style={
				loading
					? {}
					: {
							transform: CSS.Transform.toString(transform),
							transition,
						}
			}
			{...attributes}
			className={cn(loading && "opacity-50", "cursor-default")}
		>
			<TableCell>
				<span className="cursor-move" {...listeners}>
					<GripVertical className="h-5 w-5 text-gray-500" />
				</span>
			</TableCell>
			<TableCell>
				<img
					src={service.icon}
					alt={service.name}
					className="h-6 w-6 object-contain"
				/>
			</TableCell>
			<TableCell>
				<Input
					placeholder="Service name"
					{...form.register("name", { required: true })}
					onBlur={() => {
						editSubmit();
					}}
					className="min-w-32"
				/>
			</TableCell>
			<TableCell>
				<Input
					placeholder="Service url"
					{...form.register("url", { required: true })}
					onBlur={() => {
						editSubmit();
					}}
					className="min-w-32"
				/>
			</TableCell>
			<TableCell>
				<div className="flex items-center gap-2">
					<Checkbox
						checked={form.watch("openInNewTab")}
						onCheckedChange={(checked) => {
							form.setValue("openInNewTab", Boolean(checked));
							setTimeout(() => {
								editSubmit();
							}, 100);
						}}
					/>
					<div>{form.watch("openInNewTab") ? "Yes" : "No"}</div>
				</div>
			</TableCell>
			<TableCell className="capitalize">{service.widget.type}</TableCell>
			<TableCell>
				<EditServiceButton disabled={loading} service={service} />
				<DeleteServiceButton service={service} />
			</TableCell>
		</TableRow>
	);
}
