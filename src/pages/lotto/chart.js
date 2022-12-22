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
    const numbers = [1, 2, 3, 4]
/**
    gatherNumbers();

    function gatherNumbers() {
        let numbers = [];
        for (let i = 1; i < data.length; i++) {
            data[i].winnerNumber.forEach((number) => {
                    numbers.push(number)
                }
            )
        }
        console.log(numbers)
        console.log(data[0].winnerNumber)
        return numbers;
    }
*/
    const input = {
        // Can you make the labels to through the number 1 to 34
        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34"],
        datasets: [
            {
                label: "Lotto",
                data: numbers,
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