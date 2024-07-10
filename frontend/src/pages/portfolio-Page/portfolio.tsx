import SliderComponent from "../../components/slider/sliderComponent";
import React, {useEffect, useRef, useState} from "react";
import {MasonryGrid} from "../../components/masonryGrid/MasonryGrid";
import {CategoryNavBar} from "../../components/categoryNavBar/categoryNavBar";
import {useInterSectionObserver} from "../../Hooks/useInterSectionObserver";
import {useMediaQuery} from "react-responsive";
import {JumpUpBtn} from "../../components/jumpUpBtn/jumpUpBtn";
import store from "../../store";
import {observer} from "mobx-react";
import {useLocation} from "react-router-dom";
import {LoadingComponent} from "../../components/loadingComponent/loadingComponent";
import {ImagesGroupsNamesEnum} from "../../components/popupEditImage/popupEditImage";
import {TUseScrollIntoView, useScrollIntoView} from "../../Hooks/useScrollIntoView";

function Portfolio() {
    const ref = useRef<HTMLDivElement>(null);
    const downRef = useRef<HTMLDivElement>(null);

    const scrollIntoView: TUseScrollIntoView = useScrollIntoView();

    const location = useLocation();

    // Customise Hooks to keep categories navbar sticking to the current visible section //
    const isInViewPort: boolean = useInterSectionObserver(ref);
    const isDownInViewPort: boolean = useInterSectionObserver(downRef);

    const isShortScreen = useMediaQuery({query: '(max-height: 505px)'});
    const isUnder950pxScreen = useMediaQuery({query: '(max-width: 950px)'});

    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
    const [loadingImages, setLoadingImages] = useState<boolean | string>(true);

    const loadImages = (): void => {
        setLoadingImages(true);
        store.getImages(ImagesGroupsNamesEnum.portfolioImagesGroupName)
            .then(isThereAnyImage => {
                if (isThereAnyImage && location.state) {
                    const categoriesVal = location.state.currentCategory;
                    if (categoriesVal !== 'All Categories') store.filterCategory(store.currentCategory);
                    setLoadingImages(false);
                } else {
                    setLoadingImages('No Images To Show');
                }
            })
            .catch(error => {
                console.log(error);
                setLoadingImages('Something went wrong 🤔');
            });
    }

    useEffect((): void => {
        if (!location.state?.searchResult) {
            loadImages();
        }
    }, []);

    useEffect(() => {
        if (!isFirstLoad) {
            loadImages();
        }
    }, [store.reloadPortfolioImages]);

    useEffect(() => {
        !isFirstLoad && store.imagesArray.length < 1 && setLoadingImages('No Images To Show');
        !isFirstLoad && store.imagesArray.length > 1 && scrollIntoView(downRef);
        location.state?.searchResult && store.imagesArray.length > 1 && scrollIntoView(downRef);
        setIsFirstLoad(false);
    }, [store.triggerDownScrollOnSearch]);

    useEffect(() => {
        !isFirstLoad && store.imagesArray.length < 1 && setLoadingImages('No Images To Show');
    }, [store.imagesArray]);

    return (
        <>
            <div
                className="portfolio-up-page"
                ref={ref}
                tabIndex={-1}
                style={{
                    background: `url(https://ik.imagekit.io/thfdl6dmv/antonia-illustrations/mandala_horizontal.jpg) no-repeat center center`,
                    backgroundSize: isUnder950pxScreen ? 'auto 120%' : '150% auto',
                    flex: '1'
                }}
            >

                {
                    isInViewPort && !isShortScreen &&
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
                <MasonryGrid
                    loadingImages={loadingImages}
                />
            </section>
        </>
    );
}

export default observer(Portfolio)