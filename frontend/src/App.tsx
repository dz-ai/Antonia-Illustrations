import './styles/app.scss'
import {Header} from "./layout/header/header";
import {Footer} from "./layout/footer/footer";
import {Outlet, useLocation} from "react-router-dom";
import React from "react";

function App() {
    const location = useLocation();


    console.log(location.pathname);

    return (
        <div className="app">
            {
                location.pathname !== "/register" ?

                    <>
                        <Header/>
                        <div className="content-footer-wrapper">
                            <Outlet/>
                            <Footer/>
                        </div>
                    </>

                    :

                    <Outlet/>

            }


        </div>
    )
}

export default App
