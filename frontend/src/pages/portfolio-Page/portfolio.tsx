import {SliderComponent} from "../../components/slider/sliderComponent";
import React, {useEffect, useRef, useState} from "react";
import {mandala} from "../../imgs/imagesArray";
import {FullScreen} from "../../components/fullScreen/fullScreen";
import {MasonryGrid} from "../../components/masonryGrid/MasonryGrid";
import {CategoryNavBar} from "../../components/categoryNavBar/categoryNavBar";
import {categories, IImage} from "../../types/types";
import {useInterSectionObserver} from "../../Hooks/useInterSectionObserver";
import {useMediaQuery} from "react-responsive";
import {JumpUpBtn} from "../../components/jumpUpBtn/jumpUpBtn";
import {AddImagePopup} from "../../components/addImagePopup/addImagePopup";
import store from "../../store";
import {observer} from "mobx-react";

// TODO make it in separate file.
function LoadingComponent({loading}: { loading: boolean | string }) {
    let jsx;
    if (typeof loading === 'boolean') {
        loading ?
            jsx = <div className="images-loader"></div>
            :
            jsx = null;
    } else {
        jsx = <p className="no-image-to-show">No Images to show</p>;
    }
    return (
        <>
            {jsx}
        </>
    );
}

function Portfolio() {
    const ref = useRef<HTMLDivElement>(null);
    const downRef = useRef<HTMLDivElement>(null);

    // Customise Hooks //
    const isInViewPort: boolean = useInterSectionObserver(ref);
    const isDownInViewPort: boolean = useInterSectionObserver(downRef);

    const isUnder950pxScreen = useMediaQuery({query: '(max-width: 950px)'});

    const categories: categories = ['first', 'category', 'category', 'category', 'category', 'category', 'category', 'category', 'category', 'category', 'category', 'last'];

    const [fullScreen, setFullScreen] = useState<string | boolean>(false);
    const [remEListener, setRemEListener] = useState<boolean>(false);
    const [images, setImages] = useState<IImage>({});
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [loadingImages, setLoadingImages] = useState<boolean | string>(store.isUserLog);

    const url = import.meta.env.VITE_DEV === 'true' ? import.meta.env.VITE_DEV_SERVER : '';

    const clearAllIMages = (): void => {
        fetch(`${url}/api/uploadImage/clearImages`)
            .then(res => res.json())
            .then(results => {
                setImages(results);
                setLoadingImages('No Images To Show');
            });
    }

    useEffect((): void => {
        setLoadingImages(true);
        fetch(`${url}/api/uploadImage/getImages`)
            .then(res => res.json())
            .then(data => {
                if (Array.from(Object.keys(data)).length === 0) {
                    setLoadingImages('No Images To Show');
                    setImages(data);
                } else {
                    setImages(data);
                    setLoadingImages(false);
                }
            });
    }, [!showPopup, store.rerender]);

    return (
        <>
            {
                // TODO make loading image place holder (check for built in slick-slide feature).
            }
            <div
                className="portfolio-up-page"
                ref={ref}
                style={{
                    background: `url(${mandala}) no-repeat center center`,
                    backgroundSize: isUnder950pxScreen ? 'auto 120%' : '150% auto',
                    flex: '1'
                }}
            >

                {
                    isInViewPort &&
                    <CategoryNavBar categories={categories}/>
                }
                <div className="portfolio-page-blur"/>
                {
                    Array.from(Object.keys(images)).length > 0 ?
                        <div className="slide-container">
                            <SliderComponent
                                images={images}
                                numOfImages={1}
                                auto={false}
                                scroll={1}
                                focusOnSelect={false}
                            />
                        </div>
                        :
                        <LoadingComponent loading={loadingImages}/>
                }
            </div>

            <section className="portfolio-down-page" ref={downRef}>
                {
                    !isInViewPort &&
                    <CategoryNavBar categories={categories}/>
                }

                {
                    isDownInViewPort &&
                    <JumpUpBtn upRef={ref}/>
                }
                {
                    Array.from(Object.keys(images)).length > 0 ?
                        <MasonryGrid
                            images={images}
                            setRemEListener={setRemEListener}
                            setFullScreen={setFullScreen}
                        />
                        :
                        <LoadingComponent loading={loadingImages}/>
                }
                {
                    store.isUserLog &&
                    <button id="add-image" onClick={() => setShowPopup(true)}>Add Image</button>
                }
                {
                    showPopup && store.isUserLog &&
                    <AddImagePopup
                        clearAllIMages={clearAllIMages}
                        setShowPopup={setShowPopup}
                    />
                }
                {
                    typeof fullScreen === 'string' &&
                    <FullScreen
                        fullScreen={fullScreen}
                        setFullScreen={setFullScreen}
                        removeEListener={remEListener}
                        description={images[fullScreen.split('/')[fullScreen.split('/').length - 1]].imageDescription}
                    />
                }
            </section>
        </>
    );
}

export default observer(Portfolio)