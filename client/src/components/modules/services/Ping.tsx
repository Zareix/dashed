import { useQuery } from "@tanstack/react-query";

import { Application } from "../../../models/Applications";
import { ping } from "../../../utils/api";
import { Disabled, Enabled } from "../../ui/Indicator";

type Props = {
  app: Application;
};

const Ping = ({ app }: Props) => {
  const allowedStatusCode = app.allowedStatusCode ?? [200];
  const { isLoading, data: statusCode } = useQuery(
    ["ping", app.name],
    () => ping(app.endpoint ?? app.url, app.headers),
    {
      retry: false,
    }
  );

  if (isLoading && !statusCode) return <></>;

  if (allowedStatusCode?.includes(statusCode ?? 0)) return <Enabled />;
  return <Disabled />;
};

export default Ping;
