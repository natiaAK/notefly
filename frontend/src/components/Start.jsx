import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";


function Start() {
    return (

        <div class="page">
            <Header />
            <div class="main authPage">
                <h2>Please Log in or sign up to continue!</h2>
                <Link to='/login' class="link"> <button class="link-btn"> Log in </button> </Link>
                <br />
                <Link to='/signup' class="link"><button class="link-btn">Sign up</button> </Link>
            </div>
            <Footer />
        </div>
    );
}

export default Start;


