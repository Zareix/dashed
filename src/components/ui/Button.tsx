import styled from "styled-components";

type ButtonProps = {
  className: string;
};

export const Button = styled.button.attrs<ButtonProps>(() => ({
  className: `rounded-md p-2 transition-all duration-300 hover:bg-cyan-100 
                  dark:hover:bg-cyan-700 dark:hover:bg-opacity-50`,
}))``;
