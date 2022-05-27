import styled from "styled-components";

type ButtonProps = {
  className: string;
};

export const Button = styled.button.attrs<ButtonProps>(() => ({
  className:
    "rounded-md p-2 transition-all duration-300 bg-white dark:bg-gray-800 hover:bg-cyan-100 dark:hover:bg-cyan-700 dark:hover:bg-opacity-50",
}))``;

export const ButtonSuccess = styled(Button).attrs<ButtonProps>(() => ({
  className:
    "px-2 py-1 bg-emerald-300 dark:bg-emerald-800 hover:bg-emerald-400 dark:hover:bg-emerald-700 dark:hover:bg-opacity-100",
}))``;
