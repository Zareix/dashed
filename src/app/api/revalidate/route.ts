import { revalidatePath } from "next/cache";

export const POST = async (_req: Request) => {
	revalidatePath("/");
	return new Response("Revalidated", { status: 200 });
};
