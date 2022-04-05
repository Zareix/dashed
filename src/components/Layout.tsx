import React from "react";

import styled from "styled-components";
import { AiTwotoneHome } from "react-icons/ai";

import useScroll from "../hooks/scroll";

import data from "../../public/data.json";

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
  children?: React.ReactNode;
  title: string;
  imgSrc?: string;
};

const Layout = ({ children, title, imgSrc }: LayoutProps) => {
  const { scrolled } = useScroll();

  return (
    <div className="flex">
      <SideBar className="min-w-[20vw]">
        <div className="p-6">
          <h1 className="mx-auto mb-2 pb-1 text-center">Dashboard</h1>
          <hr className="mx-auto w-3/4" />
          <ul className="mt-4">
            {data.links.map((l, index) => (
              <li key={index}>
                <a
                  href={l.link}
                  className="flex items-center rounded-md p-2 transition-colors duration-300 hover:bg-cyan-100 dark:hover:bg-cyan-700 dark:hover:bg-opacity-50"
                >
                  <div className="mr-2 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 p-2 text-white shadow-md dark:from-cyan-500 dark:to-cyan-700">
                    <AiTwotoneHome size={18} />
                  </div>
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </SideBar>
      <div className="w-full">
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
        <main className="mr-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
