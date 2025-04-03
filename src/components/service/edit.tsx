import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import WidgetFormConfig from "~/components/service/widget/form-config";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { isAuthorizedDomain } from "~/lib/utils";
import type { Service } from "~/server/db/schema";
import { api } from "~/utils/api";
import { WIDGETS } from "~/utils/constants";

const serviceEditSchema = z.object({
	id: z.number(),
	name: z.string().min(1),
	url: z.string().min(1).url(),
	categoryName: z.string(),
	icon: z.string().min(1),
	openInNewTab: z.boolean(),
	widget: WIDGETS,
});

const EditServiceButton = ({
	service,
	disabled = false,
}: {
	service: Pick<Service, "id" | "name" | "url" | "categoryName">;
	disabled: boolean;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const utils = api.useUtils();
	const editServiceMutation = (
		service ? api.service.edit : api.service.edit
	).useMutation({
		onSuccess: async () => {
			toast.success("Service edited");
			setIsOpen(false);
			form.reset();
			await utils.category.getAll.invalidate();
		},
		onError: () => {
			toast.error("An error occurred while editing service");
		},
	});
	const form = useForm<z.infer<typeof serviceEditSchema>>({
		resolver: zodResolver(serviceEditSchema),
		defaultValues: service,
	});

	function onSubmit(values: z.infer<typeof serviceEditSchema>) {
		editServiceMutation.mutate(values);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button disabled={disabled} variant="ghost">
					<PencilIcon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit service</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Service name"
											{...field}
											onBlur={(e) => {
												if (!form.getValues().icon) {
													const icon = e.target.value
														.replaceAll(" ", "-")
														.toLowerCase();
													form.setValue(
														"icon",
														`https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/${icon}.png`,
													);
												}
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="icon"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Icon</FormLabel>
									<FormControl>
										<div className="flex items-center gap-2">
											{field.value &&
												(isAuthorizedDomain(field.value) ? (
													<Image
														src={field.value}
														alt="service icon"
														width={32}
														height={32}
														className="h-8 w-8 object-contain"
													/>
												) : (
													<img
														src={field.value}
														alt="service icon"
														width={32}
														height={32}
														className="h-8 w-8 object-contain"
													/>
												))}
											<Input placeholder="Service icon" {...field} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem>
									<FormLabel>URL</FormLabel>
									<FormControl>
										<Input placeholder="Service url" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="openInNewTab"
							render={({ field }) => (
								<FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-3">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>Open in new tab</FormLabel>
									</div>
								</FormItem>
							)}
						/>
						<WidgetFormConfig />
						<Button
							type="submit"
							disabled={editServiceMutation.isPending}
							className="ml-auto"
						>
							Submit
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default EditServiceButton;
