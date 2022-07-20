import { Application } from "./Applications";

export type Category = {
  name: string;
  icon: string;
  small: boolean;
  apps: Application[];
};
