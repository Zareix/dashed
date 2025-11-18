import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon } from "lucide-react";
import type { Category } from "~/lib/db/schema";

function SortableCategoryRow({
	item,
	name,
}: {
	item?: Category["id"];
	name: Category["name"];
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: item ?? -1 });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	if (!item) {
		return null;
	}

	return (
		<li
			ref={setNodeRef}
			style={style}
			{...attributes}
			className="flex items-center gap-2 rounded border p-2"
		>
			<span className="cursor-move" {...listeners}>
				<GripVerticalIcon className="h-5 w-5 text-gray-500" />
			</span>
			<span>{name}</span>
		</li>
	);
}

export default SortableCategoryRow;
