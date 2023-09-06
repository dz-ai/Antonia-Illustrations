import React, {ChangeEvent, useContext, useRef, useState} from "react";
import {AiOutlineCloseCircle, BiDotsVerticalRounded, FiEdit2, RiImageAddLine} from "react-icons/all";
import {IImage} from "../../types/types";
import {
    deleteImage,
    handleFileChange, IImageMetaData,
    setImageMetaData,
    standardFileName,
    uploadImageFun
} from "./addImageUtil";
import {PopupContext} from "../popupMessage/popupMessage";
import store from "../../store";
import Dropdown from "../dropdown/dropdown";
import {useOutClick} from "../../Hooks/useOutClick";
import {Tooltip} from "react-tooltip";

export enum ImagesGroupsNamesEnum {
    portfolioImagesGroupName = 'portfolio-images',
    aboutMeImagesGroupName = 'about-me-images',
}

interface IProp {
    imagesGroupName: ImagesGroupsNamesEnum;
    newImage: boolean;
    imageDetails: IImage;
    imageWidth?: number;
    imageAtr?: string;
    imageDetailsFields: boolean;
    onImageClicked?: (imageFileName: string) => void;
    onSaveClicked?: (imageFileName: string) => Promise<boolean>;
    onDeleteClicked?: (imageFileName: string) => Promise<boolean>;
}

interface IEditImageState {
    imageFileName: string,
    fileID?: string,
    imageFile?: File
}

