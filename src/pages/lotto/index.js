import React, {useState} from "react";
import {Link} from "react-router-dom";
import {APIData} from "../../getAPIData";
import {Chart} from "./chart";

const Lotto = () => {

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
            <h6>Enter start date, then end date. Output will come in the console</h6>
            <form onSubmit={handleSubmit}>
                <input type="date" id="startDate" name="startDate" value={startDate} onChange={handleStartChange} />
                <input type="date" id="endDate" name="endDate" value={endDate} onChange={handleEndChange} />
                <button type="submit">Submit</button>
            </form>
            {content ? <Chart data={globalData} /> : null}
            <h1></h1>
            <Link to="/">Home</Link>
        </div>
    );
};

export default Lotto;