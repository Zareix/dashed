import { Application } from "../../models/Applications";

import { Pihole } from "./PiHole";
import ServarrV3 from "./ServarrV3";

type Props = {
  app: Application;
};

const Service = ({ app }: Props) => {
  switch (app.type?.toLowerCase()) {
    case "pi-hole":
      return <Pihole app={app} />;

    case "sonarr":
    case "radarr":
      return <ServarrV3 app={app} />;

    default:
      return <></>;
  }
};

export default Service;
