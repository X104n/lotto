import React from "react";
import { useState } from "react";
import {APIData} from "../../getAPIData";
import {Chart} from "./chart";

const ChartButton = () => {

    const [content, setContent] = useState(false);
    const [globalData, setGlobalData] = useState(undefined);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    function handleStartChange(event) {
        setStartDate(event.target.value);
    }

    function handleEndChange(event) {
        setEndDate(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const data = await APIData(startDate, endDate);
        if(data) {
            setContent(true)
            setGlobalData(data)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="date">
                <input type="date" className="startDate" value={startDate} onChange={handleStartChange} />
                <input type="date" className="endDate" value={endDate} onChange={handleEndChange} />
                <p></p>
                <button type="submit">Submit</button>
            </form>
            {content ? <Chart data={globalData} /> : null}
        </div>
    )
}

export default ChartButton;