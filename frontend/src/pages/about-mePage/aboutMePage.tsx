import {useLocation, useNavigate} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import store from "../../store";
import {observer} from "mobx-react";
import {FiEdit2} from "react-icons/all";
import {PopupContext} from "../../components/popupMessage/popupMessage";
import {ImagesGroupsNamesEnum, PopupEditImage} from "../../components/popupEditImage/popupEditImage";
import {LoadingTextPlaceHolder} from "../../components/loadingTextPlaceHolder/loadingTextPlaceHolder";


function AboutMePage() {
    const navigate = useNavigate();
    const location = useLocation();

    const popupContext = useContext(PopupContext);

    const url: string = import.meta.env.VITE_DEV === 'true' ? import.meta.env.VITE_DEV_SERVER : '';

    const [text, setText] = useState<string>('');
    const [editText, setEditText] = useState<string>('');
    const [showEditTextPopup, setShowEditTextPopup] = useState<boolean>(false);
    const [imageFileName, setImageFileName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // in order to synchronize save(); and delete(); functions with the editPopup component I made them async fun,
    // so they finish update the server and then editPopup continues.
    const save = async (imageName?: string) => {
        if (text === editText && !imageName) {
            popupContext.showPopup('No changes to save');
            return Promise.resolve(false);
        }

        return fetch(`${url}/api/aboutMe/editAboutMe`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'auth': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({newText: editText, newImage: imageName}),
        })
            .then(res => res.json())
            .then(results => {
                setImageFileName(results.image);
                setText(results.text);
                popupContext.showPopup('Save Changes');
                return Promise.resolve(true);
            })
            .catch(error => {
                console.log(error);
                popupContext.showPopup('Error please check console for more details');
                return Promise.reject(false);
            });
    }

    const deleteAboutMeImage = async () => {
        return fetch(`${url}/api/aboutMe/deleteAboutMe`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
                'auth': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({imageToDelete: imageFileName}),
        })
            .then(res => res.json())
            .then(results => {
                setImageFileName(results.image);
                popupContext.showPopup('Image Deleted');
                return Promise.resolve(true);
            })
            .catch(error => {
                console.log(error);
                popupContext.showPopup('Error please check console for more details');
                return Promise.reject(false);
            });
    }

    useEffect(() => {
        setLoading(true);
        fetch(`${url}/api/aboutMe/getAboutMe`)
            .then(res => res.json())
            .then(results => {
                setText(results.text);
                setImageFileName(results.image);
                setLoading(false);
            })
            .catch(error => console.log(error));
    }, []);

    return (
        <div
            className="about-me"
            style={{
                background: `url(https://ik.imagekit.io/thfdl6dmv/antonia-illustrations/purple-plant.jpg) no-repeat center center`,
                backgroundSize: 'cover',
                flex: '1'
            }}
        >
            <div className="blur-about-img">

                <h2>About Me</h2>

                <div className="text-container">
                    {
                        loading &&
                        <LoadingTextPlaceHolder image={true} rows={1}/>
                    }
                    {
                        !loading &&
                        <>
                            <div id="about-me-image">
                                {
                                    imageFileName ?
                                        <PopupEditImage
                                            imagesGroupName={ImagesGroupsNamesEnum.aboutMeImagesGroupName}
                                            imageDetails={{
                                                [`${imageFileName}`]: {
                                                    imageCategory: '',
                                                    imageDescription: ''
                                                }
                                            }}
                                            imageWidth={250}
                                            imageAtr={'About Me Image'}
                                            imageDetailsFields={false}
                                            newImage={false}
                                            onSaveClicked={(imageFileName) => save(imageFileName)}
                                            onDeleteClicked={_ => deleteAboutMeImage()}/>
                                        :
                                        <PopupEditImage
                                            imagesGroupName={ImagesGroupsNamesEnum.aboutMeImagesGroupName}
                                            imageDetails={{['']: {imageCategory: '', imageDescription: ''}}}
                                            imageDetailsFields={false}
                                            onSaveClicked={(imageFileName) => save(imageFileName)}
                                            newImage={true}/>
                                }
                            </div>
                            {
                                store.isUserLog &&
                                <button onClick={() => {
                                    setEditText(text);
                                    setShowEditTextPopup(true);
                                }}><FiEdit2/>Edit Text</button>
                            }
                            <p>{text}</p>
                        </>
                    }
                </div>
                {/* todo Fix bug go back when navigation was done by url */}
                <button
                    className="back-btn"
                    onClick={() => navigate(location.state.prevPath)}
                >
                    ← Back
                </button>
            </div>

            {
                showEditTextPopup &&
                <div className="popup-edit-wrapper">
                    <div className="popup-edit-text">
                        <textarea value={editText} id="about-me" rows={30} cols={60}
                                  onChange={(event) => setEditText(event.target.value)}></textarea>
                        <section>
                            <button onClick={() => {
                                save().then();
                                setShowEditTextPopup(false);
                            }}>Save
                            </button>
                            <button onClick={() => setShowEditTextPopup(false)}>Cansel</button>
                        </section>
                    </div>
                </div>
            }
        </div>
    );
}

export default observer(AboutMePage);