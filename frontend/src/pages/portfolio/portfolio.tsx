import images from '../../imgs/imagesArray'
import {SliderComponent} from "../../components/slider/sliderComponent";
import {useEffect, useRef, useState} from "react";
import Slider from "react-slick";
import Masonry from "react-masonry-css";

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
    const refFullScreen = useRef<HTMLDivElement>(null);

    const [isInViewPort, setIsInViewPort] = useState<boolean>(true);

    const [fullScreen, setFullScreen] = useState<boolean | string>(false);

    const [sliderBig, setSliderBig] = useState<undefined | Slider>(undefined);
    const [sliderRow, setSliderRow] = useState<undefined | Slider>(undefined);

    const breakpoints = {
        default: 4,
        1100: 3,
        850: 2,
        600: 1,
    };

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
                        images={images}
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
                        images={images}
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
                <Masonry
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                    breakpointCols={breakpoints}
                >

                    {
                        images
                            .map((image, index) =>

                                <div className="image-card-wrapper image-card-wrapper-hover image-card-wrapper-active">
                                    <img
                                        key={image}
                                        src={image}
                                        height="auto"
                                        width="200"
                                        alt='img'
                                        onClick={() => setFullScreen(image)}
                                        loading="lazy"
                                    />
                                    <p>description</p>
                                </div>
                            )
                    }
                </Masonry>
                {
                    typeof fullScreen === 'string' &&
                    <div id="ful-screen-image" ref={refFullScreen}>
                        <button
                            className="close-button"
                            onClick={() => setFullScreen(false)}
                        >
                            ✖
                        </button>

                        <div id="full-screen-img-wrapper">
                            <div className="image-card-wrapper">
                                <img src={fullScreen} alt=""/>
                                <p>description</p>
                            </div>
                        </div>
                    </div>
                }
            </section>

        </>
    );
}