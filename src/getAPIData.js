import React, { useState } from 'react';
import axios from 'axios';

export default function APIData() {

    const [data, setData] = useState(Array());
    const [result, setResult] = useState(null);

    function getFromApi(startDate, endDate) {
        const url = 'https://api.norsk-tipping.no/LotteryGameInfo/v2/api/results/lotto?fromDate=' + startDate + '&toDate=' + endDate;

        axios(url)
            .then(response => {
                const html = response.data;
                for (const outerValue of Object.values(html)) {
                    if (Array.isArray(outerValue)) {
                        for (const innerValue of outerValue) {
                            setData(data.push(innerValue));
                        }
                    }
                }
            }).catch(err => console.log("Error"));
        console.log(data);
    }

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    function handleStartChange(event) {
        setStartDate(event.target.value);
    }

    function handleEndChange(event) {
        setEndDate(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        getFromApi(startDate, endDate);
    }

    return (
        <div>
            <h1>Enter start date, then end date. Output will come in the console</h1>
            <form onSubmit={handleSubmit}>
                <input type="date" id="startDate" name="startDate" value={startDate} onChange={handleStartChange} />
                <input type="date" id="endDate" name="endDate" value={endDate} onChange={handleEndChange} />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
