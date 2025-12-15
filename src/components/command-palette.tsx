import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandLoading,
} from "~/components/ui/command";
import { Kbd, KbdGroup } from "~/components/ui/kbd";
import { queryClient } from "~/lib/store";

export function CommandPalette() {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
		null,
	);
	const [isMetaPressed, setIsMetaPressed] = useState(false);
	const baseCommandsQuery = useQuery(
		{
			queryKey: ["commands"],
			queryFn: actions.command.getBaseCommands,
			select: (res) => {
				if (res.error) throw new Error(res.error.message);
				return res.data;
			},
		},
		queryClient,
	);
	const widgetCommandsQuery = useQuery(
		{
			queryKey: ["commands", selectedServiceId],
			queryFn: () => {
				if (!selectedServiceId) throw new Error("No service selected");
				return actions.command.getWidgetCommands(selectedServiceId);
			},
			select: (res) => {
				if (res.error) throw new Error(res.error.message);
				return res.data;
			},
			enabled: !!selectedServiceId,
		},
		queryClient,
	);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const isValidUrl = (url: string): boolean => {
		try {
			const parsed = new URL(url, window.location.origin);
			return parsed.protocol === "http:" || parsed.protocol === "https:";
		} catch {
			return false;
		}
	};

	const navigate = (url: string) => {
		if (isValidUrl(url)) {
			window.location.href = url;
		} else {
			console.error("Invalid URL:", url);
		}
	};

	const isLoading =
		widgetCommandsQuery.isLoading || baseCommandsQuery.isLoading;
	const isError = widgetCommandsQuery.isError || baseCommandsQuery.isError;
	const commands = widgetCommandsQuery.data ?? baseCommandsQuery.data;

	return (
		<CommandDialog
			open={open}
			onOpenChange={setOpen}
			commandProps={{
				onKeyDown: (e) => {
					if (e.key === "Escape" || (e.key === "Backspace" && !search)) {
						e.preventDefault();
						setSelectedServiceId(null);
					}
					if (e.key === "Meta" || e.key === "Control") {
						setIsMetaPressed(true);
					}
				},
				onKeyUp: (e) => {
					if (e.key === "Meta" || e.key === "Control") {
						setIsMetaPressed(false);
					}
				},
			}}
		>
			<CommandInput
				placeholder="Type a command or search..."
				value={search}
				onValueChange={setSearch}
			/>
			<CommandList>
				{isLoading ? (
					<CommandLoading>Fetching widget commands…</CommandLoading>
				) : isError || !commands ? (
					<CommandEmpty>Error loading commands.</CommandEmpty>
				) : (
					<>
						<CommandEmpty>No results found.</CommandEmpty>
						{Object.entries(commands).map(([cg, commandList]) => (
							<CommandGroup heading={cg} key={cg}>
								{commandList.map((c) => (
									<CommandItem
										key={c.name}
										onSelect={() => {
											if (isMetaPressed && c.serviceId) {
												setSelectedServiceId(c.serviceId);
												setSearch("");
											} else {
												navigate(c.url);
												setOpen(false);
											}
										}}
									>
										{c.icon && (
											<img
												src={c.icon}
												alt={c.name}
												className="h-4 w-4 object-contain"
											/>
										)}
										<span>{c.name}</span>
										{c.information && (
											<span className="ml-auto opacity-50">
												{c.information}
											</span>
										)}
										{c.serviceId && (
											<div className="ml-auto text-muted-foreground">
												<KbdGroup>
													<Kbd>⌘ + Enter</Kbd>
												</KbdGroup>{" "}
												to open details
											</div>
										)}
									</CommandItem>
								))}
							</CommandGroup>
						))}
					</>
				)}
			</CommandList>
		</CommandDialog>
	);
}
