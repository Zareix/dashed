"use client";

import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import type { Category } from "~/server/db/schema";
import { api } from "~/trpc/react";

const DeleteCategoryButton = ({
	category: { name },
}: {
	category: Pick<Category, "name">;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const utils = api.useUtils();
	const deleteCategoryMutation = api.category.delete.useMutation({
		onSuccess: async () => {
			setIsOpen(false);
			toast("Category deleted");
			await utils.category.getAll.invalidate();
		},
	});

	const deleteCategory = () => {
		deleteCategoryMutation.mutate(name);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive">
					<TrashIcon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete &quot;{name}&quot;</DialogTitle>
				</DialogHeader>
				<p>
					Are you absolutely sure you want to delete category &quot;{name}
					&quot;?
				</p>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button
						variant="destructive"
						onClick={deleteCategory}
						disabled={deleteCategoryMutation.isPending}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteCategoryButton;
