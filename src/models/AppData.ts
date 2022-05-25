import { Category } from "./Category";

export type AppData = {
  links: CustomLink[];
  categories: Category[];
};

type CustomLink = {
  name: string;
  link: string;
  icon: string;
};
