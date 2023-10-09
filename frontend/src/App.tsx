import './styles/app.scss'
import Header from "./layout/header/header";
import {Footer} from "./layout/footer/footer";
import {Outlet, useLocation} from "react-router-dom";
import React, {useEffect, useRef} from "react";
import store from "./store";

function App() {
    const location = useLocation();

    useEffect(() => {
        store.verifyToken()
            .then().catch(e => console.log(e));
        store.getCategories();
    }, [store.logOut]);

    const startYRef = useRef(0);
    const endYRef = useRef(0);
    const contentFooterRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            if (contentFooterRef.current?.scrollTop === 0) {
                startYRef.current = e.touches[0].clientY;
            }
        }

        const handleTouchEnd = (e: TouchEvent) => {
            if (contentFooterRef.current?.scrollTop === 0) {
                endYRef.current = e.changedTouches[0].clientY;

                // Calculate the vertical distance of the swipe
                const swipeDistance = endYRef.current - startYRef.current;

                // Define a threshold for a successful swipe (adjust as needed)
                const swipeThreshold = 300;

                // Check if the swipe distance exceeds the threshold
                if (swipeDistance > swipeThreshold) {
                    window.location.reload();
                }
            }
        }

        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchend", handleTouchEnd);

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);

    return (
        <div className="app">
            {
                location.pathname !== "/register" ?

                    <>
                        <Header/>
                        <div className="content-footer-wrapper" ref={contentFooterRef}>
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
