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
import type { Category } from "~/lib/db/schema";
import { ScrollArea } from "../ui/scroll-area";
import { EditCreateServiceForm } from "./edit-create-service";

export const CreateServiceButton = ({
	category,
}: {
	category?: Pick<Category, "id">;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger
				render={
					<Button>
						<PlusIcon />
						Add service
					</Button>
				}
			/>
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
