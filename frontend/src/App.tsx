import './styles/app.scss'
import {Header} from "./layout/header/header";
import {Footer} from "./layout/footer/footer";
import {Outlet} from "react-router-dom";
import React from "react";

function App() {

  return (
    <div className="app">
        <Header />
        
        <div className="content-footer-wrapper">
            <Outlet/>
            <Footer/>
        </div>
        
    </div>
  )
}

export default App
