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
import type { Service } from "~/lib/db/schema";
import { queryClient } from "~/lib/store";

export const DeleteServiceButton = ({
	service: { id, name },
}: {
	service: Pick<Service, "id" | "name">;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const deleteServiceMutation = useMutation(
		{
			mutationFn: actions.service.delete,
			onSuccess: async () => {
				setIsOpen(false);
				toast("Service deleted");
				queryClient.invalidateQueries({
					queryKey: ["categories", "with-services"],
				});
			},
		},
		queryClient,
	);

	const deleteService = () => {
		deleteServiceMutation.mutate({ id });
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost">
					<TrashIcon className="text-red-500" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete &quot;{name}&quot;</DialogTitle>
				</DialogHeader>
				<p>
					Are you absolutely sure you want to delete service &quot;{name}
					&quot;?
				</p>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button
						variant="destructive"
						onClick={deleteService}
						disabled={deleteServiceMutation.isPending}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
