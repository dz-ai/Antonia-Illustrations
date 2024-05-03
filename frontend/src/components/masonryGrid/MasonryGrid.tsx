import Masonry from "react-masonry-css";
import React, {useEffect, useState} from "react";
import {ImagesGroupsNamesEnum, PopupEditImage} from "../popupEditImage/popupEditImage";
import store from "../../store";
import {LoadingComponent} from "../loadingComponent/loadingComponent";
import {FullScreen} from "../fullScreen/fullScreen";

type Props = {
    loadingImages: boolean | string;
};

export function MasonryGrid({loadingImages}: Props) {

    const [defaultBreakPoint, setDefaultBreakPoint] = useState<number>(4);
    const [secondBreakPoint, setSecondBreakPoint] = useState<number>(3);
    const [fullScreen, setFullScreen] = useState<string | boolean>(false);
    const [remEListener, setRemEListener] = useState<boolean>(false);

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
                { // this PopupEditImage component allows uploading new Image (it doesn't show any image).
                    store.isUserLog &&
                    <div className="image-card-wrapper image-card-wrapper-hover image-card-wrapper-active">
                        <PopupEditImage
                            imagesGroupName={ImagesGroupsNamesEnum.portfolioImagesGroupName}
                            imageDetails={{['']: {imageCategory: '', imageDescription: ''}}}
                            imageDetailsFields={true}
                            newImage={true}/>
                    </div>
                }
                {
                    store.imagesArray.length > 0 ?

                        store.imagesArray
                            .map((key) =>

                                <div key={key}
                                     className="image-card-wrapper image-card-wrapper-hover image-card-wrapper-active">
                                    <PopupEditImage
                                        imagesGroupName={ImagesGroupsNamesEnum.portfolioImagesGroupName}
                                        imageDetails={{
                                            [key]: {
                                                imageCategory: store.images[key].imageCategory,
                                                imageDescription: store.images[key].imageDescription
                                            }
                                        }}
                                        imageWidth={200}
                                        imageAtr={'grid-image'}
                                        imageDetailsFields={true}
                                        newImage={false}
                                        onImageClicked={imageFileName => {
                                            setRemEListener(true);
                                            setFullScreen(imageFileName);
                                            setTimeout(() => {
                                                setRemEListener(false);
                                            }, 500);
                                        }}
                                    />
                                    <p>{store.images[key].imageCategory}</p>
                                    <p>{store.images[key].imageDescription}</p>
                                </div>
                            )

                        :
                        <LoadingComponent loading={loadingImages}/>
                }
            </Masonry>
            {
                typeof fullScreen === 'string' &&
                <FullScreen
                    fullScreen={fullScreen}
                    setFullScreen={setFullScreen}
                    removeEListener={remEListener}
                    description={store.images[fullScreen.split('/')[fullScreen.split('/').length - 1]].imageDescription}
                />
            }
        </>
    );
}