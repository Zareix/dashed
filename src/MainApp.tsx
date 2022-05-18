import { useRegisterSW } from "virtual:pwa-register/react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import ScrollToTop from "./utils/scrollToTop";
import App from "./pages/apps/App";
import CommandPalette from "./components/modules/CommandPalette";

const MainApp = () => {
  useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered : ", r);
    },
    onRegisterError(error) {
      console.log("SW registration", error);
    },
  });

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <CommandPalette>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="categories/:catIndex/apps/:appIndex"
                element={<App />}
              />
            </Routes>
          </Layout>
        </CommandPalette>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
};

export default MainApp;
