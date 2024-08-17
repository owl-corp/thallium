import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import themes from "./themes.tsx";

import Header from "./components/Header";

import LandingPage from "./pages/LandingPage";
import ErrorPage from "./pages/ErrorPage";
import DesignSystem from "./pages/DesignSystem";


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

  a {
    color: ${({ theme }) => theme.linkColor};
    text-decoration: none;
    transition: border-bottom 0.2s;
    border-bottom: 1px dotted transparent;
  }

  a:hover {
    border-bottom: 1px dotted ${({ theme }) => theme.linkColor};
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 800px;
  height: 100%;
`;

const BodySeparator = styled.div`
flex-grow: 1;
`;

const ContentContainer = styled.div`
  padding: 1rem;
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
  }
]);


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = isDarkMode ? themes.dark : themes.light;

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    setIsDarkMode(prefersDark);
  }, []);


  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <GlobalStyle />
        <ContentContainer>
          <Header />
          <RouterProvider router={router} />
        </ContentContainer>

        <BodySeparator />

        <div>
          <p>
            Made with <span role="img" aria-label="aliens">👾</span> by Owl Corp &bull; Thallium {VITE_APP_VERSION} ({VITE_COMMIT_HASH})
          </p>
        </div>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
