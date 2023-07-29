import './styles/app.scss'
import Header from "./layout/header/header";
import {Footer} from "./layout/footer/footer";
import {Outlet, useLocation} from "react-router-dom";
import React, {useEffect} from "react";
import store from "./store";

function App() {
    const location = useLocation();

    useEffect(() => {
        store.verifyToken()
            .then().catch(e => console.log(e));
        store.getCategories();
    }, [store.logOut]);

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
