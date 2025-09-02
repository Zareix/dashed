import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AdminPage } from "~/components/admin";
import ExportButton from "~/components/admin/export";
import ImportButton from "~/components/admin/import";
import { RefreshButton } from "~/components/admin/refresh";
import { ReorderCategoriesButton } from "~/components/admin/reorder-categories";
import CreateCategoryButton from "~/components/category/create";
import { Separator } from "~/components/ui/separator";
import { api, HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default async function Admin() {
	void api.category.getAll.prefetch();
	return (
		<HydrateClient>
			<ErrorBoundary fallback={<div>Something went wrong</div>}>
				<div className="container pt-4">
					<div className="flex items-center justify-around gap-4 flex-wrap">
						<Link href="/">
							<HomeIcon size={24} />
						</Link>
						<Separator orientation="vertical" className="h-5" />
						<div className="flex gap-4">
							<ReorderCategoriesButton />
							<CreateCategoryButton />
							<RefreshButton />
						</div>
						<Separator orientation="vertical" className="h-5" />
						<div className="flex gap-4">
							<ImportButton />
							<ExportButton />
						</div>
					</div>
					<Suspense fallback={<div>Loading...</div>}>
						<AdminPage />
					</Suspense>
				</div>
			</ErrorBoundary>
		</HydrateClient>
	);
}
