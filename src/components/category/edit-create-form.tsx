import { actions } from "astro:actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4-mini";
import { Button } from "~/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import type { Category } from "~/lib/db/schema";
import { queryClient } from "~/lib/store";

const categoryCreateSchema = z.object({
	name: z.string().check(z.minLength(1, "Name is required")),
	maxCols: z
		.number()
		.check(z.minimum(1, "Max columns must be at least 1"))
		.check(z.maximum(5, "Max columns cannot exceed 5")),
});

type Props = {
	category?: Pick<Category, "id" | "name" | "maxCols">;
	onFinish?: () => void;
};

export const EditCreateCategoryForm: React.FC<Props> = ({
	category,
	onFinish,
}) => {
	const createCategoryMutation = useMutation(
		{
			mutationFn: actions.category.create,
			onSuccess: async () => {
				toast.success("Category created");
				onFinish?.();
				form.reset();
				queryClient.invalidateQueries({
					queryKey: ["categories"],
				});
			},
			onError: () => {
				toast.error("An error occurred while creating category");
			},
		},
		queryClient,
	);
	const editCategoryMutation = useMutation(
		{
			mutationFn: actions.category.edit,
			onSuccess: async () => {
				toast.success("Category edited");
				onFinish?.();
				form.reset();
				queryClient.invalidateQueries({
					queryKey: ["categories"],
				});
			},
			onError: () => {
				toast.error("An error occurred while editings category");
			},
		},
		queryClient,
	);
	const form = useForm({
		resolver: zodResolver(categoryCreateSchema),
		defaultValues: {
			name: category?.name || "",
			maxCols: category?.maxCols || 5,
		},
	});

	function onSubmit(values: z.infer<typeof categoryCreateSchema>) {
		if (category) {
			editCategoryMutation.mutate({
				...values,
				id: category.id,
			});
		} else {
			createCategoryMutation.mutate(values);
		}
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup>
				<Controller
					control={form.control}
					name="name"
					disabled={!!category}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Name</FieldLabel>
							<Input
								{...field}
								id={field.name}
								placeholder="Category name"
								aria-invalid={fieldState.invalid}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Controller
					control={form.control}
					name="maxCols"
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>Max columns</FieldLabel>
							<Input
								{...field}
								type="number"
								min={1}
								max={5}
								placeholder="Max columns"
								onChange={(e) => {
									field.onChange(Number.parseInt(e.target.value, 10));
								}}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Button
					type="submit"
					disabled={createCategoryMutation.isPending}
					className="ml-auto"
				>
					Submit
				</Button>
			</FieldGroup>
		</form>
	);
};
