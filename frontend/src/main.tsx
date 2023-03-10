import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/Index.scss'
import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from "react-router-dom";
import {PortfolioShop} from "./pages/portfolio-shop-Page/portfolio-shop";
import {ErrorPage} from "./pages/errorPage/errorPage";
import {HomePage} from "./pages/homePage/homePage";
import {CartPage} from "./pages/cartPage/cartPage";
import {CheckoutPage} from "./pages/checkoutPage/checkoutPage";
import {AboutMePage} from "./pages/about-mePage/aboutMePage";
import {RegisterPage} from "./pages/registerPage/registerPage";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={<App/>}
            errorElement={<ErrorPage/>}
        >
                <Route index element={<HomePage/>}/>
                <Route path="/portfolio-shop/:page" element={<PortfolioShop/>}/>
                <Route path="/cart" element={<CartPage/>}/>
                <Route path="/checkout" element={<CheckoutPage/>}/>
                <Route path="/about-me" element={<AboutMePage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
        </Route>
    )
);





ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
)
