import {SliderComponent} from "../../components/slider/sliderComponent";
import React, {useRef, useState} from "react";
import Slider from "react-slick";
import {imageArray, mandala} from "../../imgs/imagesArray";
import {FullScreen} from "../../components/fullScreen/fullScreen";
import {MasonryGrid} from "../../components/masonryGrid/MasonryGrid";
import {CategoryNavBar} from "../../components/categoryNavBar/categoryNavBar";
import {categories} from "../../types/types";
import {useParams} from "react-router-dom";
import {useInterSectionObserver} from "../../Hooks/useInterSectionObserver";
import {useMediaQuery} from "react-responsive";
import {TUseScrollIntoView, useScrollIntoView} from "../../Hooks/useScrollIntoView";
import {FaArrowAltCircleUp} from "react-icons/all";


export function PortfolioShop() {
    const ref = useRef<HTMLDivElement>(null);
    const downRef = useRef<HTMLDivElement>(null);
    const {page} = useParams() as any;

    // Customise Hooks //
    const isInViewPort:boolean = useInterSectionObserver(ref);
    const isDownInViewPort:boolean = useInterSectionObserver(downRef);
    const scrollIntoView:TUseScrollIntoView = useScrollIntoView();

    const isUnder950pxScreen = useMediaQuery({query: '(max-width: 950px)'});

    const categories:categories = ['category', 'category', 'category', 'category', 'category', 'category'];

    const [fullScreen, setFullScreen] = useState<boolean | string>(false);
    const [remEListener, setRemEListener] = useState<boolean>(false);

    const [sliderBig, setSliderBig] = useState<undefined | Slider>(undefined);
    const [sliderRow, setSliderRow] = useState<undefined | Slider>(undefined);


    return (
        <>
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
                    <CategoryNavBar categories={categories} />
                }
                <div className="portfolio-page-blur"/>


                <div className="slide-container">
                    <SliderComponent
                        images={imageArray}
                        numOfImages={1}
                        auto={false}
                        scroll={1}
                        focusOnSelect={false}
                        nav={sliderRow}
                        setNav={setSliderBig}
                        addToCart={page === 'shop'}
                    />
                </div>

                <div className="portfolio-up-hor-display">
                    <SliderComponent
                        images={imageArray}
                        numOfImages={5}
                        auto={false}
                        scroll={3}
                        focusOnSelect={true}
                        nav={sliderBig}
                        setNav={setSliderRow}
                    />

                </div>
            </div>


            <section className="portfolio-down-page" ref={downRef}>
                {
                    !isInViewPort &&
                    <CategoryNavBar categories={categories} />
                }

                {
                    isDownInViewPort &&
                    <button
                        id="up-btn"
                        onClick={() => scrollIntoView(ref)}
                    >
                        <FaArrowAltCircleUp/>
                    </button>
                    // TODO try to make up btn as a reusable component
                }
                <MasonryGrid
                    imageArray={imageArray}
                    setRemEListener={setRemEListener}
                    setFullScreen={setFullScreen}
                    addToCart={page === 'shop'}
                />
                {
                    typeof fullScreen === 'string' &&
                    <FullScreen
                        fullScreen={fullScreen}
                        setFullScreen={setFullScreen}
                        removeEListener={remEListener}
                    />
                }
            </section>

        </>
    );
}