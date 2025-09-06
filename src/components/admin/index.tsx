"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import SortableServiceRow from "~/components/admin/sortable-service-row";
import DeleteCategoryButton from "~/components/category/delete";
import EditCategoryButton from "~/components/category/edit";
import CreateServiceButton from "~/components/service/create";
import { Separator } from "~/components/ui/separator";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import type { Category, Service } from "~/server/db/schema";
import { api } from "~/trpc/react";

export function AdminPage() {
	const [categories] = api.category.getAll.useSuspenseQuery();
	const utils = api.useUtils();
	const reorderServiceMutation = api.service.reorder.useMutation({
		onSuccess: async () => {
			toast.success("Service reordered");
		},
		onError: () => {
			toast.error("An error occurred while reordering service");
		},
		onSettled: async () => {
			return await utils.category.getAll.refetch();
		},
	});
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (
		event: DragEndEvent,
		categoryName: Category["name"],
		items: Service[],
	) => {
		const { active, over } = event;

		if (active.id !== over?.id) {
			const oldIndex = items.findIndex((item) => item.id === active.id);
			const newIndex = items.findIndex((item) => item.id === over?.id);

			const sortedIds = arrayMove(items, oldIndex, newIndex).map(
				(item) => item.id,
			);
			reorderServiceMutation.mutate({
				categoryName,
				order: sortedIds,
			});
		}
	};

	return (
		<div>
			{categories.map((category) => (
				<div key={category.name} className="mt-4 p-1">
					<div className="flex items-end gap-2">
						<h2 className="text-xl font-bold">{category.name}</h2>
						<Separator orientation="vertical" className="ml-auto" />
						{category.maxCols !== 5 && (
							<div className="text-sm text-muted-foreground">
								Max cols: {category.maxCols}
							</div>
						)}
						<CreateServiceButton
							categories={categories ?? []}
							category={category}
						/>
						<EditCategoryButton category={category} />
						<DeleteCategoryButton category={category} />
					</div>
					<div className="mt-1 overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[50px]" />
									<TableHead>Icon</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>URL</TableHead>
									<TableHead>Open in new tab</TableHead>
									<TableHead>Widget</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<DndContext
									sensors={sensors}
									collisionDetection={closestCenter}
									onDragEnd={(event) =>
										handleDragEnd(event, category.name, category.services)
									}
								>
									<SortableContext
										items={category.services}
										strategy={verticalListSortingStrategy}
									>
										{reorderServiceMutation.isPending &&
										reorderServiceMutation.variables.categoryName ===
											category.name
											? reorderServiceMutation.variables.order.map(
													(serviceId) => (
														<SortableServiceRow
															key={serviceId}
															service={category.services.find(
																(service) => service.id === serviceId,
															)}
															loading
														/>
													),
												)
											: category.services.map((service) => (
													<SortableServiceRow
														key={service.id}
														service={service}
													/>
												))}
									</SortableContext>
								</DndContext>
							</TableBody>
						</Table>
					</div>
				</div>
			))}
		</div>
	);
}
