import React from "react";
import {Bar} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

export const Chart = (props) => {

    const data = props.data;

    function gatherNumbers() {
        let numbers = [];
        for (let i = 0; i < data.length; i++) {
            data[i].winnerNumber.forEach(winnerNumbers => {
                    numbers.push(winnerNumbers['number'])
                }
            )
        }
        return numbers;
    }

    function countNumbers(numbers) {
        let data = [];
        for (let i = 1; i <= 34; i++) {
            let count = 0;
            for (let j = 0; j < numbers.length; j++) {
                if (i === numbers[j]) {
                    count++;
                }
            }
            data.push(count);
        }
        return data;
    }

    const input = {
        // Can you make the labels to through the number 1 to 34
        labels: Array.from({length: 34}, (value, index) => index + 1),
        datasets: [
            {
                label: "Antall",
                data: countNumbers(gatherNumbers()),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            }
        ]
    }


    return (
        <Bar data={input}/>
    );
};

export default Chart;