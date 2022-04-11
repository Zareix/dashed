import { useQuery } from "react-query";
import styled from "styled-components";

import { Application } from "../../models/Applications";
import { piholeFetchStats } from "../../utils/api";

const FETCH_INTERVAL = 10 * 1000;

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
    "pihole_status",
    () => piholeFetchStats(app.url),
    {
      refetchInterval: FETCH_INTERVAL,
    }
  );

  if (isLoading) {
    return <></>;
  }

  return stats?.status === "enabled" ? <></> : <Disabled />;
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

  return (
    <div>
      {stats?.ads_percentage_today.toLocaleString(window.navigator.language, {
        maximumFractionDigits: 2,
      })}
      %
    </div>
  );
};
