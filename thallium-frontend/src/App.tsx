import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import React, { Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import themes from "./themes.tsx";

import Header from "./components/Header";
import LoadingBar from "./components/LoadingBar";

const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const ErrorPage = React.lazy(() => import("./pages/ErrorPage"));
const DesignSystem = React.lazy(() => import("./pages/DesignSystem"));
const StorePage = React.lazy(() => import("./pages/StorePage"));
const CheckoutPage = React.lazy(() => import("./pages/CheckoutPage"));

import { maybeRefreshTask } from "./api/jwt";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./styles/toast-overrides.css";
import { useMediaQuery } from "./utils/hooks.ts";


const GlobalStyle = createGlobalStyle`
  html,
  body, #root {
    margin: 0;
    padding: 0;
    font-family: 'Fira Code Variable', monospace;
    background-color: ${({ theme }) => theme.backgroundColor};
    color: ${({ theme }) => theme.textColor};
    height: 100%;
  }

  a:not(.Header-bar) {
    color: ${({ theme }) => theme.linkColor};
    text-decoration: none;
    transition: border-bottom 0.2s;
    border-bottom: 1px dotted transparent;
  }

  a:not(.Header-bar):hover {
    border-bottom: 1px dotted ${({ theme }) => theme.linkColor};
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-left: 10px;
  margin-right: 10px;
  height: 100%;
`;

const BodySeparator = styled.div`
flex-grow: 1;
`;

const ContentContainer = styled.div`
  align-self: center;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const FooterHolder = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/design-system",
    element: <DesignSystem />,
    errorElement: <ErrorPage />
  },
  {
    path: "/store",
    element: <StorePage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
    errorElement: <ErrorPage />
  }
]);


function App() {
  const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  maybeRefreshTask();

  const theme = isDarkMode ? themes.dark : themes.light;

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDarkMode ? "dark" : "light"}

        />
        <GlobalStyle />
        <ContentContainer>
          <Header />
          <Suspense fallback={<LoadingBar />}>
            <RouterProvider router={router} />
          </Suspense>
        </ContentContainer>

        <BodySeparator />

        <FooterHolder>
          <p>
            Made with <span role="img" aria-label="aliens">👾</span> by Owl Corp &bull; Thallium {VITE_APP_VERSION} ({VITE_COMMIT_HASH})
          </p>
        </FooterHolder>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
