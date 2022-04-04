import React, { ReactChild } from "react";

import styled from "styled-components";
import { AiTwotoneHome } from "react-icons/ai";

import useScroll from "../hooks/scroll";

import data from "../../assets/data.json";

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
  children: ReactChild;
  title: string;
  imgSrc?: string;
};

const Layout = ({ children, title, imgSrc }: LayoutProps) => {
  const { scrolled } = useScroll();

  return (
    <div className="grid grid-cols-12">
      <SideBar className="col-span-2">
        <div className="h-full rounded-2xl bg-gray-50 p-6 shadow-xl dark:bg-gray-700">
          <h1 className="mb-2 border-b pb-4 ">Dashboard</h1>
          <ul className="mt-4">
            {data.links.map((l) => (
              <li>
                <a
                  href={l.link}
                  className="flex items-center rounded-lg p-2 transition-colors duration-300 hover:bg-cyan-100"
                >
                  <div className="mr-2 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 p-2 text-white shadow-md">
                    <AiTwotoneHome size={18} />
                  </div>
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </SideBar>
      <div className="col-span-10">
        <Header
          className={`flex bg-opacity-50 backdrop-blur-sm transition-all duration-300 ${
            scrolled ? "bg-white shadow-md" : ""
          }`}
        >
          {imgSrc && <img src={imgSrc} className="aspect-square w-10" />}
          <h1 className="text-4xl">{title}</h1>
        </Header>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
