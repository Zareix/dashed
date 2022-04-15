import { Application } from "../../models/Applications";

import { Pihole } from "./PiHole";
import Portainer from "./Portainer";
import Servarr from "./Servarr";

type Props = {
  app: Application;
};

const Service = ({ app }: Props) => {
  switch (app.type?.toLowerCase()) {
    case "pi-hole":
      return <Pihole app={app} />;

    case "sonarr":
    case "radarr":
    case "servarr":
      return <Servarr app={app} />;
    case "prowlarr":
      return <Servarr app={app} apiVersion={1} />;

    case "portainer":
      return <Portainer app={app} />;

    default:
      return <></>;
  }
};

export default Service;
