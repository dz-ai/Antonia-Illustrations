import {SliderComponent} from "../../components/slider/sliderComponent";
import React, {ChangeEvent, MouseEventHandler, useEffect, useRef, useState} from "react";
import {mandala} from "../../imgs/imagesArray";
import {FullScreen} from "../../components/fullScreen/fullScreen";
import {MasonryGrid} from "../../components/masonryGrid/MasonryGrid";
import {CategoryNavBar} from "../../components/categoryNavBar/categoryNavBar";
import {categories, IImage} from "../../types/types";
import {useInterSectionObserver} from "../../Hooks/useInterSectionObserver";
import {useMediaQuery} from "react-responsive";
import {JumpUpBtn} from "../../components/jumpUpBtn/jumpUpBtn";

export function Portfolio() {
    const ref = useRef<HTMLDivElement>(null);
    const downRef = useRef<HTMLDivElement>(null);

    // Customise Hooks //
    const isInViewPort: boolean = useInterSectionObserver(ref);
    const isDownInViewPort: boolean = useInterSectionObserver(downRef);

    const isUnder950pxScreen = useMediaQuery({query: '(max-width: 950px)'});

    const categories: categories = ['first', 'category', 'category', 'category', 'category', 'category', 'category', 'category', 'category', 'category', 'category', 'last'];

    const [fullScreen, setFullScreen] = useState<boolean | string>(false);
    const [remEListener, setRemEListener] = useState<boolean>(false);
    const [upLoadImage, setUploadImage] = useState<File | null>(null);
    const [images, setImages] = useState<IImage>({});

    const url = import.meta.env.VITE_DEV === 'true' ? import.meta.env.VITE_DEV_SERVER : '';

    const addImage: MouseEventHandler<HTMLButtonElement> = async (event) => {
        event.preventDefault();
        if (upLoadImage) {
            const formData = new FormData();
            formData.append('images', upLoadImage);
            formData.append('category', 'category');
            formData.append('description', 'description');

            try {
                const response: any = await fetch(`${url}/api/uploadImage/upload`, {
                    method: 'post',
                    body: formData,
                });
                const data = await response.json();
                await setImages(data);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setUploadImage(event.target.files[0]);
        }
    };

    useEffect(() => {
        fetch(`${url}/api/uploadImage/getImages`)
            .then(res => res.json())
            .then(data => {
                setImages(data);
            });
    }, []);

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
                    <CategoryNavBar categories={categories}/>
                }
                <div className="portfolio-page-blur"/>
                {
                    Array.from(Object.keys(images)).length > 0 ?
                        <div className="slide-container">
                            <SliderComponent
                                images={images}
                                numOfImages={1}
                                auto={false}
                                scroll={1}
                                focusOnSelect={false}
                            />
                        </div>
                        :
                        <p className="no-image-to-show">No Images to show</p>
                }
            </div>

            <section className="portfolio-down-page" ref={downRef}>
                {
                    !isInViewPort &&
                    <CategoryNavBar categories={categories}/>
                }

                {
                    isDownInViewPort &&
                    <JumpUpBtn upRef={ref}/>
                }
                {
                    Array.from(Object.keys(images)).length > 0 ?
                        <MasonryGrid
                            images={images}
                            setRemEListener={setRemEListener}
                            setFullScreen={setFullScreen}
                        />
                        :
                        <p className="no-image-to-show">No Images to show</p>
                }
                <form>
                    <input type="file" onChange={handleFileChange}/>
                    <button onClick={addImage}>+</button>
                </form>
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