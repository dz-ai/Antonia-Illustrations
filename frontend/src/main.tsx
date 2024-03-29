import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/Index.scss'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import Portfolio from "./pages/portfolio-Page/portfolio";/* mobx subscriber */
import {ErrorPage} from "./pages/errorPage/errorPage";
import {HomePage} from "./pages/homePage/homePage";
import AboutMePage from "./pages/about-mePage/aboutMePage";
import RegisterPage from "./pages/registerPage/registerPage";/* mobx subscriber */
import {PopupProvider} from "./components/popupMessage/popupMessage";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={<App/>}
            errorElement={<ErrorPage/>}
        >
            <Route index element={<HomePage/>}/>
            <Route path="/portfolio" element={<Portfolio/>}/>
            <Route path="/about-me" element={<AboutMePage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
        </Route>
    )
);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <PopupProvider>
            <RouterProvider router={router}/>
        </PopupProvider>
    </React.StrictMode>
)
