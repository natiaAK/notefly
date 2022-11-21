import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Start from "./components/Start";
import Note from "./components/Note";
import Main from "./components/Main";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CreateNote from "./components/Note-create";
import EditNote from "./components/Note-edit";


ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/Note" element={<Note />} />
      <Route path="/Main" element={<Main />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/createnote" element={<CreateNote />} />
      <Route path="/editnote" element={<EditNote />} />
    </Routes>
  </Router>,

  document.getElementById("root")
);
