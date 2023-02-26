import React, {useEffect, useRef} from "react";
import {useInterSectionObserver} from "../../Hooks/useInterSectionObserver";
import {TUseScrollIntoView, useScrollIntoView} from "../../Hooks/useScrollIntoView";
import {JumpUpBtn} from "../../components/jumpUpBtn/jumpUpBtn";
import {CheckUpPage} from "./checkUpPage";
import {CheckDownPage} from "./checkDownPage";

export function CheckoutPage() {
    const ref = useRef<HTMLDivElement>(null);
    const upRef = useRef<HTMLDivElement>(null);

    const scrollIntoView: TUseScrollIntoView = useScrollIntoView();

    const isInViewPort: boolean = useInterSectionObserver(ref);

    useEffect(() => {
        scrollIntoView(upRef);
    }, []);

    const handleScrollIntoView = (direction: string): void => {
        if (direction === 'up') {
            scrollIntoView(upRef);
        } else {
            scrollIntoView(ref);
        }
    };

    return (
        <>
            <div className="checkout-up-page" ref={upRef}>
                <CheckUpPage scrollFun={handleScrollIntoView}/>
            </div>

            <div className="checkout-down-page" ref={ref}>

                {
                    isInViewPort &&
                    <JumpUpBtn upRef={upRef}/>
                }
                <CheckDownPage/>

            </div>


        </>
    );
}