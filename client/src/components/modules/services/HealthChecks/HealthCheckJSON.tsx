import { useQuery } from "react-query";

import { fetchHealthCheck } from "../../../../utils/api";
import { Indicator } from "../../../ui/Indicator";

type Props = {
  src: string;
};

const HealthCheckJSON = ({ src }: Props) => {
  const { data, isLoading } = useQuery(["healthcheck", src], () =>
    fetchHealthCheck(src)
  );

  if (!data || isLoading) return <></>;

  const name = src.split("/").at(-1)?.replace(".json", "") ?? "";

  if (data.status !== "up")
    return (
      <Indicator
        className="bg-red-500 text-gray-50 shadow-sm"
        info={`${name.charAt(0).toUpperCase() + name.slice(1)} : ${
          data.status
        }\\A ${data.grace} grace\\A ${data.down} down`}
      >
        {data.down}
      </Indicator>
    );

  return <></>;
};

export default HealthCheckJSON;
