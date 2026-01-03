import { actions } from "astro:actions";
import { useMutation } from "@tanstack/react-query";
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
import type { Category } from "~/lib/db/schema";
import { queryClient } from "~/lib/store";

export const DeleteCategoryButton = ({
	category: { id, name },
}: {
	category: Pick<Category, "id" | "name">;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const deleteCategoryMutation = useMutation(
		{
			mutationFn: actions.category.delete,
			onSuccess: async (res) => {
				if (res.error) {
					throw new Error(res.error.message);
				}
				setIsOpen(false);
				toast("Category deleted");
				queryClient.invalidateQueries({
					queryKey: ["categories"],
				});
			},
		},
		queryClient,
	);

	const deleteCategory = () => {
		deleteCategoryMutation.mutate({ id });
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger
				render={
					<Button variant="destructive">
						<TrashIcon />
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete &quot;{name}&quot;</DialogTitle>
				</DialogHeader>
				<p>
					Are you absolutely sure you want to delete category &quot;{name}
					&quot;?
				</p>
				<DialogFooter>
					<DialogClose render={<Button variant="outline">Cancel</Button>} />
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
