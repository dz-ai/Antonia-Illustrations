import {useEffect, useState} from "react";
import {RiImageAddLine} from "react-icons/all";

type Props = {
    src: string;
    alt: string;
    useBackgroundImage: boolean;
    imageWidth: string;
    imageHeight: string;
};

export function ImagePlaceHolder({src, alt, useBackgroundImage, imageHeight, imageWidth}: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAlreadyLoad, setIsAlreadyLoad] = useState<boolean>(false);

    // extract the path from url('some-path') src typ;
    const pathMatch = src.match(/url\((.*?)\)/);
    const path = (pathMatch && pathMatch[1]) || '';

    useEffect(() => {
        if (!isAlreadyLoad) {
            setIsLoading(true);
        }
    }, [isAlreadyLoad, setIsAlreadyLoad]);

    return (
        <>
            <img style={{position: 'fixed', bottom: '0', visibility: 'hidden', width: 0, height: 0}}
                 loading="lazy"
                 src={!useBackgroundImage ? src : path}
                 onLoad={() => {
                     setIsAlreadyLoad(true);
                     setIsLoading(false);
                 }}
                 alt="none visible image"
            />
            {
                isLoading &&
                <div className="place-holder-loader-wrapper">
                    <RiImageAddLine className="image-place-holder-icon"/>
                    <div className="loader"></div>
                </div>
            }
            {
                !isLoading && useBackgroundImage &&
                <div
                    style={{
                        backgroundImage: src,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        height: imageHeight,
                        width: imageWidth,
                    }}/>
            }
            {
                !isLoading && !useBackgroundImage &&
                <img
                    loading="lazy"
                    width={imageWidth}
                    height={imageHeight}
                    src={src}
                    alt={alt}
                />
            }
        </>
    );
}