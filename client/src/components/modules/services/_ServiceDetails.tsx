import { Application } from "../../../models/Applications";
import { PiholeDetails } from "./PiHole";

type Props = {
  app: Application;
};

const ServiceDetails = ({ app }: Props) => {
  switch (app.type?.toLowerCase()) {
    case "pi-hole":
      return <PiholeDetails app={app} />;

    default:
      return <></>;
  }
};

export default ServiceDetails;
