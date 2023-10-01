import React, {Dispatch, SetStateAction, useRef} from "react";
import {useOutClick} from "../../Hooks/useOutClick";
import {ImagePlaceHolder} from "../imagePlaceHolder/imagePlaceHolder";

type Props = {
    fullScreen: string | boolean;
    setFullScreen: Dispatch<SetStateAction<string | boolean>>;
    removeEListener: boolean;
    description: string;
};

export function FullScreen({fullScreen, setFullScreen, removeEListener, description}: Props) {
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
                    <ImagePlaceHolder
                        src={typeof fullScreen === 'string' ? `${import.meta.env.VITE_IMAGEKIT}/tr:w-1000/${fullScreen}` : ''}
                        useBackgroundImage={false}
                        imageHeight={''}
                        imageWidth={''}
                        alt={'Full screen image'}
                    />
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}