import { asc } from "drizzle-orm";
import { EllipsisVerticalIcon } from "lucide-react";
import { PHASE_PRODUCTION_BUILD } from "next/dist/shared/lib/constants";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import MonitorService from "~/components/MonitorService";
import { ServiceIcon } from "~/components/ServiceIcon";
import Widget from "~/components/service/widget";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";
import { cn } from "~/lib/utils";
import type { WIDGETS } from "~/lib/widgets";
import { db } from "~/server/db";
import {
	type AlternativeUrl,
	categoryTable,
	servicesTable,
} from "~/server/db/schema";
import { api } from "~/utils/api";

export const getStaticProps = async () => {
	if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
		return {
			props: {
				categories: [],
			},
		};
	}
	const categories = await db.query.categoryTable.findMany({
		with: {
			services: {
				orderBy: [asc(servicesTable.order)],
			},
		},
		orderBy: [asc(categoryTable.order)],
	});
	return {
		props: {
			categories: categories.map((category) => ({
				name: category.name,
				maxCols: category.maxCols,
				services: category.services.map((service) => ({
					id: service.id,
					name: service.name,
					url: service.url,
					icon: service.icon,
					openInNewTab: service.openInNewTab,
					widget: service.widget as WIDGETS,
					alternativeUrls: service.alternativeUrls as Array<AlternativeUrl>,
				})),
			})),
		},
	};
};

const getColsClassName = (cols: number) => {
	switch (cols) {
		case 1:
			return "lg:grid-cols-1";
		case 2:
			return "lg:grid-cols-2";
		case 3:
			return "lg:grid-cols-3";
		case 4:
			return "lg:grid-cols-4";
		case 5:
			return "lg:grid-cols-5";
		default:
			return "lg:grid-cols-5";
	}
};

export default function Home({
	categories,
}: Awaited<ReturnType<typeof getStaticProps>>["props"]) {
	const healthQuery = api.health.health.useQuery(undefined, {
		retry: false,
		refetchInterval: 1000 * 3,
	});

	useEffect(() => {
		if (healthQuery.isPending) return;
		if (healthQuery.isSuccess && healthQuery.data?.status === "ok") {
			toast.dismiss();
			return;
		}

		toast.error("Unable to connect to the server", {
			duration: Number.POSITIVE_INFINITY,
			id: "health-error",
		});
	}, [healthQuery.data, healthQuery.isPending, healthQuery.isSuccess]);

	return (
		<>
			{categories.length === 0 && (
				<p className="text-center text-lg m-auto">
					Nothing here yet. Add links in the{" "}
					<Link href="/admin">
						<Button variant="link" className="text-lg mx-0 px-0">
							<span className="font-bold">Admin panel</span>
						</Button>
					</Link>
				</p>
			)}
			{categories.map((category) => (
				<section key={category.name} className="container mt-4 p-1">
					<h2 className="text-2xl font-bold">{category.name}</h2>

					<ul
						className={cn(
							"mt-1 grid grid-cols-2 gap-2",
							getColsClassName(category.maxCols),
						)}
					>
						{category.services.map((service) => (
							<li key={service.id}>
								<ServiceWrapper widget={service.widget}>
									<a
										href={service.url}
										className="h-full items-center gap-2 rounded-lg border border-border bg-foreground/5 p-2 shadow-xs relative flex has-[.ping-error]:border-red-500"
										rel={service.openInNewTab ? "noopener noreferrer" : ""}
										target={service.openInNewTab ? "_blank" : ""}
									>
										<ServiceIcon
											service={service}
											className="h-8 w-8 object-contain"
										/>
										<div className="overflow-hidden whitespace-nowrap text-ellipsis">
											{service.name}
										</div>
										{healthQuery.data?.status === "ok" && (
											<MonitorService service={service} />
										)}
										<AlternativeUrls
											alternativeUrls={service.alternativeUrls}
										/>
									</a>
								</ServiceWrapper>
							</li>
						))}
					</ul>
				</section>
			))}
			<div className="container pt-4 justify-end flex group">
				<Link
					href="/admin"
					className="opacity-0 group-hover:opacity-5 hover:opacity-100!"
				>
					<Button>Admin</Button>
				</Link>
			</div>
		</>
	);
}

const AlternativeUrls = ({
	alternativeUrls,
}: {
	alternativeUrls?: Array<AlternativeUrl>;
}) => {
	if (!alternativeUrls || alternativeUrls.length === 0) {
		return <></>;
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				onClick={(e) => e.preventDefault()}
				className="ml-auto"
			>
				<EllipsisVerticalIcon />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Alternative URLs</DropdownMenuLabel>
				{alternativeUrls.map((url) => (
					<DropdownMenuItem key={url.url} className="flex items-center gap-2">
						<a
							href={url.url}
							className="flex items-center gap-2 w-full"
							target="_blank"
							rel="noopener noreferrer"
						>
							{url.name}
						</a>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const ServiceWrapper = ({
	widget,
	children,
}: {
	children: React.ReactNode;
	widget: Awaited<
		ReturnType<typeof getStaticProps>
	>["props"]["categories"][0]["services"][0]["widget"];
}) => {
	if (widget.type === "none") {
		return <>{children}</>;
	}

	return (
		<HoverCard openDelay={0} closeDelay={100}>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-fit">
				<Widget widget={widget} />
			</HoverCardContent>
		</HoverCard>
	);
};
