import { useQuery } from "react-query";

import { Application } from "../../../models/Applications";
import { servarrFetchActivity, servarrFetchStatus } from "../../../utils/api";
import { extractURL } from "../../../utils/extractURL";
import { Indicator } from "../../ui/Indicator";

const REFETCH_INTERVAL = 15 * 1000;

export type ServarrV3Status = {
  source: string;
  type: string;
  message: string;
};

export type ServarrV3Activity = {
  totalRecords: 0;
  records: [
    {
      title: string;
    }
  ];
};

type Props = {
  app: Application;
  apiVersion?: number;
  scopes?: string[];
};

const Servarr = ({
  app,
  apiVersion = 3,
  scopes = ["queue", "status"],
}: Props) => {
  const { data: status, isLoading } = useQuery(
    ["status", app.name],
    () =>
      servarrFetchStatus(
        app.endpoint ?? extractURL(app.url),
        app.apiKey,
        apiVersion
      ),
    {
      refetchInterval: REFETCH_INTERVAL,
      enabled: scopes.includes("status"),
    }
  );

  const { data: activity, isLoading: isActLoading } = useQuery(
    ["activity", app.name],
    () =>
      servarrFetchActivity(
        app.endpoint ?? extractURL(app.url),
        app.apiKey,
        apiVersion
      ),
    {
      refetchInterval: REFETCH_INTERVAL,
      enabled: scopes.includes("queue"),
    }
  );

  if (isLoading || isActLoading || !activity || !status) {
    return <></>;
  }

  const warnings = status.filter((x) => x.type === "warning");
  const errors = status.filter((x) => x.type === "error");

  if (
    warnings.length === 0 &&
    errors.length === 0 &&
    activity.totalRecords === 0
  ) {
    return <></>;
  }

  return (
    <div className="flex gap-2">
      {warnings.length > 0 && (
        <Indicator
          className="tooltip-warning bg-warning text-warning-content shadow-sm"
          info={warnings.map((x) => x.message).join(" / ")}
        >
          {warnings.length}
        </Indicator>
      )}
      {errors.length > 0 && (
        <Indicator
          className="tooltip-error bg-error text-error-content shadow-sm"
          info={errors.map((x) => x.message).join(" / ")}
        >
          {errors.length}
        </Indicator>
      )}
      {activity.totalRecords > 0 && (
        <Indicator
          className="tooltip-info bg-info text-info-content shadow-sm"
          info={activity.records.map((x) => x.title).join(" / ")}
        >
          {activity.totalRecords}
        </Indicator>
      )}
    </div>
  );
};

export default Servarr;
