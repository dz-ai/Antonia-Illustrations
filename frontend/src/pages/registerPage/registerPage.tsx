import {useNavigate} from "react-router-dom";
import React, {useContext, useState} from "react";
import store from "../../store";
import {observer} from "mobx-react";
import {PopupContext} from "../../components/popupMessage/popupMessage";

interface serverResults {
    isSign: boolean;
    message: string;
    token: string;
}

function RegisterPage() {
    const navigate = useNavigate();
    const popupContext = useContext(PopupContext);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async () => {
        setLoading(true);
        store.verifyToken()
            .then(() => {
                popupContext.showPopup('You are already log');
                navigate(-1);
            }).catch(async () => {
            localStorage.clear()
            const url = import.meta.env.VITE_DEV === 'true' ? import.meta.env.VITE_DEV_SERVER : '';

            const response = await fetch(`${url}/api/users/logIn`, {
                method: 'post',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify({email, password}),
            });
            const results: serverResults = await response.json();

            setLoading(false);

            if (results.token === null || !results.isSign) {
                setMessage(results.message);
            } else {
                popupContext.showPopup('Hello And Welcome!!!');
                localStorage.setItem('token', results.token);
                store.userLogToggle(results.isSign);
                navigate(-1);
            }
        });
    }

    return (
        <div className="register-page">

            <div className="register-card">
                <h2>Register</h2>
                <div className="form">
                    <input type="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           placeholder="Email"/>

                    <input type="password" value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           placeholder="password"/>
                </div>
                {/*<p>forget/change password</p>*/}

                <button onClick={handleSubmit} disabled={!email || !password}>
                    {loading ? <div className="loader"></div> : 'Submit'}
                </button>
                {
                    message &&
                    <p>{message}</p>
                }
            </div>

        </div>
    );
}

export default observer(RegisterPage);
