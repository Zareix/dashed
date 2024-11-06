import { PHASE_PRODUCTION_BUILD } from "next/dist/shared/lib/constants";
import { db } from "~/server/db";

export const getStaticProps = async () => {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return {
      props: {
        services: [],
      },
    };
  }
  const services = await db.query.servicesTable.findMany();
  return {
    props: {
      services: services.map((service) => ({
        id: service.id,
        name: service.name,
        url: service.url,
      })),
    },
  };
};

export default function Home({
  services,
}: Awaited<ReturnType<typeof getStaticProps>>["props"]) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      {services.map((service) => (
        <p key={service.id}>{service.name}</p>
      ))}
    </main>
  );
}
