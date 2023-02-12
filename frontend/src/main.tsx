import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/Index.scss'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {PortfolioShop} from "./pages/portfolio-shop/portfolio-shop";
import {ErrorPage} from "./pages/errorPage/errorPage";
import {HomePage} from "./pages/home/homePage";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={<App/>}
            errorElement={<ErrorPage/>}
        >
            <Route index element={<HomePage/>} />
            <Route path="/portfolio-shop/:page" element={<PortfolioShop/>} />
        </Route>
    )
);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
