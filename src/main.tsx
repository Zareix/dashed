import React from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

import "./global.scss";

import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import App from "./pages/apps/App";
import Category from "./pages/Category";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Could not find root");
}
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="categories/:catIndex" element={<Category />} />
            <Route
              path="categories/:catIndex/apps/:appIndex"
              element={<App />}
            />
          </Routes>
        </Layout>
      </BrowserRouter>
      {!import.meta.env.VITE_PROD && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  </React.StrictMode>
);
