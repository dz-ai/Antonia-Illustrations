import React, {useEffect, useRef, useState} from "react";
import {MdArrowBackIosNew, MdArrowForwardIos} from "react-icons/md";
import store from "../../store";

interface Props {
    categories: string[];
}

export function CategoryNavBar({categories}: Props) {
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

    const handelNavBtnClick = (category: string): void => {
        store.setCategory(category);
        store.filterCategory(category);
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
                        <div key={index} onClick={() => handelNavBtnClick(category)}>{category}</div>
                    )
                }
            </div>
        </div>
    );
}