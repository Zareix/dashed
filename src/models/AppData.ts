import { Category } from "./Category";

export type AppData = {
  settings: {
    searchEngine: {
      default: string;
      display: string;
      autofocus: string;
      inApp: boolean;
    };
  };
  links: CustomLink[];
  categories: Category[];
};

type CustomLink = {
  name: string;
  link: string;
  icon: string;
};
