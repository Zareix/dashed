import { actions } from "astro:actions";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import SortableCategoryRow from "~/components/category/sortable-cat-row";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import type { Category } from "~/lib/db/schema";
import { queryClient } from "~/lib/store";

export const ReorderCategoriesButton = () => {
	const categoriesQuery = useQuery(
		{
			queryKey: ["categories", "with-services"],
			queryFn: actions.category.getAllWithServices,
			select: (res) => {
				if (res.error) throw new Error(res.error.message);
				return res.data;
			},
		},
		queryClient,
	);

	if (categoriesQuery.isLoading) {
		return <Button disabled>Reorder categories</Button>;
	}

	if (categoriesQuery.isError || !categoriesQuery.data) {
		return <Button disabled>Error loading categories</Button>;
	}

	return <Content categories={categoriesQuery.data} />;
};

const Content = ({ categories }: { categories: Array<Category> }) => {
	const [categoriesOrder, setCategoriesOrder] = useState(
		categories.map((c) => c.id),
	);
	const [isOpen, setIsOpen] = useState(false);
	const reorderCategoriesMutation = useMutation(
		{
			mutationFn: actions.category.reorder,
			onSuccess: async () => {
				toast.success("Categories reordered");
				setIsOpen(false);
				await queryClient.invalidateQueries({
					queryKey: ["categories"],
				});
			},
			onError: () => {
				toast.error("An error occurred while reordering categories");
			},
		},
		queryClient,
	);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (active.id !== over?.id) {
			setCategoriesOrder((items) => {
				if (!active || !over) return items;
				const oldIndex = items.indexOf(active.id as number);
				const newIndex = items.indexOf(over.id as number);

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	const submit = () => {
		reorderCategoriesMutation.mutate({
			order: categoriesOrder,
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger render={<Button>Reorder categories</Button>} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Reorder categories</DialogTitle>
				</DialogHeader>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={categoriesOrder}
						strategy={verticalListSortingStrategy}
					>
						<ul className="flex flex-col gap-2">
							{categoriesOrder.map((category) => (
								<SortableCategoryRow
									key={category}
									item={category}
									name={categories.find((c) => c.id === category)?.name ?? ""}
								/>
							))}
						</ul>
					</SortableContext>
				</DndContext>
				<DialogFooter>
					<Button
						disabled={reorderCategoriesMutation.isPending}
						onClick={submit}
					>
						Submit
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
