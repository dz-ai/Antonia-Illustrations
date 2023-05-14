import Slider from "react-slick";
import {IImage} from "../../types/types";

interface IMagesRow {
    images: IImage;
    numOfImages: number;
    auto: boolean;
    scroll: number;
    focusOnSelect: boolean;
}

export function SliderComponent({images, numOfImages, auto, scroll, focusOnSelect}: IMagesRow) {

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
                focusOnSelect={focusOnSelect}
            >
                {
                    Array.from(Object.keys(images))
                        .map((image) =>
                            <div
                                key={image}
                                className="my-slider-image"
                            >
                                <div style={{
                                    backgroundImage: `url(http://localhost:3001/imagesUploads/${image})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'contain',
                                    backgroundPosition: 'center',
                                    height: '400px',
                                }}/>
                            </div>
                        )
                }
            </Slider>
        </>
    );
}
