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
import { Suspense, useState } from "react";
import { toast } from "sonner";
import SortableCategoryRow from "~/components/admin/sortable-cat-row";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

export const ReorderCategoriesButton = () => {
	return (
		<Suspense fallback={<Button disabled>Reorder categories</Button>}>
			<Content />
		</Suspense>
	);
};

const Content = () => {
	const [categories] = api.category.getAll.useSuspenseQuery();
	const [categoriesOrder, setCategoriesOrder] = useState(
		categories.map((c) => c.name),
	);
	const [isOpen, setIsOpen] = useState(false);
	const utils = api.useUtils();
	const reorderCategoriesMutation = api.category.reorder.useMutation({
		onSuccess: async () => {
			toast.success("Categories reordered");
			setIsOpen(false);
			await utils.category.getAll.invalidate();
		},
		onError: () => {
			toast.error("An error occurred while reordering categories");
		},
	});
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
				const oldIndex = items.indexOf(active.id.toString());
				const newIndex = items.indexOf(over.id.toString());

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
			<DialogTrigger asChild>
				<Button>Reorder categories</Button>
			</DialogTrigger>
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
								<SortableCategoryRow key={category} item={category} />
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
