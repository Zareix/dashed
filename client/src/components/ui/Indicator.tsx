import styled from "styled-components";

type IndicatorAttrs = {
  info: string;
};

export const Indicator = styled.div.attrs<IndicatorAttrs>((props) => ({
  className: "tooltip shadow-sm",
  "data-tip": props.info,
}))<IndicatorAttrs>`
  position: relative;
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;

  .discret & {
    padding: 0.1rem 0.4rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
`;

export const Enabled = styled.div`
  margin-right: 0.25rem;
  width: 7px;
  height: 7px;
  background-color: #a6a8f2;
  box-shadow: 0 0 5px 1px #a6a8f2;
  border-radius: 100vw;
`;

export const Disabled = styled.div`
  margin-right: 0.25rem;
  width: 7px;
  height: 7px;
  background-color: red;
  box-shadow: 0 0 5px 1px red;
  border-radius: 100vw;
`;
