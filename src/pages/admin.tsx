import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "~/components/ui/button";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { api } from "~/utils/api";

import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import CreateCategoryButton from "~/components/CreateCategoryButton";
import CreateServiceButton from "~/components/CreateServiceButton";
import DeleteCategoryButton from "~/components/DeleteCategoryButton";
import EditCategoryButton from "~/components/EditCategoryButton";
import ExportButton from "~/components/ExportButton";
import ImportButton from "~/components/ImportButton";
import ReorderCategoriesButton from "~/components/ReorderCategoriesButton";
import SortableServiceRow from "~/components/SortableServiceRow";
import { Separator } from "~/components/ui/separator";
import type { Category, Service } from "~/server/db/schema";

export default function AdminPage() {
	const categoriesQuery = api.category.getAll.useQuery();
	const utils = api.useUtils();
	const refreshIndexPageMutation = api.service.refresh.useMutation({
		onSuccess: async () => {
			toast.success("Index page refreshed");
		},
		onError: () => {
			toast.error("An error occurred while refreshing index page");
		},
	});
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

	const refresh = () => {
		refreshIndexPageMutation.mutate();
	};

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
		<div className="container pt-4">
			<div className="flex items-center justify-center gap-4 flex-wrap">
				<Link href="/">
					<HomeIcon size={24} />
				</Link>
				<Separator orientation="vertical" className="h-5" />
				{categoriesQuery.data && (
					<ReorderCategoriesButton categories={categoriesQuery.data} />
				)}
				<CreateCategoryButton />
				<CreateServiceButton categories={categoriesQuery.data ?? []} />
				<Button onClick={refresh}>Refresh homepage</Button>
				<Separator orientation="vertical" className="h-5" />
				<ImportButton />
				<ExportButton />
			</div>
			{categoriesQuery.isLoading ? (
				<div className="mt-4">Loading...</div>
			) : categoriesQuery.isError || !categoriesQuery.data ? (
				<div className="mt-4">An error occurred while loading services.</div>
			) : (
				categoriesQuery.data.map((category) => (
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
								categories={categoriesQuery.data ?? []}
								category={category}
							/>
							<EditCategoryButton category={category} />
							<DeleteCategoryButton category={category} />
						</div>
						<div className="mt-1 overflow-hidden rounded-lg border-2 border-border bg-foreground/5">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[50px]" />
										<TableHead>Icon</TableHead>
										<TableHead>Name</TableHead>
										<TableHead>URL</TableHead>
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
																item={category.services.find(
																	(service) => service.id === serviceId,
																)}
																loading
															/>
														),
													)
												: category.services.map((service) => (
														<SortableServiceRow
															key={service.id}
															item={service}
														/>
													))}
										</SortableContext>
									</DndContext>
								</TableBody>
							</Table>
						</div>
					</div>
				))
			)}
		</div>
	);
}
