import React, {ChangeEvent, useContext, useState} from "react";
import {IKCore} from "imagekitio-react";
import {PopupContext} from "../popupMessage/popupMessage";
import store from "../../store";

interface IProps {
    clearAllIMages: () => void;
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IImageMetaData {
    fileName: string;
    imageCategory: string;
    imageDescription: string;
    replaceImageWith?: string;
}
// util ver
const devServer = 'http://localhost:3001';
const productServer = 'https://antonia-illustrations.onrender.com';
const dev = import.meta.env.VITE_DEV;

const uploadMetaDataEndpoint: string = `${dev === 'true' ? devServer : productServer}/api/uploadImage/setImageMetaData`;

const imagekit = new IKCore({
    publicKey: "public_mvSjUFM9xBvSh8H9560m37S+jD8=",
    urlEndpoint: "https://ik.imagekit.io/thfdl6dmv",
    authenticationEndpoint: `${dev === 'true' ? devServer : productServer}/api/uploadImage/auth`,
});
// end util ver //

// util functions
export function standardFileName(fileName: string) {
    return fileName.toLowerCase().replace(' ', '_');
}

function checkFileExtension(fileName: string): boolean {
    const imageTypes: string[] = ['png', 'jpeg', 'jpg'];
    return imageTypes.includes(fileName.split('.')[1].toLowerCase());
}

function limitImageSize(file: File): boolean {
    const fileSizeInBytes = file.size;
    return (fileSizeInBytes / 1024 / 1024) < 7;
}

export const handleFileChange = (event: ChangeEvent<HTMLInputElement>, cbSuccess: (file: File, imagePreview: string | ArrayBuffer | null) => void, cbFail: (errorMessage: string) => void): void => {

    if (!event.target.files || !event.target.files[0]) return;

    const file: File = event.target.files[0];

    if (!checkFileExtension(file.name)) {
        cbFail(`${file.name.split('.')[1]} format not supported`);
        return;
    }

    if (!limitImageSize(file)) {
        cbFail('Image size exceeds the 7 MB limit');
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const imagePreview = reader.result;
        cbSuccess(file, imagePreview);
    };
    reader.readAsDataURL(file);
};

export function uploadImageFun(uploadImage: File) {
    return store.verifyToken()
        .then(() => {
            return imagekit.upload({
                file: uploadImage as File,
                fileName: uploadImage.name.toLowerCase(),
                folder: "/antonia-illustrations",
                useUniqueFileName: false,
            });
        })
        .catch(error => Promise.reject(error));
}

export function deleteImage(fileName: string, cbSuccess: (results: any) => void, cbFail: (error: any) => void): void {
    const url = import.meta.env.VITE_DEV === 'true' ? import.meta.env.VITE_DEV_SERVER : '';

    fetch(`${url}/api/uploadImage/deleteImage`, {
        method: 'delete',
        headers: {
            'content-type': 'application/json',
            'auth': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({fileName})
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json();
        })
        .then(cbSuccess)
        .catch(cbFail);
}

export function setImageMetaData(imageID: string | undefined, cbRes: (res: any) => void, cbErr: (error: any) => void, image: IImageMetaData): void {
    const {fileName, imageCategory, imageDescription, replaceImageWith} = image;

    if (fileName) {
        fetch(uploadMetaDataEndpoint,
            {
                method: 'post',
                headers: {
                    'content-type': 'application/json',
                    'auth': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    fileName: standardFileName(fileName),
                    imageCategory,
                    imageDescription,
                    replaceImageWith,
                    imageID,
                })
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then(cbRes)
            .catch(cbErr);
    }
}
// end util functions

export function AddImagePopup({
                                  clearAllIMages,
                                  setShowPopup,
                              }: IProps) {

    const popupContext = useContext(PopupContext);

    const [uploadImage, setUploadImage] = useState<File | null>(null);
    const [uploadImagePreview, setUploadImagePreview] = useState<string | ArrayBuffer | null>(null);
    const [imageCategory, setImageCategory] = useState<string>('');
    const [imageDescription, setImageDescription] = useState<string>('');
    const [loadingImageUpload, setLoadingImageUpload] = useState<boolean>(false);
    const [showUserPermissionSection, setShowUserPermissionSection] = useState<boolean>(false);

    const addImage = (): void => {

        if (!uploadImage) {
            popupContext.showPopup('Please chose an Image file');
            return
        }
        if (!imageCategory || !imageDescription) {
            popupContext.showPopup('Please fill in require fields');
            return;
        }

        const fileName: string = uploadImage.name.toLowerCase();

        if (!checkFileExtension(fileName)) {
            popupContext.showPopup('PDF format not supported');
            setUploadImage(null);
            return;
        }

        setLoadingImageUpload(true);

        uploadImageFun(uploadImage)
            .then((results) => {

                setImageMetaData(results.fileId, results => {
                    setLoadingImageUpload(false);
                    setUploadImage(null);
                    popupContext.showPopup(results);
                    setShowPopup(false);
                }, error => {
                    console.log(error);
                    setLoadingImageUpload(false);
                    setUploadImage(null);
                    popupContext.showPopup('upload error ' + error.message);
                }, {fileName, imageCategory, imageDescription});
            })
            .catch(error => {
                console.log(error);
                setLoadingImageUpload(false);
                setUploadImage(null);
                store.logOut(() => {
                    popupContext.showPopup(error);
                });
                setShowPopup(false);
            });
    }

    const onFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        handleFileChange(event, (file, imagePreview) => {
            setUploadImage(file);
            setUploadImagePreview(imagePreview);
        }, (errorMessage) => {
            popupContext.showPopup(errorMessage);
            setUploadImage(null);
        });
    }

    const checkPasswordBeforeClearAll = (): void => {
        // TODO send req to the server to check password
        // if correct then...
        clearAllIMages();
        setShowPopup(false);
    }

    return (
        // TODO add out click
        <div className="add-image-popup-wrapper">
            <div className="add-image-popup">
                <form>
                    <label>
                        <input type="file" onChange={onFileChange}/>
                        Upload Image
                    </label><br/>
                    <div id="image-upload-indication">
                        {
                            uploadImage === null ?
                                <p>No Image Chosen</p>
                                :
                                <img src={uploadImagePreview as string} alt="image preview"/>
                        }
                    </div>
                    <br/>
                    <div id="image-upload-preview">
                        <input type="text" placeholder="Image Category"
                               onChange={e => setImageCategory(e.target.value)}/>
                        <input type="text" placeholder="Image Description"
                               onChange={e => setImageDescription(e.target.value)}/>
                    </div>
                    <section className="btn-section">
                        <button className="upload-btn" onClick={(e) => {
                            e.preventDefault();
                            addImage();
                        }}>
                            {loadingImageUpload ? <div className="loader"></div> : 'Add Image'}
                        </button>
                        <button onClick={() => setShowPopup(false)}>Close</button>
                        <button
                            disabled={true}
                            onClick={(event) => {
                                event.preventDefault();
                                setShowUserPermissionSection(true)
                            }}>
                            Clear All Images
                        </button>
                    </section>
                </form>
                {
                    showUserPermissionSection &&
                    <div>
                        <p>Do you want to clear all images?!</p>
                        <input type="text" placeholder="Enter password to continue"/>
                        <button onClick={() => checkPasswordBeforeClearAll()}>Clear</button>
                    </div>
                }
            </div>
        </div>
    );
}
