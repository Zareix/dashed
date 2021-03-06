import { Application } from "../../../models/Applications";
import HealthChecks from "./HealthChecks";

import { Pihole } from "./PiHole";
import Ping from "./Ping";
import Portainer from "./Portainer";
import Servarr from "./Servarr";

type Props = {
  app: Application;
};

const Service = ({ app }: Props) => {
  switch (app.type?.toLowerCase()) {
    case "pi-hole":
    case "pihole":
      return <Pihole app={app} />;
    case "ping":
      return <Ping app={app} />;
    case "sonarr":
    case "radarr":
    case "servarr":
      return <Servarr app={app} />;
    case "prowlarr":
      return <Servarr app={app} apiVersion={1} scopes={["status"]} />;

    case "portainer":
      return <Portainer app={app} />;

    case "healthcheck":
      return <HealthChecks sources={app.healthCheck} />;
    default:
      return <></>;
  }
};

export default Service;
