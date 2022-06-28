import { useEffect } from "react";
import { useLocation, useMatch, useResolvedPath } from "react-router-dom";
import styled from "styled-components";
import { Category } from "../../../models/Category";
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
      <button
        className={`flex w-full items-center rounded-md p-2 hover:bg-primary hover:bg-opacity-5 ${
          match ? "font-bold" : ""
        }`}
        onClick={() => open(index)}
      >
        {category.icon && (
          <div
            className={`btn btn-primary btn-square btn-sm shadow-md ${
              isWorkspace ? "mx-auto" : "mr-2"
            }`}
          >
            <DynamicIcon icon={category.icon} size={18} />
          </div>
        )}
        {!isWorkspace && <span>{category.name}</span>}
      </button>
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
