import {useNavigate} from "react-router-dom";
import {useState} from "react";
import store from "../../store";
import {observer} from "mobx-react";

interface serverResults {
    isSign: boolean;
    message: string;
    token: string;
}

function RegisterPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [message, setMessage] = useState<string>('');

    const handleSubmit = async () => {
        localStorage.clear()
        const url = import.meta.env.VITE_DEV === 'true' ? import.meta.env.VITE_DEV_SERVER : '';

        const response = await fetch(`${url}/api/users/logIn`, {
            method: 'post',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({email, password}),
        });
        const results: serverResults = await response.json();

        if (results.token === null || !results.isSign) {
            setMessage(results.message);
        } else {
            // TODO popup message
            localStorage.setItem('token', results.token);
            store.userLogToggle(results.isSign);
            navigate("/");
            setMessage(results.message);
        }
    }

    return (
        <div className="register-page">

            <div className="register-card">
                <h2>Register</h2>
                {/*TODO make it to be fill with google auto complete*/}
                <form>
                    <input type="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           placeholder="Email"
                           autoComplete="username"/>

                    <input type="text" value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           placeholder="password"
                           autoComplete="current-password"/>
                </form>
                <p>forget/change password</p>

                <button onClick={handleSubmit} disabled={!email || !password}>Submit</button>
                {
                    message &&
                    <p>{message}</p>
                }
            </div>

        </div>
    );
}

export default observer(RegisterPage);
