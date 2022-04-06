import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

import "./global.scss";

import Home from "./pages/Home";
import App from "./pages/apps/App";
import Layout from "./components/layout/Layout";
import Category from "./pages/Category";

ReactDOM.render(
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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
