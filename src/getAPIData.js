import React, { useState } from 'react';
import axios from 'axios';

export default function SecondFile() {

    const [data, setData] = useState([]);
    const [result, setResult] = useState(null);

    function getFromApi(startDate, endDate) {
        const url = 'https://api.norsk-tipping.no/LotteryGameInfo/v2/api/results/lotto?fromDate=' + startDate + '&toDate=' + endDate;

        axios(url)
            .then(response => {
                const html = response.data;
                for (const outerValue of Object.values(html)) {
                    if (Array.isArray(outerValue)) {
                        for (const innerValue of outerValue) {
                            console.log(innerValue);
                        }
                    }
                }
            }).catch(err => console.log("Error"));
    }

    return (
        <div>
            <h1>This is where some sicko data should come</h1>
            <button onClick={() => getFromApi("2022-09-10", "2022-12-22")}>Get info from API</button>
        </div>
    );
}
