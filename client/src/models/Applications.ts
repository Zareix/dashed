import { AxiosRequestHeaders } from "axios";
export type Application = {
  name: string;
  url: string;
  image?: string;
  endpoint?: string;
  type?: string;
  apiKey?: string;
  subtitle?: string;
  endpoints?: string[];
  customLinks?: CustomLink[];
  healthCheck?: string | string[];
  external?: boolean;
  allowedStatusCode?: number[];
  headers?: AxiosRequestHeaders;
};

type CustomLink = {
  name: string;
  path: string;
  icon?: string;
};
