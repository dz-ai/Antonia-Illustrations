import React, {useEffect, useRef, useState} from "react";
import {categories} from "../../types/types";
import {MdArrowBackIosNew, MdArrowForwardIos} from "react-icons/md";


export function CategoryNavBar({categories}: { categories: categories }) {
    const ref = useRef<HTMLDivElement>(null);

    const [isOverFlow, setIsOverFlow] = useState<boolean>(false);

    // set isOverFlow to false or true according to screen size.
    useEffect(() => {
        const handleResize = () => {
            if (ref.current) {
                const isVisible = ref.current.scrollWidth > ref.current.offsetWidth;
                setIsOverFlow(isVisible);
            }
        };

        handleResize(); /* check screen size at load time */

        /* trigger handleResize(); if we change screen size after load */
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    // trigger scroll by clicking the arrows.
    const handleClick = (direction: string) => {
        if (direction === "left") {
            (ref.current as HTMLDivElement).scrollBy({
                left: -150,
                behavior: 'smooth'
            });
        } else if (direction === "right") {
            (ref.current as HTMLDivElement).scrollBy({
                left: 150,
                behavior: 'smooth'
            });
        }
    };

    return (

        <div className="nav-wrapper">
            {
                isOverFlow &&
                <>
                    <div
                        className="scroll-btn-l"
                        onClick={() => handleClick('right')}>
                        <MdArrowForwardIos/>
                    </div>
                    <button
                        className="scroll-btn-r"
                        onClick={() => handleClick('left')}>
                        <MdArrowBackIosNew/>
                    </button>
                </>
            }
            <div
                className="nav"
                ref={ref}
                style={{
                    width: isOverFlow ? '95%' : '100%',
                    justifyContent: isOverFlow ? 'unset' : 'center',
                }}
            >
                {
                    categories.map((category, index) =>
                        <div key={index}>{category}</div>
                    )
                }
            </div>
        </div>
    );
}