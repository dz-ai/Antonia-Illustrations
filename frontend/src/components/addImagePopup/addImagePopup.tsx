import React, {ChangeEvent, useEffect, useState} from "react";
import {IKCore} from "imagekitio-react";

interface IProps {
    clearAllIMages: () => void;
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

// util functions
function standardFileName(fileName: string) {
    return fileName.toLowerCase().replace(' ', '_');
}

function checkFileExtension(fileName: string): boolean {
    const imageTypes: string[] = ['png', 'jpeg', 'jpg'];
    return imageTypes.includes(fileName.split('.')[1].toLowerCase());
}

//
export function AddImagePopup({
                                  clearAllIMages,
                                  setShowPopup,
                                  setMessage,
                              }: IProps) {

    const url = import.meta.env.VITE_DEV === 'true' ? import.meta.env.VITE_DEV_SERVER : '';

    const [uploadImage, setUploadImage] = useState<File | null>(null);
    const [imageCategory, setImageCategory] = useState<string>('');
    const [imageDescription, setImageDescription] = useState<string>('');
    const [loadingImageUpload, setLoadingImageUpload] = useState<boolean>(false);
    const [showUserPermissionSection, setShowUserPermissionSection] = useState<boolean>(false);


    const publicKey: string = "public_mvSjUFM9xBvSh8H9560m37S+jD8=";
    let urlEndpoint: string = "https://ik.imagekit.io/thfdl6dmv";
    const authenticationEndpoint: string = `${url}/api/uploadImage/auth`;
    const uploadMetaDataEndpoint: string = `${url}/api/uploadImage/setImageMetaData`;

    const imagekit = new IKCore({
        publicKey,
        urlEndpoint,
        authenticationEndpoint
    });

    const addImage = (): void => {

        if (!uploadImage) {
            setMessage('Please chose an Image file')
            return
        }
        if (!imageCategory || !imageDescription) {
            setMessage('Please fill in require fields');
            return;
        }

        const fileName: string = uploadImage.name.toLowerCase();

        if (!checkFileExtension(fileName)) {
            setMessage('PDF format not supported');
            setUploadImage(null);
            return;
        }

        setLoadingImageUpload(true);

        imagekit.upload({
            file: uploadImage as File,
            fileName,
            folder: "/antonia-illustrations",
            useUniqueFileName: false,
        })
            .then(_ => {
                fetch(uploadMetaDataEndpoint,
                    {
                        method: 'post',
                        headers: {'content-type': 'application/json'},
                        body: JSON.stringify({
                            fileName: standardFileName(uploadImage.name),
                            imageCategory,
                            imageDescription
                        })
                    })
                    .then(res => res.json())
                    .then(results => {
                        setLoadingImageUpload(false);
                        setUploadImage(null);
                        setMessage(results);
                        setShowPopup(false);
                    })
            })
            .catch(error => {
                console.log(error);
                setLoadingImageUpload(false);
                setUploadImage(null);
                setMessage('upload error');
            });
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        if (!event.target.files || !event.target.files[0]) return;

        if (event.target.files && !checkFileExtension(event.target.files[0].name)) {
            setMessage(`${event.target.files[0].name.split('.')[1]} format not supported`);
            setUploadImage(null);
            return
        } else {
            setUploadImage(event.target.files[0]);
        }
    };

    const checkPasswordBeforeClearAll = (): void => {
        // TODO send req to the server to check password
        // if correct then...
        clearAllIMages();
        setShowPopup(false);
    }

    useEffect(() => {
        console.log('run')
        fetch(authenticationEndpoint).then(res => res.json()).then(results => console.log(results));
    }, []);

    return (
        // TODO add out click
        <div className="add-image-popup-wrapper">
            <div className="add-image-popup">
                <form>
                    <label>
                        <input type="file" onChange={handleFileChange}/>
                        Upload Image
                    </label><br/>
                    <div id="image-upload-indication">
                        <p>Image:</p>
                        {
                            uploadImage === null ?
                                <p>No Image Chosen</p>
                                :
                                <p>{uploadImage.name}</p>
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
