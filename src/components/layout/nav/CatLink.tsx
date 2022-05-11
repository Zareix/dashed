import { useEffect } from "react";
import { useLocation, useMatch, useResolvedPath } from "react-router-dom";
import styled from "styled-components";
import { Category } from "../../../models/Category";
import { Button } from "../../ui/Button";
import DynamicIcon from "../../ui/DynamicIcon";

import NavLink from "./NavLink";

const AppLinksList = styled.div`
  max-height: ${(props: { opened: boolean; nbItems: number }) =>
    props.opened ? props.nbItems * 5 : "0"}rem;
  overflow-y: hidden;
  transition: max-height 500ms ease;
`;

type CatLinkProps = {
  category: Category;
  index: number;
  opened: boolean;
  open: Function;
  isWorkspace?: boolean;
};

const CatLink = ({
  category,
  index,
  open,
  opened,
  isWorkspace = false,
}: CatLinkProps) => {
  const location = useLocation();
  const resolved = useResolvedPath(`categories/${index}`);
  const match = useMatch({
    path: resolved.pathname,
    end: false,
  });

  useEffect(() => {
    if (match && !opened) open(index);
  }, [location]);

  return (
    <div>
      <Button
        className={`flex w-full items-center bg-transparent dark:bg-transparent ${
          match ? "font-bold" : ""
        }`}
        onClick={() => open(index)}
      >
        {category.icon && (
          <div
            className={`rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 p-2 text-white shadow-md dark:from-cyan-500 dark:to-cyan-700 ${
              isWorkspace ? "mx-auto" : "mr-2"
            }`}
          >
            <DynamicIcon icon={category.icon} size={18} />
          </div>
        )}
        {!isWorkspace && <span>{category.name}</span>}
      </Button>
      <AppLinksList
        className={
          isWorkspace ? "flex flex-col items-center" : "ml-6 border-l-2 pl-3"
        }
        nbItems={category.apps.length}
        opened={opened || isWorkspace}
      >
        {category.apps.map((app, j) => (
          <NavLink
            key={`${index}/${j}`}
            link={`categories/${index}/apps/${j}`}
            name={app.name}
            app={app}
            image={app.image}
            isWorkspace={isWorkspace}
          />
        ))}
      </AppLinksList>
    </div>
  );
};

export default CatLink;
