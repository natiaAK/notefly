import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import validator from "validator";


function EditNote(props) {

    const getId = secureLocalStorage.getItem("id")
    const getTitle = secureLocalStorage.getItem('title');
    const getBody = secureLocalStorage.getItem('body');
    const getDue_at = secureLocalStorage.getItem('due_at');

    const [title, setTitle] = useState(getTitle);
    const [body, setBody] = useState(getBody);
    const [due_at, setDue] = useState(getDue_at);
    const [dueSpan, setDueSpan] = useState(null);
    const [titleSpan, setTitleSpan] = useState(null);
    const [bodySpan, setBodySpan] = useState(null);
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (id === "title") {
            setTitle(value);
        }
        if (id === "body") {
            setBody(value);
        }
        if (id === "due_at") {
            setDue(value);
        }
    };
    const navigate = useNavigate();

    const UpdateNote = (id) => {
        if (title !== null && title !== "" && body !== null && body !== "" && due_at !== null && due_at !== "" && validator.isLength(title, 0, 100) && validator.isLength(body, 0, 150) && validator.isDate(due_at) && validator.isAfter(due_at)) {
            fetch('http://localhost:3000/updatenote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, title, body, due_at }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Invalid data');
                    }
                })
                .then(data => {
                    navigate('/main');

                })
                .catch((error) => {
                    console.error('There has been a problem with your fetch operation:', error);
                })
        }
        else if (title === null || title === ""  || !validator.isLength(title, 0, 100)) {
            setTitleSpan("Title is empty!");
        }
        else if (body === null || body === "" || !validator.isLength(body, 0, 150)) {
            setBodySpan("Body is empty or too long!");
            setTitleSpan("");
        }
        else if (due_at === null || due_at === "" || !validator.isDate(due_at) || !validator.isAfter(due_at)) {
            setDueSpan("Wrong date!");
            setTitleSpan("");
            setBodySpan("");
        }
        else {
            prompt("Someting went wrong. Try again")
        }
    };

    const cancel = () => {
        navigate("/main");
    };

    const handleKeyPress = (event) => {
        var key = event.key;
        if (key === 'Enter') {
            UpdateNote(getId);
        }
    };

    return (
        <div class="page">
            <Header />
            <div class="main">
                <table id="create-note">
                    <tr><h2>Edit note</h2></tr>
                    <tr>
                        <td><input onKeyDown={(e) => handleKeyPress(e)} id="title" name="Title" type="text" value={title} onChange={(e) => handleInputChange(e)} placeholder="Title" /></td>
                        <td id="titleSpan" >{titleSpan}</td>
                    </tr>
                    <tr>
                        <td><input onKeyDown={(e) => handleKeyPress(e)} id="body" name="Body" type="text" value={body} onChange={(e) => handleInputChange(e)} placeholder="Body" /></td>
                        <td id="titleSpan" >{bodySpan}</td>
                    </tr>
                    <tr>
                        <td><input onKeyDown={(e) => handleKeyPress(e)} id="due_at" name="Due date" type="text" value={due_at} onChange={(e) => handleInputChange(e)} placeholder="Due date" /></td>
                        <td id="titleSpan" >{dueSpan}</td>
                    </tr>
                    <br />
                    <br />
                    <tr>
                        <button onClick={() => UpdateNote(getId)} id="save-note" > Save changes </button>
                        <button onClick={() => cancel()} id="cancel" > Cancel </button>
                    </tr>
                </table>
            </div>
            <Footer />
        </div>
    );
};

export default EditNote;




