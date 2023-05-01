import Masonry from "react-masonry-css";
import React, {Dispatch, SetStateAction} from "react";

type Props = {
    imageArray: string[];
    setRemEListener: Dispatch<SetStateAction<boolean>>;
    setFullScreen: Dispatch<SetStateAction<string | boolean>>;
};

export function MasonryGrid({imageArray, setRemEListener, setFullScreen}: Props) {
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
                imageArray
                    .map((image) =>

                        <div
                            key={image}
                            className="image-card-wrapper image-card-wrapper-hover image-card-wrapper-active"
                        >
                                <img
                                    src={image}
                                    height="auto"
                                    width="200"
                                    alt='img'
                                    onClick={() => {
                                        setRemEListener(true);
                                        setFullScreen(image);

                                        setTimeout(() => {
                                            setRemEListener(false);
                                        },500);
                                    }}
                                    loading="lazy"
                                />
                                <p>description description description description</p>
                        </div>
                    )
            }
        </Masonry>
    );
}