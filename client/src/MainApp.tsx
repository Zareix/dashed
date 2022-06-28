import { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import ScrollToTop from "./utils/scrollToTop";
import App from "./pages/apps/App";
import CommandPalette from "./components/modules/CommandPalette";
import Config from "./pages/config/Config";

const MainApp = () => {
  useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered : ", r);
    },
    onRegisterError(error) {
      console.log("SW registration", error);
    },
  });

  useEffect(() => {
    const setDarkTheme = () =>
      document.documentElement.setAttribute(
        "data-theme",
        localStorage.getItem("darkTheme") ?? "dark"
      );
    const setLightTheme = () =>
      document.documentElement.setAttribute(
        "data-theme",
        localStorage.getItem("lightTheme") ?? "light"
      );

    const lightTheme = localStorage.getItem("lightTheme");
    const darkTheme = localStorage.getItem("darkTheme");
    if (lightTheme && lightTheme !== "" && darkTheme && darkTheme !== "") {
      const isOSDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      isOSDark ? setDarkTheme() : setLightTheme();
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (event) => {
          event.matches ? setDarkTheme() : setLightTheme();
        });
    } else {
      document.documentElement.setAttribute(
        "data-theme",
        localStorage.getItem("theme") ?? "light"
      );
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <CommandPalette>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/config" element={<Config />} />
              <Route
                path="categories/:catIndex/apps/:appIndex"
                element={<App />}
              />
            </Routes>
          </Layout>
        </CommandPalette>
        <ToastContainer />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};

export default MainApp;
