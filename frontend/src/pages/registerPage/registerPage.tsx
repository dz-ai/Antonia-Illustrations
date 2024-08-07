import {useLocation, useNavigate} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import store from "../../store";
import {observer} from "mobx-react";
import {PopupContext} from "../../components/popupMessage/popupMessage";

interface serverResults {
    isSign: boolean;
    message: string;
    token: string;
}

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

function RegisterPage() {
    const navigate = useNavigate();
    const query: URLSearchParams = useQuery();
    const emailInUrl: string | null = query.get('email');
    const passwordUrl: string | null = query.get('password');
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
                navigate('/');
            }).catch(async () => {
            localStorage.clear()
            const url = store.url;

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
                navigate('/');
            }
        });
    }

    useEffect(() => {
        if (emailInUrl && passwordUrl) {
            setEmail(emailInUrl);
            setPassword(passwordUrl);
        }
    }, []);

    return (
        <div className="register-page">

            <div className="register-card">
                <h2>Register</h2>
                <div className="form">
                    <input type="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           placeholder="Email"
                           autoComplete="username"/>

                    <input type="password" value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           placeholder="password"
                           autoComplete="current-password"/>
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
