import React from "react";
import styled from "styled-components";

const BaseCard = styled.article`
  border-radius: 16px;
  padding: 1.2rem 1rem;
`;

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export const SimpleCard = (props: Props) => (
  <BaseCard {...props} className={props.className + " bg-white shadow"}>
    {props.children}
  </BaseCard>
);

export const FlexCard = styled(SimpleCard)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
