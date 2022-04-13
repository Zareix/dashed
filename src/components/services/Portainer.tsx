import { useQueries, useQuery } from "react-query";

import { Application } from "../../models/Applications";
import {
  portainerFetchContainers,
  portainerFetchEndpoints,
} from "../../utils/api";
import { Indicator } from "../ui/Indicator";

export type PortainerEndpoint = {
  Id: number;
  Name: string;
};

export type PortainerContainer = {
  Names: string[];
  State: string;
};

type Props = {
  app: Application;
};

const Portainer = ({ app }: Props) => {
  const { data, isLoading } = useQuery(["portainer_endpoints"], () =>
    portainerFetchEndpoints(app.url, app.apiKey)
  );

  const { data: results, isLoading: isLoadingContainers } = useQuery(
    ["portainer_container", app.endpoints],
    () =>
      portainerFetchContainers(
        app.endpoint ?? app.url,
        app.apiKey,
        data,
        app.endpoints
      ),
    {
      enabled: !!data,
    }
  );

  if (isLoading || isLoadingContainers || !data || !results) {
    return <></>;
  }

  const containers = results.reduce((x, y) => x.concat(y), []);

  const runningContainers = containers.filter((x) => x.State === "running");
  const idleContainers = containers.filter((x) => x.State !== "running");

  return (
    <div className="flex gap-1">
      <Indicator
        info={runningContainers.map((x) => x.Names.join()).join("\\A ")}
        className="bg-cyan-400 text-gray-50"
      >
        {runningContainers.length}
      </Indicator>
      <Indicator
        info={idleContainers.map((x) => x.Names[0].slice(1)).join("\\A ")}
        className="bg-gray-300 text-gray-50"
      >
        {idleContainers.length}
      </Indicator>
    </div>
  );
};

export default Portainer;
