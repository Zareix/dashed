import { useQuery } from "react-query";

import { Application } from "../../models/Applications";
import { sonarrFetchActivity, sonarrFetchStatus } from "../../utils/api";
import { Indicator } from "../ui/Indicator";

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
};

const ServarrV3 = ({ app }: Props) => {
  const { data: status, isLoading } = useQuery(
    `${app.name.toLowerCase()}_status`,
    () => sonarrFetchStatus(app.url, app.apiKey),
    {
      refetchInterval: REFETCH_INTERVAL,
    }
  );

  const { data: activity, isLoading: isActLoading } = useQuery(
    `${app.name.toLowerCase()}_activity`,
    () => sonarrFetchActivity(app.url, app.apiKey),
    {
      refetchInterval: REFETCH_INTERVAL,
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
          className="bg-orange-400 text-gray-50 shadow-sm"
          info={warnings.map((x) => x.message).join("\\A")}
        >
          {warnings.length}
        </Indicator>
      )}
      {errors.length > 0 && (
        <Indicator
          className="bg-red-500 text-gray-50 shadow-sm"
          info={errors.map((x) => x.message).join("\\A")}
        >
          {errors.length}
        </Indicator>
      )}
      {activity.totalRecords > 0 && (
        <Indicator
          className="bg-cyan-500 text-gray-50 shadow-sm"
          info={activity.records.map((x) => x.title).join("\\A")}
        >
          {activity.totalRecords}
        </Indicator>
      )}
    </div>
  );
};

export default ServarrV3;
