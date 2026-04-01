import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface WinnerNumber {
  number: string;
}

interface DrawResult {
  winnerNumber: WinnerNumber[];
}

interface ChartProps {
  data: DrawResult[];
}

export const Chart = ({ data }: ChartProps) => {
  function gatherNumbers(): number[] {
    const numbers: number[] = [];
    for (let i = 0; i < data.length; i++) {
      data[i].winnerNumber.forEach((winnerNumbers) => {
        numbers.push(Number(winnerNumbers.number));
      });
    }
    return numbers;
  }

  function countNumbers(numbers: number[]): number[] {
    const counts: number[] = [];
    for (let i = 1; i <= 34; i++) {
      let count = 0;
      for (let j = 0; j < numbers.length; j++) {
        if (i === numbers[j]) count++;
      }
      counts.push(count);
    }
    return counts;
  }

  const input = {
    labels: Array.from({ length: 34 }, (_, index) => index + 1),
    datasets: [
      {
        label: 'Antall',
        data: countNumbers(gatherNumbers()),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={input} />;
};

export default Chart;
