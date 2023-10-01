import Slider, {Settings} from "react-slick";
import {observer} from "mobx-react";
import store from "../../store";
import {ImagePlaceHolder} from "../imagePlaceHolder/imagePlaceHolder";

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
                            <div key={image}>
                                <div className="image-wrapper">
                                    <ImagePlaceHolder
                                        src={`url(https://ik.imagekit.io/thfdl6dmv/tr:h-400/antonia-illustrations/${image})`}
                                        alt={'Slider Image'}
                                        useBackgroundImage={true}
                                        imageWidth={'100%'}
                                        imageHeight={'400px'}
                                    />
                                </div>
                            </div>
                        )
                }
            </Slider>
        </>
    );
}

export default observer(SliderComponent);
