import {SliderComponent} from "../../components/slider/sliderComponent";
import React, {useEffect, useRef, useState} from "react";
import Slider from "react-slick";
import {imageArray, mandala} from "../../imgs/imagesArray";
import {FullScreen} from "../../components/fullScreen/fullScreen";
import {MasonryGrid} from "../../components/masonryGrid/MasonryGrid";
import {CategoryNavBar} from "../../components/categoryNavBar/categoryNavBar";
import {categories} from "../../types/types";
import {useParams} from "react-router-dom";


export function PortfolioShop() {
    const ref = useRef<HTMLDivElement>(null);
    const {page} = useParams() as any;

    const categories:categories = ['category', 'category', 'category', 'category', 'category', 'category'];

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
            <div
                className="portfolio-up-page"
                ref={ref}
                style={{
                    background: `url(${mandala}) no-repeat center center`,
                    backgroundSize: '150% auto',
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


            <section className="portfolio-down-page">
                {
                    !isInViewPort &&
                    <CategoryNavBar categories={categories} />
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