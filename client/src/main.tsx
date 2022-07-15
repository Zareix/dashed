import React from "react";
import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "react-query";
import AppDataProvider from "./components/context/AppDataContext";
import ThemeHandler from "./components/layout/theme/ThemeHandler";

const queryClient = new QueryClient();

import "./global.css";

import MainApp from "./MainApp";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Could not find root");
}
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeHandler />
      <AppDataProvider>
        <MainApp />
      </AppDataProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
