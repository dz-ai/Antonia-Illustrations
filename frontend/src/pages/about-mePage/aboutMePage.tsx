import {useLocation, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import store from "../../store";
import {observer} from "mobx-react";
import {FiEdit2} from "react-icons/all";
import {PopupContext} from "../../components/popupMessage/popupMessage";


function AboutMePage() {
    const navigate = useNavigate();
    const location = useLocation();

    const popupContext = useContext(PopupContext);

    const url: string = import.meta.env.VITE_DEV === 'true' ? import.meta.env.VITE_DEV_SERVER : '';

    const [text, setText] = useState<string>('');
    const [editText, setEditText] = useState<string>('');
    const [showEditTextPopup, setShowEditTextPopup] = useState<boolean>(false);

    const saveText = () => {
        if (text === editText) {
            popupContext.showPopup('No changes to save');
            return;
        }
        fetch(`${url}/api/aboutMe/editAboutMeText`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'auth': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({text: editText}),
        })
            .then(res => res.json())
            .then(results => {
                setText(results.text);
                popupContext.showPopup('Save Changes');
            })
            .catch(error => {
                console.log(error);
                popupContext.showPopup('Error please check console for more details');
            });
    }

    useEffect(() => {
        fetch(`${url}/api/aboutMe/getAboutMeText`)
            .then(res => res.json())
            .then(results => {
                setText(results.text);
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
                    <div>
                        <img src={'https://ik.imagekit.io/thfdl6dmv/antonia-illustrations/tr:w-250/antonia.png'}
                             alt="Me With a children book"/>
                    </div>
                    {
                        store.isUserLog &&
                        <button onClick={() => {
                            setEditText(text);
                            setShowEditTextPopup(true);
                        }}><FiEdit2/>Edit Text</button>
                    }
                    <p>{text}</p>
                </div>

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
                                saveText();
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