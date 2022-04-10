import { useMatch, useResolvedPath } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Category } from "../../../models/Category";
import { Button } from "../../ui/Button";
import DynamicIcon from "../../ui/DynamicIcon";

import NavLink from "./NavLink";

const expand = (n: number) => keyframes`
    to {
        max-height: ${n * 5}rem;
    }
`;

const AppLinksList = styled.div`
  max-height: ${(props: { opened: boolean; nbItems: number }) =>
    props.opened ? props.nbItems * 5 : "0"}rem;
  overflow: hidden;
  transition: max-height 500ms ease;
`;

type CatLinkProps = {
  category: Category;
  index: number;
  opened: boolean;
  open: Function;
};

const CatLink = ({ category, index, open, opened }: CatLinkProps) => {
  const resolved = useResolvedPath(`categories/${index}`);
  const match = useMatch({
    path: resolved.pathname,
    end: false,
  });

  return (
    <div>
      <Button
        className={`flex w-full items-center ${match ? "font-bold" : ""}`}
        onClick={() => open(index)}
      >
        {category.icon && (
          <div className="mr-2 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 p-2 text-white shadow-md dark:from-cyan-500 dark:to-cyan-700">
            <DynamicIcon icon={category.icon} size={18} />
          </div>
        )}
        {category.name}
      </Button>
      <AppLinksList
        className="ml-6 border-l-2 pl-3"
        nbItems={category.apps.length}
        opened={opened}
      >
        {category.apps.map((app, j) => (
          <NavLink
            key={`${index}/${j}`}
            link={`categories/${index}/apps/${j}`}
            name={app.name}
            image={app.image}
          />
        ))}
      </AppLinksList>
    </div>
  );
};

export default CatLink;
