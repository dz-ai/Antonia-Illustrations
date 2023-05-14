import Masonry from "react-masonry-css";
import React, {Dispatch, SetStateAction} from "react";
import {IImage} from "../../types/types";

type Props = {
    images: IImage;
    setRemEListener: Dispatch<SetStateAction<boolean>>;
    setFullScreen: Dispatch<SetStateAction<string | boolean>>;
};

export function MasonryGrid({images, setRemEListener, setFullScreen}: Props) {
    const url = import.meta.env.VITE_DEV === 'true' ? import.meta.env.VITE_DEV_SERVER : '';
    const breakpoints = {
        default: 4,
        1100: 3,
        850: 2,
        600: 1,
    };

    return (
        <Masonry
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
            breakpointCols={breakpoints}
        >

            {
                Array.from(Object.keys(images))
                    .map((key) =>

                        <div
                            key={key}
                            className="image-card-wrapper image-card-wrapper-hover image-card-wrapper-active"
                        >
                            <img
                                src={`${url}/imagesUploads/${key}`}
                                height="auto"
                                width="200"
                                alt='img'
                                onClick={() => {
                                    setRemEListener(true);
                                    setFullScreen(`${url}/imagesUploads/${key}`);

                                    setTimeout(() => {
                                        setRemEListener(false);
                                    }, 500);
                                }}
                                loading="lazy"
                            />
                            <p>{images[key].category}</p>
                            <p>{images[key].description}</p>
                        </div>
                    )
            }
        </Masonry>
    );
}