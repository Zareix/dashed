import { Application } from "../../models/Applications";

import { Pihole } from "./PiHole";
import ServarrV3 from "./ServarrV3";

type Props = {
  app: Application;
  discret?: boolean;
};

const Service = ({ app, discret }: Props) => {
  switch (app.type?.toLowerCase()) {
    case "pi-hole":
      return <Pihole app={app} />;

    case "sonarr":
    case "radarr":
      return <ServarrV3 app={app} discret={discret} />;

    default:
      return <></>;
  }
};

export default Service;
