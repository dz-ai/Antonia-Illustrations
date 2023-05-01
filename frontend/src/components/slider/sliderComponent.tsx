import Slider from "react-slick";

interface IMagesRow {
    images: string[];
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
                    images
                        .map((image) =>
                            <div
                                key={image}
                                className="my-slider-image"
                            >
                                <div style={{
                                    backgroundImage: `url(${image})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'contain',
                                    backgroundPosition: 'center',
                                    height: '400px',
                                }}></div>
                            </div>
                        )
                }
            </Slider>
        </>
    );
}
