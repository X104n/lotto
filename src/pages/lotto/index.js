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
            <h1>
                Lotto
            </h1>
            <p>
                Vanlig lotto som går på Norsk-Tipping. Velg en start dato og en slutt dato så
                vil det komme en graf som viser antall trekninger av alle tall mellom de to datoene
                du valgte.
            </p>
            <form onSubmit={handleSubmit} className="date">
                <input type="date" className="startDate" value={startDate} onChange={handleStartChange} />
                <input type="date" className="endDate" value={endDate} onChange={handleEndChange} />
                <p></p>
                <button type="submit">Submit</button>
            </form>
            {content ? <Chart data={globalData} /> : null}
            <h1></h1>
        </div>
    );
};

export default Lotto;