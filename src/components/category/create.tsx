import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { EditCreateCategoryForm } from "./edit-create-form";

export const CreateCategoryButton = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger
				render={
					<Button>
						<PlusIcon />
						Add category
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a new category</DialogTitle>
				</DialogHeader>
				<EditCreateCategoryForm onFinish={() => setIsOpen(false)} />
			</DialogContent>
		</Dialog>
	);
};
