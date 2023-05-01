import {SliderComponent} from "../../components/slider/sliderComponent";
import React, {useRef, useState} from "react";
import {imageArray, mandala} from "../../imgs/imagesArray";
import {FullScreen} from "../../components/fullScreen/fullScreen";
import {MasonryGrid} from "../../components/masonryGrid/MasonryGrid";
import {CategoryNavBar} from "../../components/categoryNavBar/categoryNavBar";
import {categories} from "../../types/types";
import {useInterSectionObserver} from "../../Hooks/useInterSectionObserver";
import {useMediaQuery} from "react-responsive";
import {JumpUpBtn} from "../../components/jumpUpBtn/jumpUpBtn";


export function Portfolio() {
    const ref = useRef<HTMLDivElement>(null);
    const downRef = useRef<HTMLDivElement>(null);

    // Customise Hooks //
    const isInViewPort:boolean = useInterSectionObserver(ref);
    const isDownInViewPort:boolean = useInterSectionObserver(downRef);

    const isUnder950pxScreen = useMediaQuery({query: '(max-width: 950px)'});

    const categories:categories = ['first', 'category','category', 'category', 'category', 'category', 'category', 'category', 'category', 'category', 'category', 'last'];

    const [fullScreen, setFullScreen] = useState<boolean | string>(false);
    const [remEListener, setRemEListener] = useState<boolean>(false);

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
                   <JumpUpBtn upRef={ref} />
                }
                <MasonryGrid
                    imageArray={imageArray}
                    setRemEListener={setRemEListener}
                    setFullScreen={setFullScreen}
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