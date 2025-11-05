import Link from "next/link";
import { AlternativeUrls } from "~/components/alternative-urls";
import MonitorService from "~/components/MonitorService";
import { ServiceIcon } from "~/components/ServiceIcon";
import { ServiceWrapper } from "~/components/service/widget";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { getData } from "~/server/data";

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

export default async function Home() {
	const categories = await getData();

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
										rel={
											service.openInNewTab ? "noopener noreferrer" : undefined
										}
										target={service.openInNewTab ? "_blank" : undefined}
									>
										<ServiceIcon
											service={service}
											className="h-8 w-8 object-contain"
										/>
										<div className="overflow-hidden whitespace-nowrap text-ellipsis">
											{service.name}
										</div>
										<MonitorService service={service} />
										<AlternativeUrls
											alternativeUrls={service.alternativeUrls}
											openInNewTab={service.openInNewTab}
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
