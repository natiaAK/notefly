import React, { useState, useEffect } from 'react';
import Header from "./Header";
import Footer from "./Footer";
import Today from "./Today";
import Note from "./Note";
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";

function Home() {
  const [data, setData] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate("/createnote");
  };

  const userId = secureLocalStorage.getItem("userId");

  const getInitialSort = () => {
    const sortValue = 5;
    return sortValue;
  };

  const [sortValue, setValue] = useState(getInitialSort);

  const handleSort = (e) => {
    setValue(e.target.value);

  };

  function creatNote(note) {
    return (
      <Note
        key={note.id}
        id={note.id}
        title={note.title}
        body={note.body}
        due_at={note.due_at}
        status={note.status}
        count={count}
        setCount={setCount}
        userId={userId}
      />
    );
  };

  const getData = async (id) => {
    try {
      const response = await fetch('BACKEND_SERVER/getnotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sortValue, userId }),
      });
      if (!response.ok) {
        throw new Error(
          `This is an HTTP error: The status is ${response.status}`
        );
      }
      let actualData = await response.json();
      setData(actualData);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getData(userId)
  }, [sortValue, count])

  const logout = () => {
    fetch('BACKEND_SERVER/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error');
        }
        console.log(response);
        return navigate('/');
      })
      .then(data => {
        secureLocalStorage.clear();
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      })
  }
    ;


  return (
    <div class="page">
      <Header /><button id="logout-btn" onClick={logout}>Log out</button>
      <Today />
      <div class="main">
      <h2 id="note-list">My notes <img onClick={() => handleAdd()} src="../images/add.png" />

        <label for="notes"><img id="arrow-img" src="../images/down-arrow.png" /></label>
        <select value={sortValue} onChange={handleSort} name="notes">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </h2>
      <div id="note">
        <table>
          <th class="title">Title</th>
          <th class="body">Description</th>
          <th class="date">Due date</th>
          <th class="status">Status</th>
          <th> </th>
          <th> </th>
          <th> </th>
          {data && data.map(creatNote)}
        </table>
      </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
