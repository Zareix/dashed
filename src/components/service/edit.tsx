import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import type { Service } from "~/server/db/schema";
import { ScrollArea } from "../ui/scroll-area";
import { EditCreateServiceForm } from "./edit-create-service";

const EditServiceButton = ({
	service,
	disabled = false,
}: {
	service: Pick<
		Service,
		| "id"
		| "name"
		| "url"
		| "alternativeUrls"
		| "categoryName"
		| "icon"
		| "iconDark"
		| "openInNewTab"
		| "widget"
	>;
	disabled: boolean;
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button disabled={disabled} variant="ghost">
					<PencilIcon />
				</Button>
			</DialogTrigger>
			<DialogContent className="overflow-y-auto max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Edit service</DialogTitle>
				</DialogHeader>
				<ScrollArea className="max-h-[80vh]">
					<EditCreateServiceForm
						service={service}
						onFinish={() => setIsOpen(false)}
					/>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default EditServiceButton;
