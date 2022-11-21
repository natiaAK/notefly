import React from "react";

function Today() {
    const currentDay = new Date().toISOString().slice(0, 10);
    const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const d = new Date();
    const weekday = weekdays[d.getDay()];

    return (
        <div>
            <h1 id="today">{currentDay} <br/> {weekday}</h1>           
        </div>
    );
}

export default Today;