export function PopupEditImage({
                                   imagesGroupName,
                                   imageDetails,
                                   imageWidth,
                                   imageAtr,
                                   imageDetailsFields,
                                   newImage,
                                   onSaveClicked,
                                   onDeleteClicked,
                                   onImageClicked
                               }: IProp) {
    const imageFileName: string = Object.keys(imageDetails)[0];
    const {imageCategory, imageDescription} = imageDetails[imageFileName];

    const popupContext = useContext(PopupContext);

    const [showPopupEditImage, setShowPopupEditImage] = useState<boolean>(false);
    const [showEditDes, setShowEditDes] = useState<boolean>(false);
    const [showEditImage, setShowEditImage] = useState<boolean | string>(false);
    const [editImage, setEditImage] = useState<IEditImageState>({imageFileName: ''});
    const [editDescription, setEditDescription] = useState<string>(!newImage ? imageDescription : '');
    const [loadingImageUpload, setLoadingImageUpload] = useState<boolean>(false);
    const [loadingSave, setLoadingSave] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<null | string | ArrayBuffer>(null);
    const [deleteImageQuestion, setDeleteImageQuestion] = useState<boolean>(false);

    const ref = useRef(null);
    useOutClick(ref, setShowEditImage);

    const onSave = async () => {
        if (newImage && !editImage.imageFile) {
            popupContext.showPopup('Please choose an image');
            return;
        }
        setLoadingSave(true);
        setShowEditDes(false);

        // delete image case
        if (deleteImageQuestion) {
            onDeleteClicked && await onDeleteClicked('')
            deleteImage(imagesGroupName, imageFileName, (results) => {
                    setDeleteImageQuestion(false);
                    setLoadingSave(false);
                    popupContext.showPopup(results);
                    store.triggerRerender(); /* update the rendered images on the portfolio page */
                    setShowPopupEditImage(false);
                },
                (error) => {
                    console.log(error);
                    popupContext.showPopup(error.message);
                    setShowPopupEditImage(false);
                });
            return;
        }

        // check for require fields
        if (imageDetailsFields && editDescription === '') {
            popupContext.showPopup('Please fill the require fields');
            setLoadingSave(false);
            return;
        }
        if (imageDetailsFields && store.currentCategory === 'All Categories') {
            popupContext.showPopup('Please choose Category');
            setLoadingSave(false);
            return;
        }
        if (imageCategory === store.currentCategory && imageDescription === editDescription && !editImage.imageFileName) {
            popupContext.showPopup('No Data has been change');
            setLoadingSave(false);
            return;
        }
        if (!imageDetailsFields && !editImage.imageFileName) {
            popupContext.showPopup('No Data has been change');
            setLoadingSave(false);
            return;
        }

        // add or replace image
        const image: IImageMetaData = {
            existingImageFileName: imageFileName,
            imageCategory: store.currentCategory,
            imageDescription: editDescription,
            imageToUpLoad: editImage.imageFileName,
        };

        if (editImage.imageFile) {
            uploadImageFun(editImage.imageFile)
                .then(async results => {
                    onSaveClicked && await onSaveClicked(editImage.imageFileName);
                    setImageMetaData(image, imagesGroupName, results.fileId,
                        results => {
                            store.triggerRerender();
                            popupContext.showPopup(results);
                            setEditImage({imageFile: undefined, imageFileName: '', fileID: ''})
                            setPreviewImage(null);
                            setEditDescription('');
                            setLoadingSave(false);
                            setShowPopupEditImage(false);
                        },
                        error => {
                            console.log(error);
                            popupContext.showPopup(`Fail to edit - ${error}`);
                            setLoadingSave(false);
                            setShowPopupEditImage(false);
                        });
                });
        } else { /* replace image details */
            setImageMetaData(image, imagesGroupName, undefined,
                results => {
                    store.triggerRerender();
                    popupContext.showPopup(results);
                    setLoadingSave(false);
                    setShowPopupEditImage(false);
                },
                error => {
                    console.log(error.message);
                    popupContext.showPopup(`Fail to edit - ${error.message} - login first`);
                    setLoadingSave(false);
                    setShowPopupEditImage(false);
                });
        }
    }

    const uploadImage = (event: ChangeEvent<HTMLInputElement>): void => {
        handleFileChange(event, (file, imagePreview) => {

                setShowEditImage(false);
                setLoadingImageUpload(true);

                setPreviewImage(imagePreview);

                setEditImage({imageFileName: standardFileName(file.name), imageFile: file});
                setLoadingImageUpload(false);
            },
            (errorMessage) => {
                popupContext.showPopup(errorMessage);
            });
    }

    return (
        <>
            {/* TODO add tooltip to Edit button */}

            <div className="main-image">
                <Tooltip id="edit-tooltip"/>
                {
                    store.isUserLog && !newImage &&
                    <FiEdit2 className="edit-btn"
                             data-tooltip-id="edit-tooltip"
                             data-tooltip-content={'Edit Image'}
                             onClick={() => setShowPopupEditImage(true)}/>
                }
                {
                    store.isUserLog && newImage &&
                    <div className="add-new-image" onClick={() => setShowPopupEditImage(true)}>
                        <div>Add New Image <RiImageAddLine className="add-image-icon"/></div>
                    </div>
                }
                {
                    !newImage &&
                    <img src={`${import.meta.env.VITE_IMAGEKIT}/tr:w-${imageWidth}/${imageFileName}`} width={imageWidth}
                         alt={imageAtr}
                         onClick={() => onImageClicked && onImageClicked(imageFileName)}
                         loading="lazy"/>
                }
            </div>

            {
                showPopupEditImage &&

                <div id="popup-edit-wrapper">
                    <div id="popup-edit-image">
                        <section>
                            {
                                !deleteImageQuestion &&
                                <>
                                    <h2>Edit</h2>
                                    <div className="image-details">
                                        <div className="edit-section">
                                            <section className="image-edit-section">
                                                {
                                                    loadingImageUpload ?
                                                        <div className="loader"></div>
                                                        :
                                                        previewImage === null && newImage ?
                                                            <div className="add-new-image">
                                                                <div>Add New Image <RiImageAddLine
                                                                    className="add-image-icon"/>
                                                                    <label>
                                                                        <input onChange={(e) => uploadImage(e)}
                                                                               type="file"
                                                                               style={{visibility: 'hidden'}}/>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            :
                                                            <img
                                                                src={!previewImage ? `${import.meta.env.VITE_IMAGEKIT}/tr:w-100/${imageFileName}` : previewImage as string}
                                                                width={100}
                                                                height={'auto'}
                                                                alt="image to edit"/>
                                                }
                                                <div ref={ref}>
                                                    {
                                                        !loadingImageUpload && !newImage &&
                                                        <BiDotsVerticalRounded
                                                            className="three-dote-edit-icon"
                                                            onClick={() => setShowEditImage(!showEditImage)}/>
                                                    }
                                                    {
                                                        !loadingImageUpload && newImage && previewImage !== null &&
                                                        <AiOutlineCloseCircle
                                                            className="three-dote-edit-icon"
                                                            onClick={() => {
                                                                setPreviewImage(null);
                                                            }}/>
                                                    }
                                                    {
                                                        showEditImage &&
                                                        <div className="edit-image-btns">
                                                            <label>
                                                                <input onChange={(e) => uploadImage(e)}
                                                                       type="file"
                                                                       style={{display: 'none'}}/>
                                                                Replace Image
                                                            </label>
                                                            <button onClick={() => setDeleteImageQuestion(true)}>
                                                                Delete Image
                                                            </button>
                                                        </div>
                                                    }
                                                </div>
                                            </section>
                                            {
                                                imageDetailsFields &&
                                                <>
                                                    <h4>Category:</h4>
                                                    <Dropdown options={store.categories}
                                                              initCategory={!newImage ? imageCategory : 'All Categories'}
                                                              noInfluence={true}/>

                                                    <h4>Description:</h4>
                                                    <section className="section">
                                                        {
                                                            !showEditDes &&
                                                            <p>{editDescription}</p>
                                                        }
                                                        {
                                                            showEditDes &&
                                                            <input value={editDescription}
                                                                   type="text"
                                                                   autoFocus={true}
                                                                   placeholder="Description"
                                                                   onChange={e => setEditDescription(e.target.value)}/>
                                                        }
                                                        <button onClick={() => setShowEditDes(!showEditDes)}>
                                                            <FiEdit2/>
                                                        </button>
                                                    </section>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </>
                            }
                            {
                                deleteImageQuestion &&
                                <section className="delete-warning">
                                    <p>You Are About To Delete The Image - {imageFileName}!</p>
                                    {loadingSave && <div className="loader"/>}
                                    {
                                        !loadingSave &&
                                        <img src={`${import.meta.env.VITE_IMAGEKIT}/tr:w-100/${imageFileName}`}
                                             alt="image to delete"/>
                                    }
                                    <p>Press "Save" to Continue Or "Cansel" to Quit</p>
                                </section>
                            }
                            <div className="cansel-save-btn">
                                <button onClick={onSave} disabled={loadingImageUpload || loadingSave}>
                                    {!loadingImageUpload && !loadingSave ? 'Save' : <div className="loader"></div>}
                                </button>
                                <button onClick={() => {
                                    setDeleteImageQuestion(false);
                                    setShowEditDes(false);
                                    setPreviewImage(null);
                                    setLoadingSave(false);
                                    setShowPopupEditImage(false);
                                }}>
                                    Cansel
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            }
        </>
    );
}
