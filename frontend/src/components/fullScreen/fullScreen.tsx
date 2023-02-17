import React, {Dispatch, SetStateAction, useRef} from "react";
import {useOutClick} from "../../Hooks/useOutClick";

type Props = {
    fullScreen: boolean | string;
    setFullScreen: Dispatch<SetStateAction<string | boolean>>;
    removeEListener: boolean;
};

export function FullScreen({fullScreen, setFullScreen, removeEListener}:Props) {
    const refFullScreen = useRef<HTMLDivElement>(null);

    useOutClick(refFullScreen, setFullScreen, removeEListener);

    return (
        <div id="ful-screen-image">

            <div id="full-screen-img-wrapper">
            <button
                className="close-button"
                onClick={() => setFullScreen(false)}
            >
                ✖
            </button>
                <div className="image-card-wrapper" ref={refFullScreen}>
                    <img src={typeof fullScreen === 'string' ? fullScreen : ''} alt=""/>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. </p>
                </div>
            </div>
        </div>
    );
}