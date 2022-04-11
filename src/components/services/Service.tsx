import { Application } from "../../models/Applications";

import { Pihole } from "./PiHole";
import Sonarr from "./Sonarr";

type Props = {
  app: Application;
};

const Service = ({ app }: Props) => {
  switch (app.type?.toLowerCase()) {
    case "pi-hole":
      return <Pihole app={app} />;

    case "sonarr":
      return <Sonarr app={app} />;

    default:
      return <></>;
  }
};

export default Service;
