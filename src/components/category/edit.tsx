"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import type { Category } from "~/server/db/schema";
import { EditCreateCategoryForm } from "./edit-create-form";

const EditCategoryButton = ({
	category,
}: {
	category: Pick<Category, "name" | "maxCols">;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Edit</Button>
			</DialogTrigger>
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

export default EditCategoryButton;
