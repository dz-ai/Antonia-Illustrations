import React, {ChangeEvent, MouseEventHandler, useState} from "react";

interface IProps {
    handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    addImage: MouseEventHandler<HTMLButtonElement>
    clearAllIMages: () => void;
    uploadImage: File | null;
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
    loadingImageUpload: boolean;
}

export function AddImagePopup({
                                  handleFileChange,
                                  addImage,
                                  clearAllIMages,
                                  uploadImage,
                                  setShowPopup,
                                  loadingImageUpload
                              }: IProps) {
    const [showUserPermissionSection, setShowUserPermissionSection] = useState<boolean>(false);

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
                    {/*
                    TODO add category and description
                    */}
                    <section className="btn-section">
                        <button className="upload-btn" onClick={addImage}>
                            {loadingImageUpload ? <div className="loader"></div> : 'Add Image'}
                        </button>
                        <button onClick={() => setShowPopup(false)}>Cansel</button>
                        <button
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