import Masonry from "react-masonry-css";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {IImage} from "../../types/types";
import {FiEdit2} from "react-icons/all";
import {PopupEditImage} from "../popupEditImage/popupEditImage";
import store from "../../store";

type Props = {
    setRemEListener: Dispatch<SetStateAction<boolean>>;
    setFullScreen: Dispatch<SetStateAction<string | boolean>>;
};

export function MasonryGrid({setRemEListener, setFullScreen}: Props) {
    const [showPopupEditImage, setShowPopupEditImage] = useState<boolean>(false);
    const [imageDetails, setImageDetails] = useState<IImage>({});
    const [defaultBreakPoint, setDefaultBreakPoint] = useState<number>(4);
    const [secondBreakPoint, setSecondBreakPoint] = useState<number>(3);

    const breakpoints = {
        default: defaultBreakPoint,
        1100: secondBreakPoint,
        850: 2,
        600: 1,
    };

    useEffect(() => {
        if (store.imagesArray.length < 4) {
            setDefaultBreakPoint(store.imagesArray.length);
            setSecondBreakPoint(store.imagesArray.length);
        } else {
            setDefaultBreakPoint(4);
            setSecondBreakPoint(3);
        }
    }, [store.imagesArray, store.filterCategory]);

    return (
        <>
            <Masonry
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
                breakpointCols={breakpoints}
            >

                {
                    store.imagesArray
                        .map((key) =>

                            <div
                                key={key}
                                className="image-card-wrapper image-card-wrapper-hover image-card-wrapper-active"
                            >
                                {
                                    // TODO add tooltip to Edit button
                                }
                                {
                                    store.isUserLog &&
                                    <FiEdit2 className="edit-btn"
                                             title="Edit Image"
                                             onClick={() => {
                                                 setImageDetails({
                                                     [`${key}`]: {
                                                         imageCategory: store.images[key].imageCategory,
                                                         imageDescription: store.images[key].imageDescription
                                                     }
                                                 });
                                                 setShowPopupEditImage(true);
                                             }}/>
                                }
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
                                <p>{store.images[key].imageCategory}</p>
                                <p>{store.images[key].imageDescription}</p>
                            </div>
                        )
                }
            </Masonry>
            {
                showPopupEditImage && store.isUserLog &&
                <PopupEditImage
                    imageDetails={imageDetails}
                    setShowPopupEditImage={setShowPopupEditImage}/>
            }
        </>
    );
}