import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import validator from "validator";


function Signup() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [emailSpan, setEmailSpan] = useState(null);
  const [passwordSpan, setPasswordSpan] = useState(null);
  const [confirmPasswordSpan, setConfirmPasswordSpan] = useState(null);
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "email") {
      setEmail(value.toLowerCase());
    }
    if (id === "password") {
      setPassword(value);
    }
    if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  };
  const navigate = useNavigate();
  const handleKeyPress = (event) => {
    var key = event.key;
    if (key === 'Enter') {
      handleSubmit(email, password, confirmPassword);
    }
  }

  const handleSubmit = (email, password, confirmPassword) => {
    if (email !== null && password !== null && confirmPassword !== null && validator.isEmail(email) && validator.isLength(password, 6, 20) && password === confirmPassword) {
      fetch('BACKEND_SERVER/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, confirmPassword }),
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
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
        ;
    } else if (email === null || !validator.isEmail(email)) {
      setEmailSpan("Wrong email!");
    }
    else if (password === null || !validator.isLength(password, 6, 20)) {
      setPasswordSpan("Invalid password!");
      setEmailSpan("");
    }
    else if (password !== confirmPassword) {
      setConfirmPasswordSpan("Passwords do not match!");
      setPasswordSpan("");
      setEmailSpan("");
    }
    else {
      prompt("Someting went wrong. Try again")
    }
  };
  return (
    <div class="page">
      <Header />
      <div class="main authPage">
        <h2>Sign Up</h2>
        <input onKeyDown={(e) => handleKeyPress(e)} class="auth" id="email" name="email" type="email" value={email} onChange={(e) => handleInputChange(e)} placeholder="Email" required />
        <br />
        <span id="emailSpan" >{emailSpan}</span>
        <br />
        <input onKeyDown={(e) => handleKeyPress(e)} class="auth" id="password" name="password" type="password" minLength="6" value={password} onChange={(e) => handleInputChange(e)} placeholder="Password" required />
        <br />
        <span id="emailSpan" >{passwordSpan}</span>
        <br />
        <input onKeyDown={(e) => handleKeyPress(e)} class="auth" id="confirmPassword" name="Confirm password" type="password" minLength="6" value={confirmPassword} onChange={(e) => handleInputChange(e)} placeholder="Confirm password" required />
        <br />
        <span id="emailSpan" >{confirmPasswordSpan}</span>
        <br />
        <button onClick={() => handleSubmit(email, password, confirmPassword)} type="submit" name="submit" id="signup-btn" > Sign up </button>
      </div>
      <Footer />
    </div>
  );
};
export default Signup;



