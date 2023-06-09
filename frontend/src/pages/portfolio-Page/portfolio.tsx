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
import {PopupMessage} from "../../components/popupMessage/popupMessage";
import {AddImagePopup} from "../../components/addImagePopup/addImagePopup";

function LoadingComponent({loading}: { loading: boolean | string }) {
    let jsx;
    if (typeof loading === 'boolean') {
        loading ?
            jsx = <div className="images-loader"></div>
            :
            jsx = null;
    } else {
        jsx = <p className="no-image-to-show">No Images to show</p>;
    }
    return (
        <>
            {jsx}
        </>
    );
}

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
    const [message, setMessage] = useState<string>('');
    const [upLoadImage, setUploadImage] = useState<File | null>(null);
    const [images, setImages] = useState<IImage>({});
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [loadingImageUpload, setLoadingImageUpload] = useState<boolean>(false);
    const [loadingImages, setLoadingImages] = useState<boolean | string>(false);

    const url = import.meta.env.VITE_DEV === 'true' ? import.meta.env.VITE_DEV_SERVER : '';
    const imageTypes: string[] = ['png', 'jpeg', 'jpg'];

    const addImage: MouseEventHandler<HTMLButtonElement> = async (event) => {
        // TODO make edit image (remove image).
        event.preventDefault();

        // TODO add if (!uploadImage) return;
        if (Array.from(Object.keys(images)).includes(upLoadImage?.name.replace(' ', '_').toLowerCase() as string)) {
            setMessage('Image already exist');
            return;
        }

        if (upLoadImage && !imageTypes.includes(upLoadImage.name.split('.').pop()?.toLowerCase() as string)) {
            setMessage('The file end must be ether png, jpeg, jpg');
            return;
        }

        if (upLoadImage) {
            const formData = new FormData();
            formData.append('images', upLoadImage);
            formData.append('category', 'category');
            formData.append('description', 'description');

            try {
                setLoadingImageUpload(true);
                const response: any = await fetch(`${url}/api/uploadImage/upload`, {
                    method: 'post',
                    body: formData,
                });
                const data = await response.json();
                await setImages(data);
                setUploadImage(null);
                setMessage('Upload successfully');
                setLoadingImageUpload(false);
                setShowPopup(false);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files && event.target.files[0]) {
            setUploadImage(event.target.files[0]);
        }
    };

    const clearAllIMages = (): void => {
        fetch(`${url}/api/uploadImage/clearImages`)
            .then(res => res.json())
            .then(results => {
                setImages(results);
                setLoadingImages('No Images To Show');
            });
    }

    useEffect((): void => {
        setLoadingImages(true);
        fetch(`${url}/api/uploadImage/getImages`)
            .then(res => res.json())
            .then(data => {
                if (Array.from(Object.keys(data)).length === 0) {
                    setLoadingImages('No Images To Show');
                    setImages(data);
                } else {
                    setImages(data);
                    setLoadingImages(false);
                }
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
                        <LoadingComponent loading={loadingImages}/>
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
                        <LoadingComponent loading={loadingImages}/>
                }
                <button id="add-image" onClick={() => setShowPopup(true)}>Add Image</button>
                {
                    showPopup &&
                    <AddImagePopup
                        addImage={addImage}
                        clearAllIMages={clearAllIMages}
                        handleFileChange={handleFileChange}
                        uploadImage={upLoadImage}
                        setShowPopup={setShowPopup}
                        loadingImageUpload={loadingImageUpload}
                    />
                }
                {
                    typeof fullScreen === 'string' &&
                    <FullScreen
                        fullScreen={fullScreen}
                        setFullScreen={setFullScreen}
                        removeEListener={remEListener}
                    />
                }
            </section>

            {
                message !== '' &&
                <PopupMessage message={message} setMessage={setMessage}/>
            }
        </>
    );
}