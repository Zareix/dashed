export type Application = {
  name: string;
  url: string;
  endpoint?: string;
  image: string;
  type?: string;
  apiKey?: string;
  endpoints?: string[];
  customLinks?: CustomLink[];
};

type CustomLink = {
  icon?: string;
  name: string;
  path: string;
};
