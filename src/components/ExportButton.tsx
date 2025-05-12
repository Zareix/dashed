import { UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const ExportButton = () => {
	const exportMutation = api.category.export.useMutation({
		onSuccess: async (res) => {
			await navigator.clipboard.writeText(JSON.stringify(res));
			toast.success("Exported. Copied to clipboard");
		},
		onError: () => {
			toast.error("Could not export");
		},
	});
	return (
		<Button onClick={() => exportMutation.mutate()}>
			<UploadIcon /> Export
		</Button>
	);
};

export default ExportButton;
