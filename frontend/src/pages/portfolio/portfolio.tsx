import {SliderComponent} from "../../components/slider/sliderComponent";
import React, {useEffect, useRef, useState} from "react";
import Slider from "react-slick";
import Masonry from "react-masonry-css";
import {imageArray} from "../../imgs/imagesArray";
import {FullScreen} from "../../components/fullScreen/fullScreen";
import {MasonryGrid} from "../../components/masonryGrid/MasonryGrid";

export const nav = (
    <div className="category-navbar">
        <button>category</button>
        <button>category</button>
        <button>category</button>
        <button>category</button>
        <button>category</button>
        <button>category</button>
    </div>
);

export function Portfolio() {
    const ref = useRef<HTMLDivElement>(null);

    const [isInViewPort, setIsInViewPort] = useState<boolean>(true);

    const [fullScreen, setFullScreen] = useState<boolean | string>(false);
    const [remEListener, setRemEListener] = useState<boolean>(false);

    const [sliderBig, setSliderBig] = useState<undefined | Slider>(undefined);
    const [sliderRow, setSliderRow] = useState<undefined | Slider>(undefined);


    useEffect(() => {
        const observer = new IntersectionObserver((entry) => {
                setIsInViewPort(entry[0].isIntersecting);
            },
            {
                threshold: 0,
                rootMargin: '0px 0px 90% 0px'
            });

        ref.current !== null && observer.observe(ref.current);

        return () => {
            ref.current !== null && observer.unobserve(ref.current);
        }
    }, [ref.current]);





    return (
        <>
            <div className="portfolio-up-page" ref={ref}>

                {
                    isInViewPort && nav
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


            <section className="portfolio-down-page">
                {
                    !isInViewPort && nav
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