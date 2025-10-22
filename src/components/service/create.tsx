"use client";

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
import type { Category } from "~/server/db/schema";
import { ScrollArea } from "../ui/scroll-area";
import { EditCreateServiceForm } from "./edit-create-service";

const CreateServiceButton = ({
	category,
}: {
	category?: Pick<Category, "name">;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>
					<PlusIcon />
					Add service
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a new service</DialogTitle>
				</DialogHeader>
				<ScrollArea className="max-h-[80vh]">
					<EditCreateServiceForm
						category={category}
						onFinish={() => setIsOpen(false)}
					/>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default CreateServiceButton;
