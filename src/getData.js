import React, { useState } from 'react';
import axios from 'axios';

export default function SecondFile() {

    const [data, setData] = useState([]);

    function getFromDatabase(){
        return null;
    }

    function getFromApi(){
        const url = 'https://api.norsk-tipping.no/LotteryGameInfo/v2/api/results/lotto?fromDate=2022-09-06&toDate=2022-12-21'

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
            <button onClick={getFromApi}>Get info from API</button>
        </div>
    );
}
