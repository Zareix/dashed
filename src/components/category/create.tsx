import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { api } from "~/utils/api";

const categoryCreateSchema = z.object({
	name: z.string().min(1),
	maxCols: z.number().min(1).max(5),
});

const CreateCategoryButton = () => {
	const [isOpen, setIsOpen] = useState(false);
	const utils = api.useUtils();
	const createCategoryMutation = api.category.create.useMutation({
		onSuccess: async () => {
			toast.success("Category created");
			setIsOpen(false);
			form.reset();
			await utils.category.getAll.invalidate();
		},
		onError: () => {
			toast.error("An error occurred while creating category");
		},
	});
	const form = useForm<z.infer<typeof categoryCreateSchema>>({
		resolver: zodResolver(categoryCreateSchema),
		defaultValues: {
			name: "",
			maxCols: 5,
		},
	});

	function onSubmit(values: z.infer<typeof categoryCreateSchema>) {
		createCategoryMutation.mutate(values);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>
					<PlusIcon />
					Add category
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a new category</DialogTitle>
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
										<Input placeholder="Category name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="maxCols"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Max columns</FormLabel>
									<FormControl>
										<Input
											type="number"
											min={1}
											max={5}
											placeholder="Max columns"
											{...field}
											onChange={(e) => {
												field.onChange(Number.parseInt(e.target.value));
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							disabled={createCategoryMutation.isPending}
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

export default CreateCategoryButton;
