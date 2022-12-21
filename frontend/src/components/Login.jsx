import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";

function Login() {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "email") {
            setEmail(value.toLowerCase());
        }
        if (id === "password") {
            setPassword(value);
        }
    };

    const navigate = useNavigate();

    const handleKeyPress = (event) => {
        var key = event.key;
        if (key === 'Enter') {
            handleSubmit();
        }
    };
    const handleSubmit = () => {
        fetch(process.env.REACT_APP_BACKEND_SERVER + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (data.db_id) {
                    const dbId = data.db_id;
                    secureLocalStorage.setItem("userId", dbId);
                    return navigate("/main");
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => {
                console.error(error);
            })
    }
        ;

    return (
        <div class="page">
            <Header />
            <div class="main authPage">
                <h2>Log in</h2>
                <input onKeyDown={(e) => handleKeyPress(e)} class="auth" id="email" name="Email" type="email" value={email} onChange={(e) => handleInputChange(e)} placeholder="Email" />
                <br />
                <input onKeyDown={(e) => handleKeyPress(e)} class="auth" id="password" name="password" type="password" value={password} onChange={(e) => handleInputChange(e)} placeholder="password" />
                <br />
                <button onClick={() => handleSubmit()} id="signup-btn" > Log in </button>
            </div>
            <Footer />
        </div>
    );
};

export default Login;




