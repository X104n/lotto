import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  type TooltipItem,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

interface WinnerNumber {
  number: string;
}

interface DrawResult {
  winnerNumber: WinnerNumber[];
}

interface ChartProps {
  data: DrawResult[];
}

function countByNumber(data: DrawResult[]): number[] {
  const counts = new Array<number>(34).fill(0);
  for (const draw of data) {
    for (const { number } of draw.winnerNumber) {
      const n = Number(number);
      if (n >= 1 && n <= 34) counts[n - 1]++;
    }
  }
  return counts;
}

function barColors(counts: number[]): string[] {
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  const range = max - min || 1;
  return counts.map((c) => {
    const ratio = (c - min) / range;
    const alpha = 0.15 + ratio * 0.85;
    return `rgba(212, 16, 64, ${alpha.toFixed(2)})`;
  });
}

export const Chart = ({ data }: ChartProps) => {
  const counts = countByNumber(data);
  const colors = barColors(counts);
  const labels = Array.from({ length: 34 }, (_, i) => i + 1);

  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);
  const hotNumber = counts.indexOf(maxCount) + 1;
  const coldNumber = counts.indexOf(minCount) + 1;
  const totalDraws = data.length;

  const chartData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: colors,
        borderColor: colors.map((c) => c.replace(/[\d.]+\)$/, '1)')),
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false as const,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2.5,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items: TooltipItem<'bar'>[]) => `Tall ${items[0].label}`,
          label: (item: TooltipItem<'bar'>) =>
            ` Trukket ${item.raw} gang${Number(item.raw) === 1 ? '' : 'er'}`,
        },
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: '#6b7280',
          font: { size: 11 },
        },
      },
      y: {
        grid: { color: '#f0f0f0' },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: '#6b7280',
          font: { size: 11 },
          stepSize: 1,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />

      <div style={{
        display: 'flex',
        gap: '1.5rem',
        marginTop: '1.25rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border)',
        flexWrap: 'wrap',
      }}>
        <Stat label="Trekkinger" value={String(totalDraws)} />
        <Stat label="Varmeste tall" value={String(hotNumber)} highlight />
        <Stat label="Kaldeste tall" value={String(coldNumber)} />
        <Stat label="Maks trukket" value={`${maxCount}×`} />
      </div>
    </div>
  );
};

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>
        {label}
      </div>
      <div style={{
        fontSize: '1.25rem',
        fontWeight: 600,
        color: highlight ? 'var(--red)' : 'var(--text)',
      }}>
        {value}
      </div>
    </div>
  );
}

export default Chart;
