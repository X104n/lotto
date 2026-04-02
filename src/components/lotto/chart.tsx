import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  type TooltipItem,
} from 'chart.js';
import type { DrawResult } from '../../types/lotto';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

// ── counting functions ────────────────────────────────────────────────────────

export function countMainNumbers(data: DrawResult[]): number[] {
  const counts = new Array<number>(34).fill(0);
  for (const draw of data) {
    for (const { number, type } of draw.winnerNumber) {
      if (type === 1) {
        const n = Number(number);
        if (n >= 1 && n <= 34) counts[n - 1]++;
      }
    }
  }
  return counts;
}

export function countBonusNumbers(data: DrawResult[]): number[] {
  const counts = new Array<number>(34).fill(0);
  for (const draw of data) {
    for (const { number, type } of draw.winnerNumber) {
      if (type === 2) {
        const n = Number(number);
        if (n >= 1 && n <= 34) counts[n - 1]++;
      }
    }
  }
  return counts;
}

export function countAllNumbers(data: DrawResult[]): number[] {
  const counts = new Array<number>(34).fill(0);
  for (const draw of data) {
    for (const { number } of draw.winnerNumber) {
      const n = Number(number);
      if (n >= 1 && n <= 34) counts[n - 1]++;
    }
  }
  return counts;
}

// ── chart component ───────────────────────────────────────────────────────────

function barColors(counts: number[], colorRgb: string): string[] {
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  const range = max - min || 1;
  return counts.map((c) => {
    const alpha = 0.15 + ((c - min) / range) * 0.85;
    return `rgba(${colorRgb}, ${alpha.toFixed(2)})`;
  });
}

interface FrequencyChartProps {
  counts: number[];
  tooltipLabel?: string;
  colorRgb?: string;
}

export function FrequencyChart({ counts, tooltipLabel = 'Trukket', colorRgb = '212, 16, 64' }: FrequencyChartProps) {
  const colors = barColors(counts, colorRgb);

  const chartData = {
    labels: Array.from({ length: counts.length }, (_, i) => i + 1),
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
    aspectRatio: 2.2,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items: TooltipItem<'bar'>[]) => `Tall ${items[0].label}`,
          label: (item: TooltipItem<'bar'>) =>
            ` ${tooltipLabel} ${item.raw} gang${Number(item.raw) === 1 ? '' : 'er'}`,
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
        ticks: { color: '#6b7280', font: { size: 11 } },
      },
      y: {
        grid: { color: '#f0f0f0' },
        border: { display: false, dash: [4, 4] },
        ticks: { color: '#6b7280', font: { size: 11 }, stepSize: 1 },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default FrequencyChart;
