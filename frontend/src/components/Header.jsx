import React from "react";
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";


function Header() {
    const navigate = useNavigate();
    const userId = secureLocalStorage.getItem("userId");
    const mainStart = () => {
        if (userId){
            return navigate("/Main");
        } else {
            return navigate("/");
        }       
    } ;
    return (
        <header>
            <h1 id="logo" onClick={() => mainStart()} >NoteFly</h1>
        </header>
    );
}

export default Header;


