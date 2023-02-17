import {useNavigate} from "react-router-dom";


export function RegisterPage() {
    const navigate = useNavigate();

    return (
        <div className="register-page">

            <div className="register-card">
                <h2>Register</h2>

                <input type="email" placeholder="Email"/>

                <input type="text" placeholder="password"/>

                <p>forget/change password</p>

                <button onClick={() => navigate("/")}>Submit</button>

            </div>

        </div>
    );
}