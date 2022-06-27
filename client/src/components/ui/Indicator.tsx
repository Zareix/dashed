import styled from "styled-components";

export const Indicator = styled.div`
  position: relative;
  padding: 0.2rem 0.5rem;
  border-radius: 0.375rem;

  /* Tooltip */
  &::after {
    --scale: 0;
    content: "${(props: { info: string }) => props.info}";
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

  &.tooltip-bottom::after {
    top: auto;
    bottom: 0rem;
    transform: translateX(-50%) translateY(110%) scale(var(--scale));
    transform-origin: top;
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
