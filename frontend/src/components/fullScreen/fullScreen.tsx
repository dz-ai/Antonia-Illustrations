import React, {Dispatch, SetStateAction, useRef} from "react";
import {useOutClick} from "../../Hooks/useOutClick";

type Props = {
    fullScreen: string | boolean;
    setFullScreen: Dispatch<SetStateAction<string | boolean>>;
    removeEListener: boolean;
    description: string;
};

export function FullScreen({fullScreen, setFullScreen, removeEListener, description}:Props) {
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
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}