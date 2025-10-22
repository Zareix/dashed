import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripVertical } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ServiceIcon } from "~/components/ServiceIcon";
import DeleteServiceButton from "~/components/service/delete";
import EditServiceButton from "~/components/service/edit";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { TableCell, TableRow } from "~/components/ui/table";
import { serviceEditSchema } from "~/lib/schemas";
import { cn } from "~/lib/utils";
import type { Service } from "~/server/db/schema";
import { api } from "~/trpc/react";

function SortableServiceRow({
	service,
	loading = false,
}: {
	service?: Pick<
		Service,
		| "id"
		| "name"
		| "url"
		| "alternativeUrls"
		| "icon"
		| "iconDark"
		| "categoryName"
		| "openInNewTab"
		| "widget"
	>;
	loading?: boolean;
}) {
	const utils = api.useUtils();
	const editServiceMutation = api.service.edit.useMutation({
		onSuccess: async (data) => {
			toast.success(`Service '${data?.name}' edited`);
			await utils.category.getAllWithServices.invalidate();
		},
		onError: () => {
			toast.error("An error occurred while editing service");
		},
	});
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
				<ServiceIcon
					service={{
						name: service.name,
						icon: service.icon,
						iconDark: service.iconDark,
					}}
					className="h-8 w-8 object-contain"
				/>
			</TableCell>
			<TableCell>
				<Input
					placeholder="Service name"
					{...form.register("name", { required: true })}
					onBlur={() => {
						editSubmit();
					}}
				/>
			</TableCell>
			<TableCell>
				<Input
					placeholder="Service url"
					{...form.register("url", { required: true })}
					onBlur={() => {
						editSubmit();
					}}
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

export default SortableServiceRow;
