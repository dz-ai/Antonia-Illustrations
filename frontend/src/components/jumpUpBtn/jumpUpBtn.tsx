import {FaArrowAltCircleUp} from "react-icons/all";
import React from "react";
import {TUseScrollIntoView, useScrollIntoView} from "../../Hooks/useScrollIntoView";

type Props = {
    upRef:  React.RefObject<HTMLDivElement>
};

export function JumpUpBtn({upRef}: Props) {
    const scrollIntoView:TUseScrollIntoView = useScrollIntoView();


    return (
        <>
            <button className="up-btn" onClick={() => scrollIntoView(upRef)}>
                <FaArrowAltCircleUp/>
            </button>

        </>
    );
}