import { asc } from "drizzle-orm";
import { PHASE_PRODUCTION_BUILD } from "next/dist/shared/lib/constants";
import Image from "next/image";
import MonitorService from "~/components/MonitorService";
import { cn } from "~/lib/utils";
import { db } from "~/server/db";
import { categoryTable, servicesTable } from "~/server/db/schema";

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
				})),
			})),
		},
	};
};

const LinkWrapper = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
	return (
		<>
			<a {...props} className={cn("flex sm:hidden", props.className)} />
			<a
				{...props}
				target="_blank"
				rel="noopener noreferrer"
				className={cn("hidden sm:flex", props.className)}
			/>
		</>
	);
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
	return (
		<>
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
								<LinkWrapper
									href={service.url}
									className="h-full items-center gap-2 rounded-lg border border-border bg-foreground/5 p-2 shadow-sm relative"
								>
									<Image
										src={service.icon}
										alt={`${service.name} icon`}
										width={32}
										height={32}
										className="h-8 w-8 object-contain"
									/>
									{service.name}
									<MonitorService service={service} />
								</LinkWrapper>
							</li>
						))}
					</ul>
				</section>
			))}
		</>
	);
}
