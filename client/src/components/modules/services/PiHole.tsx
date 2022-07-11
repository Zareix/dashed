import { useQuery } from "react-query";
import styled from "styled-components";

import { Application } from "../../../models/Applications";
import { piholeFetchStats } from "../../../utils/api";
import { Disabled, Enabled } from "../../ui/Indicator";

const FETCH_INTERVAL = 10 * 1000;

type Props = {
  app: Application;
};

export const Pihole = ({ app }: Props) => {
  const { data: stats, isLoading } = useQuery(
    ["pihole_stats", app.name],
    () => piholeFetchStats(app.url),
    {
      refetchInterval: FETCH_INTERVAL,
    }
  );

  if (isLoading || !stats) {
    return <></>;
  }

  return stats.status === "enabled" ? (
    <Enabled />
  ) : (
    <Disabled className="animate-pulse" />
  );
};

type DetailsProps = {
  app: Application;
};

export const PiholeDetails = ({ app }: DetailsProps) => {
  const { data: stats, isLoading } = useQuery(
    ["pihole_stats", app.name],
    () => piholeFetchStats(app.url),
    {
      refetchInterval: FETCH_INTERVAL,
    }
  );

  if (isLoading || !stats) {
    return <></>;
  }

  return (
    <p>
      {stats.ads_percentage_today.toLocaleString(window.navigator.language, {
        maximumFractionDigits: 2,
      })}
      %
    </p>
  );
};
