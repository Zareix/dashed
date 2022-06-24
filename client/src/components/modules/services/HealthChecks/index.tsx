import styled from "styled-components";

import HealthCheckJSON from "./HealthCheckJSON";

type PropsHealthchecks = {
  sources?: string[] | string;
};

type PropsHealthcheck = {
  src: string;
};

const Wrapper = styled.div`
  max-width: 50%;

  .discret & {
    max-width: 100%;
  }
`;

const Badge = styled.img`
  .discret & {
    display: none;
  }
`;

const HealthChecks = ({ sources }: PropsHealthchecks) => {
  if (!sources) return <></>;
  if (Array.isArray(sources))
    return (
      <Wrapper className="ml-auto flex flex-wrap justify-end gap-1">
        {sources.map((h) => (
          <HealthCheck src={h} />
        ))}
      </Wrapper>
    );
  else return <HealthCheck src={sources} />;
};

const HealthCheck = ({ src }: PropsHealthcheck) => {
  if (!src) return <></>;

  if (src.endsWith("svg"))
    return (
      <div className="flex  w-full items-center justify-end">
        <Badge src={src} />
      </div>
    );

  if (src.endsWith("json")) return <HealthCheckJSON src={src} />;

  return <></>;
};

export default HealthChecks;
