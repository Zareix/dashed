import styled from "styled-components";

type CardProps = {
  className: string;
};

export const SimpleCard = styled.article.attrs<CardProps>(() => ({
  className: `bg-white shadow dark:bg-slate-800`,
}))`
  border-radius: 16px;
  padding: 1.2rem 1rem;
`;

export const FlexCard = styled(SimpleCard)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
