import { ReactNode, useEffect, useState } from "react";

import styled from "styled-components";
import { AiOutlineMenu } from "react-icons/ai";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";

import data from "data.json";

import NavLink from "./nav/NavLink";
import CatLink from "./nav/CatLink";
import { Link, useLocation } from "react-router-dom";
import useScroll from "../../hooks/scroll";
import useWindowWidth from "../../hooks/windowWidth";

const SideBar = styled.section`
  position: sticky;
  top: 0;
  height: 100vh;
  min-width: 20vw;
  padding: 2rem 1rem;
  padding: 1.5rem;
`;

type LayoutProps = {
  children?: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [opened, setOpened] = useState(-1);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const { pathname } = useLocation();
  const { scrolled } = useScroll(10);
  const { isMobile } = useWindowWidth();

  useEffect(() => {
    setIsDrawerOpened(false);
  }, [pathname]);

  const open = (index: number) => setOpened(opened === index ? -1 : index);

  return (
    <>
      {!isMobile && (
        <SideBar>
          <h2 className="mx-auto mb-2 pb-1 text-center">Dashboard</h2>
          <hr className="mx-auto w-3/4" />
          <nav>
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
          </nav>
        </SideBar>
      )}
      {isMobile && (
        <>
          <section
            className={`custom-bg sticky top-0 z-40 block px-4 py-3 text-center transition-shadow ${
              scrolled || isDrawerOpened ? "shadow-md" : ""
            }`}
          >
            <Link to="/">
              <h1 className="mx-auto mb-0 w-max">Dashboard</h1>
            </Link>
            <button
              onClick={() => setIsDrawerOpened(!isDrawerOpened)}
              className="absolute right-6 top-1/2 -translate-y-1/2"
            >
              <AiOutlineMenu size={35} />
            </button>
          </section>
          <nav
            className={`custom-bg fixed z-30 ml-auto h-full w-2/3 px-4 pt-4 transition-all duration-300 ${
              isDrawerOpened ? "right-0" : "-right-full"
            }`}
            onClickCapture={console.log}
          >
            <ul className="max-h-[80vh] overflow-y-auto">
              {data.links.map((link, i) => (
                <li
                  onClick={() => {
                    setOpened(-1);
                    setIsDrawerOpened(false);
                  }}
                  key={i}
                >
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
          </nav>
          {isDrawerOpened && (
            <div
              onClick={() => setIsDrawerOpened(false)}
              className="fixed inset-0 z-20 h-screen w-screen bg-gray-900 bg-opacity-20 backdrop-blur-sm"
            />
          )}
        </>
      )}
      <main className="min-h-screen w-full px-4 pb-10 sm:mx-4 sm:mt-6 sm:ml-0 sm:p-0">
        {children}
      </main>
    </>
  );
};

export default Layout;
