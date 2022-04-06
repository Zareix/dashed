import { ReactNode } from "react";

import styled from "styled-components";

import useScroll from "../../hooks/scroll";

import data from "../../../public/data.json";
import NavLink from "./Nav/NavLink";

const Header = styled.header`
  position: sticky;
  top: 1rem;
  width: 90%;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 16px;
`;

const SideBar = styled.section`
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 2rem 1rem;
`;

type LayoutProps = {
  children?: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { scrolled } = useScroll();

  return (
    <div className="flex">
      <SideBar className="min-w-[20vw]">
        <div className="p-6">
          <h2 className="mx-auto mb-2 pb-1 text-center">Dashboard</h2>
          <hr className="mx-auto w-3/4" />
          <ul className="mt-4">
            {data.links.map((link, index) => (
              <NavLink key={index} {...link}></NavLink>
            ))}
          </ul>
        </div>
      </SideBar>
      {/*<div className="w-full">
        <Header
          className={`flex items-center bg-opacity-50 backdrop-blur-sm transition-all duration-300 ${
            scrolled ? "bg-white shadow-md" : ""
          }`}
        >
          {imgSrc && (
            <img
              src={imgSrc}
              className="mr-2 aspect-square w-12 object-contain"
            />
          )}
          <h1 className="text-4xl">{title}</h1>
        </Header>
      </div>*/}
      <main className="mr-4 mt-10 w-full">{children}</main>
    </div>
  );
};

export default Layout;
