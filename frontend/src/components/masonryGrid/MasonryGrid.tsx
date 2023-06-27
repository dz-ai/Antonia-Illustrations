import Masonry from "react-masonry-css";
import React, {Dispatch, SetStateAction, useState} from "react";
import {IImage} from "../../types/types";
import {FiEdit2} from "react-icons/all";
import {PopupEditImage} from "../popupEditImage/popupEditImage";

type Props = {
    images: IImage;
    setRemEListener: Dispatch<SetStateAction<boolean>>;
    setFullScreen: Dispatch<SetStateAction<string | boolean>>;
};

export function MasonryGrid({images, setRemEListener, setFullScreen}: Props) {
    const [showPopupEditImage, setShowPopupEditImage] = useState<boolean>(false);
    const [imageDetails, setImageDetails] = useState<IImage>({});

    const breakpoints = {
        default: 4,
        1100: 3,
        850: 2,
        600: 1,
    };

    return (
        <>
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
                                {
                                    // TODO add tooltip to Edit button
                                }
                                <FiEdit2 className="edit-btn"
                                         title="Edit Image"
                                         onClick={() => {
                                             setImageDetails({
                                                 [`${key}`]: {
                                                     imageCategory: images[key].imageCategory,
                                                     imageDescription: images[key].imageDescription
                                                 }
                                             });
                                             setShowPopupEditImage(true);
                                         }}/>
                                <img
                                    src={`https://ik.imagekit.io/thfdl6dmv/tr:w-200/antonia-illustrations/${key}`}
                                    height="auto"
                                    width="200"
                                    alt='img'
                                    onClick={() => {
                                        setRemEListener(true);
                                        setFullScreen(`https://ik.imagekit.io/thfdl6dmv/tr:h-500/antonia-illustrations/${key}`);

                                        setTimeout(() => {
                                            setRemEListener(false);
                                        }, 500);
                                    }}
                                    loading="lazy"
                                />
                                <p>{images[key].imageCategory}</p>
                                <p>{images[key].imageDescription}</p>
                            </div>
                        )
                }
            </Masonry>
            {
                showPopupEditImage &&
                <PopupEditImage
                    imageDetails={imageDetails}
                    setShowPopupEditImage={setShowPopupEditImage}/>
            }
        </>
    );
}