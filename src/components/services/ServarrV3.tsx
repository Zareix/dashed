import { useQuery } from "react-query";
import styled from "styled-components";

import { Application } from "../../models/Applications";
import { sonarrFetchActivity, sonarrFetchStatus } from "../../utils/api";

const REFETCH_INTERVAL = 15 * 1000;

const Warning = styled.div`
  position: relative;
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;

  &::after {
    --scale: 0;
    content: "${(props: { warning: string }) => props.warning}";
    position: absolute;
    bottom: 110%;
    left: 50%;
    z-index: 1;
    transform: translateX(-50%) scale(var(--scale));
    transition: transform ease 250ms 100ms;
    transform-origin: bottom;
    padding: 0.25rem 0.5rem;
    width: max-content;
    max-width: 10rem;
    max-height: 8rem;
    overflow-y: scroll;
    border-radius: 8px;
    font-size: 1rem;
    white-space: pre-wrap;
    color: white;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
      0 8px 10px -6px rgb(0 0 0 / 0.1);
    background-color: inherit;
  }

  &:hover::after {
    --scale: 1;
  }

  .discret & {
    padding: 0.1rem 0.4rem;
    font-size: 0.875rem;
    line-height: 1.25rem;

    &:hover::after {
      --scale: 0;
    }
  }
`;

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
  discret?: boolean;
};

const ServarrV3 = ({ app, discret }: Props) => {
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
    <div className={`flex gap-2 ${discret ? "discret" : ""}`}>
      {warnings.length > 0 && (
        <Warning
          className="bg-orange-400 text-gray-50 shadow-sm"
          warning={warnings.map((x) => x.message).join("\\A")}
        >
          {warnings.length}
        </Warning>
      )}
      {errors.length > 0 && (
        <Warning
          className="bg-red-500 text-gray-50 shadow-sm"
          warning={errors.map((x) => x.message).join("\\A")}
        >
          {errors.length}
        </Warning>
      )}
      {activity.totalRecords > 0 && (
        <Warning
          className="bg-cyan-500 text-gray-50 shadow-sm"
          warning={activity.records.map((x) => x.title).join("\\A")}
        >
          {activity.totalRecords}
        </Warning>
      )}
    </div>
  );
};

export default ServarrV3;
