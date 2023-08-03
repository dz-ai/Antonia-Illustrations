import React, {ChangeEvent, useContext, useState} from "react";
import {BiDotsVerticalRounded, FiEdit2} from "react-icons/all";
import {IImage} from "../../types/types";
import {
    deleteImage,
    handleFileChange,
    setImageMetaData,
    standardFileName,
    uploadImageFun
} from "../addImagePopup/addImagePopup";
import {PopupContext} from "../popupMessage/popupMessage";
import store from "../../store";
import Dropdown from "../dropdown/dropdown";

interface IProp {
    imageDetails: IImage;
    setShowPopupEditImage: React.Dispatch<boolean>;
}

interface IEditImageState {
    imageFileName: string,
    fileID?: string,
    imageFile?: File
}

export function PopupEditImage({imageDetails, setShowPopupEditImage}: IProp) {
    const imageFileName: string = Object.keys(imageDetails)[0];
    const {imageCategory, imageDescription} = imageDetails[imageFileName];

    const popupContext = useContext(PopupContext);

    const [showEditDes, setShowEditDes] = useState<boolean>(false);
    const [showEditImage, setShowEditImage] = useState<boolean>(false);
    const [editImage, setEditImage] = useState<IEditImageState>({imageFileName});
    const [editCategory, setEditCategory] = useState<string>(imageCategory);
    const [editDescription, setEditDescription] = useState<string>(imageDescription);
    const [loadingImageUpload, setLoadingImageUpload] = useState<boolean>(false);
    const [loadingSave, setLoadingSave] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<null | string | ArrayBuffer>(null);
    const [deleteImageQuestion, setDeleteImageQuestion] = useState<boolean>(false);

    const onSave = (): void => {
        setLoadingSave(true);
        // delete image case
        if (deleteImageQuestion) {
            deleteImage(editImage.imageFileName, (results) => {
                    setLoadingSave(false);
                    popupContext.showPopup(results);
                    store.triggerRerender(); /* update the rendered images on the portfolio page */
                    setShowPopupEditImage(false);
                },
                (error) => {
                    console.log(error);
                    store.logOut(() => popupContext.showPopup(error.message + ' login first'));
                    setShowPopupEditImage(false);
                });
            return;
        }
        if (editCategory === '' || editDescription === '') {
            popupContext.showPopup('Please fill the require fields');
            return;
        }
        if (editCategory === 'All Categories') {
            popupContext.showPopup('Please choose Category');
            setLoadingSave(false);
            return;
        }
        if (imageCategory === editCategory && imageDescription === editDescription && imageFileName === editImage.imageFileName) {
            popupContext.showPopup('No Data has been change');
            setShowPopupEditImage(false);
            return;
        }

        if (editImage.imageFile) {
            uploadImageFun(editImage.imageFile)
                .then(results => {
                    setEditImage({imageFileName: standardFileName(editImage.imageFileName), fileID: results.fileId});

                    setImageMetaData(results.fileId,
                        results => {
                            store.triggerRerender();
                            popupContext.showPopup(results);
                            setLoadingSave(false);
                            setShowPopupEditImage(false);
                        },
                        error => {
                            console.log(error);
                            store.logOut(() => popupContext.showPopup(`Fail to edit - ${error} - login first`));
                            setLoadingSave(false);
                            setShowPopupEditImage(false);
                        },
                        {
                            fileName: imageFileName,
                            imageCategory: editCategory,
                            imageDescription: editDescription,
                            replaceImageWith: editImage.imageFileName,
                        });
                });
        } else {
            setImageMetaData(undefined,
                results => {
                    store.triggerRerender();
                    popupContext.showPopup(results);
                    setLoadingSave(false);
                    setShowPopupEditImage(false);
                },
                error => {
                    console.log(error);
                    store.logOut(() => popupContext.showPopup(`Fail to edit - ${error} - login first`));
                    setLoadingSave(false);
                    setShowPopupEditImage(false);
                },
                {
                    fileName: imageFileName,
                    imageCategory: editCategory,
                    imageDescription: editDescription,
                    replaceImageWith: editImage.imageFileName,
                });
        }
    }

    const replaceImage = (event: ChangeEvent<HTMLInputElement>): void => {
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
                                                <img
                                                    src={!previewImage ? `${import.meta.env.VITE_IMAGEKIT}/tr:w-100/${editImage.imageFileName}` : previewImage as string}
                                                    width={100}
                                                    height={'auto'}
                                                    alt="image to edit"/>
                                        }
                                        {
                                            // TODO add out click
                                            !loadingImageUpload &&
                                            <BiDotsVerticalRounded onClick={() => setShowEditImage(!showEditImage)}/>
                                        }
                                        {
                                            showEditImage &&
                                            <div className="edit-image-btns">
                                                <label>
                                                    <input onChange={(e) => replaceImage(e)}
                                                           type="file"
                                                           style={{display: 'none'}}/>
                                                    Replace Image
                                                </label>
                                                <button onClick={() => setDeleteImageQuestion(true)}>Delete Image
                                                </button>
                                            </div>
                                        }
                                    </section>
                                    <h4>Category:</h4>
                                    <Dropdown options={store.categories}
                                              noInfluence={true}
                                              onValChange={(val) => setEditCategory(val)}
                                              initCategory={imageCategory}
                                    />

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
                                                   onChange={e => setEditDescription(e.target.value)}/>
                                        }
                                        <button onClick={() => setShowEditDes(!showEditDes)}><FiEdit2/></button>
                                    </section>
                                </div>
                            </div>
                        </>
                    }
                    {
                        deleteImageQuestion &&
                        <section className="delete-warning">
                            <p>You Are About To Delete The Image - {editImage.imageFileName}!</p>
                            <img src={`${import.meta.env.VITE_IMAGEKIT}/tr:w-100/${editImage.imageFileName}`}
                                 alt="image to delete"/>
                            <p>Press "Save" to Continue Or "Cansel" to Quit</p>
                        </section>
                    }
                    <div className="cansel-save-btn">
                        <button onClick={onSave} disabled={loadingImageUpload || loadingSave}>
                            {!loadingImageUpload && !loadingSave ? 'Save' : <div className="loader"></div>}
                        </button>
                        <button onClick={() => setShowPopupEditImage(false)}>Cansel</button>
                    </div>
                </section>
            </div>
        </div>
    );
}
