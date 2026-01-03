import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import type { Category } from "~/lib/db/schema";
import { EditCreateCategoryForm } from "./edit-create-form";

export const EditCategoryButton = ({
	category,
}: {
	category: Pick<Category, "id" | "name" | "maxCols">;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger render={<Button variant="outline">Edit</Button>} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit category</DialogTitle>
				</DialogHeader>
				<EditCreateCategoryForm
					category={category}
					onFinish={() => setIsOpen(false)}
				/>
			</DialogContent>
		</Dialog>
	);
};
