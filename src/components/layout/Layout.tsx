import { ReactNode, useState } from "react";

import styled from "styled-components";

import data from "data.json";

import NavLink from "./nav/NavLink";
import CatLink from "./nav/CatLink";

const SideBar = styled.section`
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 2rem 1rem;
  padding: 1.5rem;
`;

type LayoutProps = {
  children?: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [opened, setOpened] = useState(-1);

  const open = (index: number) => setOpened(opened === index ? -1 : index);

  return (
    <div className="flex">
      <SideBar className="min-w-[20vw]">
        <h2 className="mx-auto mb-2 pb-1 text-center">Dashboard</h2>
        <hr className="mx-auto w-3/4" />
        <ul className="mt-4 max-h-[80vh] overflow-y-auto">
          {data.links.map((link, i) => (
            <li onClick={() => setOpened(-1)} key={i}>
              <NavLink {...link} />
            </li>
          ))}
          {data.categories.map((cat, j) => (
            <li key={j}>
              <CatLink
                category={cat}
                index={j}
                open={open}
                opened={opened === j}
              />
            </li>
          ))}
        </ul>
      </SideBar>
      <main className="mr-4 mt-6 min-h-screen w-full pb-10">{children}</main>
    </div>
  );
};

export default Layout;
