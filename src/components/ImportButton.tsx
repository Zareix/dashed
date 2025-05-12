import { zodResolver } from "@hookform/resolvers/zod";
import { ImportIcon } from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/utils/api";

const importSchema = z.object({
	type: z.enum(["dashed", "homepage"]),
	data: z.string().min(1),
});

const ImportButton = () => {
	const [isOpen, setIsOpen] = useState(false);
	const utils = api.useUtils();
	const importMutation = api.category.import.useMutation({
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
	const form = useForm<z.infer<typeof importSchema>>({
		resolver: zodResolver(importSchema),
		defaultValues: {
			type: "dashed",
			data: "",
		},
	});

	function onSubmit(values: z.infer<typeof importSchema>) {
		importMutation.mutate(values);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>
					<ImportIcon /> Import
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Import</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Yml</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="dashed">Dashed</SelectItem>
												<SelectItem value="homepage">Homepage</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="data"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Data</FormLabel>
									<FormControl>
										<Textarea placeholder="data" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							disabled={importMutation.isPending}
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

export default ImportButton;
