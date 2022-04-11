import { useQuery } from "react-query";

import { Application } from "../../models/Applications";
import { sonarrFetchStatus } from "../../utils/api";

export type SonarrStatus = {};

type Props = {
  app: Application;
};

const Sonarr = ({ app }: Props) => {
  const { data: status, isLoading } = useQuery("sonarr_status", () =>
    sonarrFetchStatus(app.url, app.apiKey)
  );

  return <div>Sonarr</div>;
};

export default Sonarr;
