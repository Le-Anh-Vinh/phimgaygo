import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SharedLayout from "./ui/SharedLayout/SharedLayout";
import { QueryClient, QueryClientProvider } from "react-query";
import config from "./data/Datasource/Config";
import Screens, { MediaType } from "./utils/Screen";
import { ReactQueryDevtools } from "react-query/devtools";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";

// #LazyImport
const Home = React.lazy(() => import("./ui/Home/Home"));

const MovieDetail = React.lazy(() => import("./ui/Details/MovieDetail"));
const TVShowDetail = React.lazy(() => import("./ui/Details/TVShowDetail"));

const TVShowDiscover = React.lazy(() => import("./ui/Discover/TVShowDiscover"));
const MovieDiscover = React.lazy(() => import("./ui/Discover/MovieDiscover"));

const Search = React.lazy(() => import("./ui/Search/Search"));

const About = React.lazy(() => import("./ui/About/About"));
const SignIn = React.lazy(() => import("./ui/Auth/SignIn"));
const SignUp = React.lazy(() => import('./ui/Auth/SignUp'))
const History = React.lazy(() => import('./ui/History/History'))
const Library = React.lazy(() => import('./ui/Library/Library'))
const NotFound = React.lazy(() => import("./ui/SharedLayout/NotFound"));
// #endLazyImport

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: 'rgba(240, 46, 170, 1)',
            contrastText: 'black'
        }
    },
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: config.timeShort,
            refetchOnMount: true,
            staleTime: config.timeShort,
        },
    },
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <SharedLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: Screens.Search,
                element: <Search />,
            },
            {
                path: MediaType.Movie + Screens.Detail,
                element: <MovieDetail />,
            },
            // {
            //     path: MediaType.TVShow + Screens.Detail,
            //     element: <TVShowDetail />,
            // },
            // {
            //     path: Screens.TVDiscover,
            //     element: <TVShowDiscover />,
            // },
            {
                path: Screens.MovieDiscover,
                element: <MovieDiscover />
            },
            // {
            //     path: Screens.SignIn,
            //     element: <SignIn/>,
            // },
            // {
            //     path: Screens.SignUp,
            //     element: <SignUp/>
            // },
            // {
            //     path: Screens.About,
            //     element: <About />,
            // },
            // {
            //     path: Screens.History,
            //     element: <History />,
            // },
            // {
            //     path: Screens.Library,
            //     element: <Library />
            // },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={darkTheme}>
                <RouterProvider router={router} />
                {import.meta.env.DEV && (
                    <ReactQueryDevtools initialIsOpen={false} />
                )}
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
