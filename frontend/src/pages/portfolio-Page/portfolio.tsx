import SliderComponent from "../../components/slider/sliderComponent";
import React, {useEffect, useRef, useState} from "react";
import {FullScreen} from "../../components/fullScreen/fullScreen";
import {MasonryGrid} from "../../components/masonryGrid/MasonryGrid";
import {CategoryNavBar} from "../../components/categoryNavBar/categoryNavBar";
import {useInterSectionObserver} from "../../Hooks/useInterSectionObserver";
import {useMediaQuery} from "react-responsive";
import {JumpUpBtn} from "../../components/jumpUpBtn/jumpUpBtn";
import AddImagePopup from "../../components/addImagePopup/addImagePopup";
import store from "../../store";
import {observer} from "mobx-react";
import {useLocation} from "react-router-dom";

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
    const location = useLocation();

    // Customise Hooks //
    const isInViewPort: boolean = useInterSectionObserver(ref);
    const isDownInViewPort: boolean = useInterSectionObserver(downRef);

    const isUnder950pxScreen = useMediaQuery({query: '(max-width: 950px)'});

    const [fullScreen, setFullScreen] = useState<string | boolean>(false);
    const [remEListener, setRemEListener] = useState<boolean>(false);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [loadingImages, setLoadingImages] = useState<boolean | string>(store.isUserLog);

    useEffect((): void => {
        setLoadingImages(true);
        store.getImages()
            .then(isThereAnyImage => {
                if (isThereAnyImage && location.state) {
                    const categoriesVal = location.state.currentCategory;
                    if (categoriesVal !== 'All Categories') store.filterCategory(store.currentCategory);
                    setLoadingImages(false);
                } else {
                    setLoadingImages('No Images To Show');
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
                    background: `url(https://ik.imagekit.io/thfdl6dmv/antonia-illustrations/mandala_horizontal.jpg) no-repeat center center`,
                    backgroundSize: isUnder950pxScreen ? 'auto 120%' : '150% auto',
                    flex: '1'
                }}
            >

                {
                    isInViewPort &&
                    <CategoryNavBar categories={store.categories}/>
                }
                <div className="portfolio-page-blur"/>
                {
                    store.imagesArray.length > 0 ?
                        <div className="slide-container">
                            <SliderComponent
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
                    <CategoryNavBar categories={store.categories}/>
                }

                {
                    isDownInViewPort &&
                    <JumpUpBtn upRef={ref}/>
                }
                {
                    store.imagesArray.length > 0 ?
                        <MasonryGrid
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
                    <AddImagePopup setShowPopup={setShowPopup}/>
                }
                {
                    typeof fullScreen === 'string' &&
                    <FullScreen
                        fullScreen={fullScreen}
                        setFullScreen={setFullScreen}
                        removeEListener={remEListener}
                        description={store.images[fullScreen.split('/')[fullScreen.split('/').length - 1]].imageDescription}
                    />
                }
            </section>
        </>
    );
}

export default observer(Portfolio)