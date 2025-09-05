import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { ServiceIcon } from "~/components/ServiceIcon";
import DeleteServiceButton from "~/components/service/delete";
import EditServiceButton from "~/components/service/edit";
import { TableCell, TableRow } from "~/components/ui/table";
import { cn } from "~/lib/utils";
import type { Service } from "~/server/db/schema";

function SortableServiceRow({
	item,
	loading = false,
}: {
	item?: Pick<
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
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: item?.id ?? "" });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	if (!item) {
		return null;
	}

	return (
		<TableRow
			ref={setNodeRef}
			style={loading ? {} : style}
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
						name: item.name,
						icon: item.icon,
						iconDark: item.iconDark,
					}}
					className="h-8 w-8 object-contain"
				/>
			</TableCell>
			<TableCell>{item.name}</TableCell>
			<TableCell>{item.url}</TableCell>
			<TableCell>{item.openInNewTab ? "Yes" : "No"}</TableCell>
			<TableCell className="capitalize">{item.widget.type}</TableCell>
			<TableCell>
				<EditServiceButton disabled={loading} service={item} />
				<DeleteServiceButton service={item} />
			</TableCell>
		</TableRow>
	);
}

export default SortableServiceRow;
