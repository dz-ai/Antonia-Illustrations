import Slider from "react-slick";
import {Dispatch, SetStateAction} from "react";
import {AddToCart} from "../addToCart/addToCart";


interface IMagesRow {
    images: string[];
    numOfImages: number;
    auto: boolean;
    scroll: number;
    focusOnSelect: boolean;
    nav: undefined | Slider;
    setNav: Dispatch<SetStateAction<any>>;
    addToCart?: boolean;
}

export function SliderComponent({images, numOfImages, auto, scroll, focusOnSelect, nav, setNav, addToCart}: IMagesRow) {

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: numOfImages,
        slidesToScroll: scroll,
        autoplay: auto,
        draggable: true,
    };

    return (
        <>
            <Slider
                {...settings}
                ref={slider => setNav(slider)}
                asNavFor={nav}
                focusOnSelect={focusOnSelect}
            >
                {
                    images
                        .map((image) =>
                            <div
                                key={image}
                                className="my-slider-image"
                            >
                                <img
                                    key={image}
                                    src={image}
                                    alt='img'
                                    loading="lazy"
                                />
                                {
                                    addToCart &&
                                   <AddToCart />
                                }
                            </div>
                        )
                }

            </Slider>
        </>
    );
}
