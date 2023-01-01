import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import validator from "validator";

function CreateNote() {
    const [title, setTitle] = useState(null);
    const [body, setBody] = useState(null);
    const [due_at, setDue] = useState(null);
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
    const userId = secureLocalStorage.getItem("userId");


    const saveNote = () => {
        if (title !== null && body !== null && due_at !== null && validator.isLength(title, 0, 100) && validator.isLength(body, 0, 150) && validator.isDate(due_at) && validator.isAfter(due_at)) {
            fetch(process.env.REACT_APP_BACKEND_SERVER + '/createnote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, body, due_at, userId }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Invalid data');
                    }
                })
                .then(data => {
                    return navigate("/main");
                })
                .catch((error) => {
                    console.error('There has been a problem with your fetch operation:', error);
                })
        }
        else if (title === null || !validator.isLength(title, 0, 100)) {
            setTitleSpan("Title is empty!");
        }
        else if (body === null || !validator.isLength(body, 0, 150)) {
            setBodySpan("Body is empty or too long! 150 characters is maximum.");
            setTitleSpan("");
        }
        else if (due_at === null || !validator.isDate(due_at) || !validator.isAfter(due_at)) {
            setDueSpan("Wrong date! Date should be in future and YYYY-MM-DD format.");
            setTitleSpan("");
            setBodySpan("");
        }
        else {
            prompt("Someting went wrong. Try again")
        }
    };

    const cancel = () => {
        return navigate("/Main");
    } ;

    const handleKeyPress = (event) => {
        var key = event.key;
        if (key === 'Enter') {
            saveNote();
        }
    };
    return (
        <div class="page">
            <Header />
            <div class="main">
                <table id="create-note">
                    <tr><h2>Enter note details</h2></tr>
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
                        <button onClick={() => saveNote()} id="save-note" > Save note </button>
                        <button onClick={() => cancel()} id="cancel" > Cancel </button>
                    </tr>
                </table>
            </div>
            <Footer />
        </div>
    );
};

export default CreateNote;




