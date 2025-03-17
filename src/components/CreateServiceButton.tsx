import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ServiceIcon } from "~/components/ServiceIcon";
import { Button } from "~/components/ui/button";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import type { Category } from "~/server/db/schema";
import { api } from "~/utils/api";

const serviceCreateSchema = z.object({
	name: z.string().min(1),
	url: z.string().min(1).url(),
	categoryName: z.string(),
	icon: z.string().min(1),
});

const CreateServiceButton = ({
	categories,
	category,
}: {
	categories: Array<Pick<Category, "name">>;
	category?: Pick<Category, "name">;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const utils = api.useUtils();
	const createServiceMutation = api.service.create.useMutation({
		onSuccess: async () => {
			toast.success("Service created");
			setIsOpen(false);
			form.reset();
			await utils.category.getAll.invalidate();
		},
		onError: () => {
			toast.error("An error occurred while creating service");
		},
	});
	const form = useForm<z.infer<typeof serviceCreateSchema>>({
		resolver: zodResolver(serviceCreateSchema),
		defaultValues: {
			name: "",
			url: "",
			icon: "",
			categoryName: category?.name,
		},
	});

	function onSubmit(values: z.infer<typeof serviceCreateSchema>) {
		createServiceMutation.mutate(values);
	}

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
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
						<FormField
							control={form.control}
							name="categoryName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<FormControl>
										<Select
											onValueChange={(value) => {
												field.onChange(Number.parseInt(value));
											}}
											value={field.value?.toString()}
										>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
											<SelectContent>
												{categories.map((cat) => (
													<SelectItem value={cat.name} key={cat.name}>
														{cat.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
											{field.value && (
												<ServiceIcon
													service={{ name: "New Service", icon: field.value }}
												/>
											)}
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
						<Button
							type="submit"
							disabled={createServiceMutation.isPending}
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

export default CreateServiceButton;
