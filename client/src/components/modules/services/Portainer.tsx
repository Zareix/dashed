import { useQuery } from "@tanstack/react-query";

import { Application } from "../../../models/Applications";
import {
  portainerFetchContainers,
  portainerFetchEndpoints,
} from "../../../utils/api";
import { extractURL } from "../../../utils/extractURL";
import { Indicator } from "../../ui/Indicator";

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
  const { data: endpoints, isLoading } = useQuery(
    ["portainer_endpoints"],
    () =>
      portainerFetchEndpoints(app.endpoint ?? extractURL(app.url), app.apiKey),
    {
      retry: 3,
    }
  );

  const { data: results, isLoading: isLoadingContainers } = useQuery(
    ["portainer_container", app.endpoints],
    () =>
      portainerFetchContainers(
        app.endpoint ?? extractURL(app.url),
        app.apiKey,
        endpoints,
        app.endpoints
      ),
    {
      enabled: !!endpoints,
      retry: 3,
    }
  );

  if (isLoading || isLoadingContainers || !endpoints || !results) {
    return <></>;
  }

  const containers = results.reduce((x, y) => x.concat(y), []);

  const runningContainers = containers
    .filter((x) => x.State === "running")
    .sort((x, y) => x.Names[0].localeCompare(y.Names[0]));
  const idleContainers = containers
    .filter((x) => x.State !== "running")
    .sort((x, y) => x.Names[0].localeCompare(y.Names[0]));

  if (runningContainers.length < 0 && idleContainers.length < 0) return <></>;

  return (
    <div className="flex gap-1">
      {runningContainers.length > 0 && (
        <Indicator
          info={runningContainers.map((x) => x.Names[0].slice(1)).join(" / ")}
          className="tooltip tooltip-info bg-info text-info-content"
        >
          {runningContainers.length}
        </Indicator>
      )}
      {idleContainers.length > 0 && (
        <Indicator
          info={idleContainers.map((x) => x.Names[0].slice(1)).join(" / ")}
          className="bg-neutral text-neutral-content"
        >
          {idleContainers.length}
        </Indicator>
      )}
    </div>
  );
};

export default Portainer;
