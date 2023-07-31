import Slider, {Settings} from "react-slick";
import {observer} from "mobx-react";
import store from "../../store";

interface IMagesRow {
    numOfImages: number;
    auto: boolean;
    scroll: number;
    focusOnSelect: boolean;
}

function SliderComponent({numOfImages, auto, scroll, focusOnSelect}: IMagesRow) {
    const settings: Settings = {
        dots: false,
        infinite: true,
        lazyLoad: 'ondemand',
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
                    store.imagesArray
                        .map((image) =>
                            <div
                                key={image}
                                className="my-slider-image"
                            >
                                <div
                                    style={{
                                        backgroundImage: `url(https://ik.imagekit.io/thfdl6dmv/tr:h-400/antonia-illustrations/${image})`,
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

export default observer(SliderComponent);
