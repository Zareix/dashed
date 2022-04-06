import { useMatch, useResolvedPath } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import NavLink from "./NavLink";

const expand = (n: number) => keyframes`
    to {
        max-height: ${n * 5}rem;
    }
`;

const AppLinksList = styled.div`
  max-height: 0;
  overflow: hidden;
  animation: ${(props: { nbItems: number }) => expand(props.nbItems)} 750ms
    forwards ease-out;
`;

type CatLinkProps = {
  category: {
    name: string;
    icon: string;
    apps: {
      url: string;
      image: string;
      name: string;
    }[];
  };
  index: number;
};

const CatLink = ({ category, index }: CatLinkProps) => {
  const resolved = useResolvedPath(`categories/${index}`);
  const match = useMatch({
    path: resolved.pathname,
    end: false,
  });

  return (
    <div>
      <NavLink {...category} link={`categories/${index}`} />
      {match && (
        <AppLinksList
          className="ml-6 border-l-2 pl-3"
          nbItems={category.apps.length}
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
      )}
    </div>
  );
};

export default CatLink;
