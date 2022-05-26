import { ReactNode, useEffect, useState } from "react";

import styled from "styled-components";
import { AiOutlineMenu } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { FiCommand } from "react-icons/fi";
import { useKBar } from "kbar";

import data from "data.json";

import NavLink from "./nav/NavLink";
import CatLink from "./nav/CatLink";
import useScroll from "../../hooks/scroll";
import useWindowWidth from "../../hooks/windowWidth";

const SideBar = styled.section`
  position: sticky;
  top: 0;
  height: 100vh;
  min-width: ${(props: SideBarProps) => (props.workspace ? "auto" : "20vw")};
  padding-top: 1.5rem;
  padding-inline: ${(props: SideBarProps) =>
    props.workspace ? "0" : "1.5rem"};
`;

type SideBarProps = {
  workspace?: boolean;
};

type LayoutProps = {
  children?: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [opened, setOpened] = useState(-1);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const [isWorkspace, setIsWorkspace] = useState(false);
  const { pathname } = useLocation();
  const { scrolled } = useScroll(10);
  const { isMobile } = useWindowWidth();
  const { query } = useKBar();

  useEffect(() => {
    setIsDrawerOpened(false);
    setIsWorkspace(/categories\/[0-9]\/apps\/[0-9]/.test(pathname));
  }, [pathname]);

  const openKbar = () => {
    query.toggle();
  };

  const open = (index: number) => setOpened(opened === index ? -1 : index);

  return (
    <>
      {!isMobile && (
        <SideBar workspace={isWorkspace}>
          {!isWorkspace && (
            <>
              <h2 className="mx-auto mb-2 pb-1 text-center">Dashboard</h2>
              <hr className="mx-auto w-3/4" />
            </>
          )}
          <nav>
            <ul className="mt-4 flex max-h-[85vh] flex-col gap-1 overflow-y-auto">
              {data.links.map((link, i) => (
                <li
                  onClick={() => setOpened(-1)}
                  key={"link" + i}
                  className="custom-bg sticky top-0"
                >
                  <NavLink {...link} isWorkspace={isWorkspace} />
                </li>
              ))}
              {data.categories.map((cat, j) => (
                <li key={"cat" + j}>
                  <CatLink
                    category={cat}
                    index={j}
                    open={open}
                    opened={opened === j}
                    isWorkspace={isWorkspace}
                  />
                </li>
              ))}
              <li>
                <NavLink
                  link="/config"
                  name="Config"
                  icon="MdSettings"
                  isWorkspace={isWorkspace}
                />
              </li>
            </ul>
          </nav>
        </SideBar>
      )}
      {isMobile && (
        <>
          <section
            className={`custom-bg sticky top-0 z-40 flex justify-between px-4 py-3 text-center transition-shadow ${
              scrolled || isDrawerOpened ? "shadow-md" : ""
            }`}
          >
            <button onClick={openKbar}>
              <FiCommand size={30} />
            </button>
            <Link to="/">
              <h1 className="mx-auto mb-0 ">Dashboard</h1>
            </Link>
            <button onClick={() => setIsDrawerOpened(!isDrawerOpened)}>
              <AiOutlineMenu size={35} />
            </button>
          </section>
          <nav
            className={`custom-bg fixed z-30 ml-auto h-full w-2/3 px-4 pt-4 transition-all duration-300 ${
              isDrawerOpened ? "right-0" : "-right-full"
            }`}
            onClickCapture={console.log}
          >
            <ul className="flex max-h-[80vh] flex-col  gap-1 overflow-y-auto">
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
      <main className="min-h-screen w-full px-4 pb-10 sm:mx-4 sm:ml-0 sm:p-0 sm:pt-6">
        {children}
      </main>
    </>
  );
};

export default Layout;
