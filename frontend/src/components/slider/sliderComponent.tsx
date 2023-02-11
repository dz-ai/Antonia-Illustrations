
import Slider from "react-slick";
import {Dispatch, SetStateAction} from "react";


interface IMagesRow {
    images: string[];
    numOfImages: number;
    auto: boolean;
    scroll: number;
    focusOnSelect: boolean;
    nav: undefined | Slider;
    setNav: Dispatch<SetStateAction<any>>;
}

export function SliderComponent({images, numOfImages, auto, scroll, focusOnSelect, nav, setNav}: IMagesRow) {

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

                            <img
                                key={image}
                                src={image}
                                alt='img'
                            />
                        )
                }

            </Slider>
        </>
    );
}
