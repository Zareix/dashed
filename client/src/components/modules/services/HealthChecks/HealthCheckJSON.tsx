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
      className={`tooltip-bottom ${
        data.down > 0
          ? "tooltip-error bg-error text-error-content"
          : "tooltip-warning bg-warning text-warning-content"
      }`}
      info={`${name.charAt(0).toUpperCase() + name.slice(1)} : ${data.status} ${
        data.grace
      } grace and ${data.down} down`}
    >
      {data.down + data.grace}
    </Indicator>
  );
};

export default HealthCheckJSON;
