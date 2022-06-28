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

  if (!data || isLoading || data.status === "up") return <></>;

  const name = src.split("/").at(-1)?.replace(".json", "") ?? "";

  return (
    <Indicator
      className={`tooltip-bottom text-gray-50 shadow-sm ${
        data.down > 0
          ? "bg-error text-error-content"
          : "bg-warning text-warning-content"
      }`}
      info={`${name.charAt(0).toUpperCase() + name.slice(1)} : ${
        data.status
      }\\A ${data.grace} grace\\A ${data.down} down`}
    >
      {data.down + data.grace}
    </Indicator>
  );
};

export default HealthCheckJSON;
