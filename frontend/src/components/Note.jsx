import React from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";


const DoneNote = (id, updateParent) => {
    fetch(process.env.REACT_APP_BACKEND_SERVER + '/donenote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error');
            }

        })
        .then(data => {
            // alert(data);
            updateParent()
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        })
};

const DeleteNote = (id, updateParent) => {
    fetch(process.env.REACT_APP_BACKEND_SERVER + '/deletenote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error');
            }

        })
        .then(data => {
            // alert(data);
            updateParent()
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        })
};

function Note(props) {
    const navigate = useNavigate();
    const Edit = () => {
        secureLocalStorage.setItem("id", props.id);
        secureLocalStorage.setItem("title", props.title);
        secureLocalStorage.setItem("body", props.body);
        secureLocalStorage.setItem("due_at", props.due_at);
        navigate("/editnote");
    };
    return (
        <tr>
            <td class="title">{props.title}</td>
            <td class="body">{props.body}</td>
            <td class="date">{props.due_at}</td>
            <td class="status">{props.status}</td>
            <td> <button onClick={() => DoneNote(props.id, props.setCount(props.count + 1))}>Mark done</button> </td>
            <td> <button onClick={() => Edit()}>Edit</button> </td>
            <td> <button onClick={() => DeleteNote(props.id, props.setCount(props.count + 1))}>Delete</button> </td>
        </tr>
    );
}

export default Note;