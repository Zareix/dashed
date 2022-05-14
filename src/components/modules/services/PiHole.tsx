import { useQuery } from "react-query";
import styled from "styled-components";

import { Application } from "../../../models/Applications";
import { piholeFetchStats } from "../../../utils/api";

const FETCH_INTERVAL = 10 * 1000;

const Enabled = styled.div`
  width: 7px;
  height: 7px;
  background-color: #a6a8f2;
  box-shadow: 0 0 5px 1px #a6a8f2;
  border-radius: 100vw;
`;

const Disabled = styled.div`
  width: 7px;
  height: 7px;
  background-color: red;
  box-shadow: 0 0 5px 1px red;
  border-radius: 100vw;
`;

type Props = {
  app: Application;
};

export const Pihole = ({ app }: Props) => {
  const { data: stats, isLoading } = useQuery(
    "pihole_stats",
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
    "pihole_stats",
    () => piholeFetchStats(app.url),
    {
      refetchInterval: FETCH_INTERVAL,
    }
  );

  if (isLoading || !stats) {
    return <div>...</div>;
  }

  return (
    <div>
      {stats.ads_percentage_today.toLocaleString(window.navigator.language, {
        maximumFractionDigits: 2,
      })}
      %
    </div>
  );
};
