import React, {ChangeEvent, useContext, useState} from "react";
import {BiDotsVerticalRounded, FiEdit2} from "react-icons/all";
import {IImage} from "../../types/types";
import {handleFileChange, setImageMetaData, standardFileName, uploadImageFun} from "../addImagePopup/addImagePopup";
import {PopupContext} from "../popupMessage/popupMessage";
import store from "../../store";

interface IProp {
    imageDetails: IImage;
    setShowPopupEditImage: React.Dispatch<boolean>;
}

export function PopupEditImage({imageDetails, setShowPopupEditImage}: IProp) {
    const imageFileName: string = Object.keys(imageDetails)[0];
    const {imageCategory, imageDescription} = imageDetails[imageFileName];
    const url = import.meta.env.VITE_DEV === 'true' ? import.meta.env.VITE_DEV_SERVER : '';

    const popupContext = useContext(PopupContext);

    const [showEditCat, setShowEditCat] = useState<boolean>(false);
    const [showEditDes, setShowEditDes] = useState<boolean>(false);
    const [showEditImage, setShowEditImage] = useState<boolean>(false);
    const [editImage, setEditImage] = useState<string>(imageFileName);
    const [editCategory, setEditCategory] = useState<string>(imageCategory);
    const [editDescription, setEditDescription] = useState<string>(imageDescription);
    const [loadingImageUpload, setLoadingImageUpload] = useState<boolean>(false);
    const [deleteImageQuestion, setDeleteImageQuestion] = useState<boolean>(false);

    const onSave = (): void => {
        if (deleteImageQuestion) {
            fetch(`${url}/api/uploadImage/deleteImage`, {
                method: 'delete',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({fileName: editImage})
            })
                .then(res => res.json())
                .then(results => {
                    popupContext.showPopup(results);
                    store.triggerRerender(); /* update the rendered images on the portfolio page */
                    setShowPopupEditImage(false);
                })
                .catch(error => {
                    console.log(error);
                    popupContext.showPopup(error);
                    setShowPopupEditImage(false);
                });
        }
        if (editCategory === '' || editDescription === '') {
            popupContext.showPopup('Please fill the require fields');
            return;
        }
        if (imageCategory === editCategory && imageDescription === editDescription && imageFileName === editImage) {
            popupContext.showPopup('No Data has been change');
            setShowPopupEditImage(false);
            return;
        }
        setImageMetaData(results => {
                store.triggerRerender();
                popupContext.showPopup(results);
            },
            error => {
                console.log(error);
                popupContext.showPopup('Fail to edit');
            },
            {
                fileName: imageFileName,
                imageCategory: editCategory,
                imageDescription: editDescription,
                replaceImageWith: editImage
            });
        setShowPopupEditImage(false);
    };

    const replaceImage = (event: ChangeEvent<HTMLInputElement>): void => {
        handleFileChange(event, (file) => {

                setShowEditImage(false);
                setLoadingImageUpload(true);

                uploadImageFun(file)
                    .then(async _ => {
                        setEditImage(standardFileName(file.name));
                        setLoadingImageUpload(false);
                    });
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
                                <div className="cat-des-edit">
                                    <h4>Category:</h4>
                                    <section>
                                        {

                                            !showEditCat &&
                                            <p>{editCategory}</p>
                                        }
                                        {
                                            showEditCat &&
                                            <input value={editCategory}
                                                   type="text"
                                                   autoFocus={true}
                                                   onChange={e => setEditCategory(e.target.value)}/>
                                        }
                                        <button onClick={() => setShowEditCat(!showEditCat)}><FiEdit2/></button>
                                    </section>
                                    <h4>Description:</h4>
                                    <section>
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
                                <section className="image-edit-section">
                                    {
                                        loadingImageUpload ?
                                            <div className="loader"></div>
                                            :
                                            <img src={`${import.meta.env.VITE_IMAGEKIT}/tr:w-100/${editImage}`}
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
                                            <button onClick={() => setDeleteImageQuestion(true)}>Delete Image</button>
                                        </div>
                                    }
                                </section>
                            </div>
                        </>
                    }
                    {
                        deleteImageQuestion &&
                        <section className="delete-warning">
                            <p>You Are About To Delete The Image - {editImage}!</p>
                            <img src={`${import.meta.env.VITE_IMAGEKIT}/tr:w-100/${editImage}`} alt="image to delete"/>
                            <p>Press "Save" to Continue Or "Cansel" to Quit</p>
                        </section>
                    }
                    <div className="cansel-save-btn">
                        <button onClick={onSave}>Save
                        </button>
                        <button onClick={() => setShowPopupEditImage(false)}>Cansel</button>
                    </div>
                </section>
            </div>
        </div>
    );
}
