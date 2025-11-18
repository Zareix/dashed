import { actions } from "astro:actions";
import { useMutation } from "@tanstack/react-query";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { queryClient } from "~/lib/store";

export const ExportButton = () => {
	const exportMutation = useMutation(
		{
			mutationFn: actions.importExport.export,
			onSuccess: async (res) => {
				if (res.error) {
					throw new Error(res.error.message);
				}
				await navigator.clipboard.writeText(JSON.stringify(res.data));
				toast.success("Exported. Copied to clipboard");
			},
			onError: () => {
				toast.error("Could not export");
			},
		},
		queryClient,
	);
	return (
		<Button onClick={() => exportMutation.mutate(null)}>
			<UploadIcon /> Export
		</Button>
	);
};
