import { useState } from 'react';
import { APIData, type FetchProgress } from '../../getAPIData';
import { Chart } from '../../components/lotto/chart';

type Interval = '1m' | '3m' | '6m' | '1y' | '3y' | '5y' | '10y';

const intervals: { value: Interval; label: string }[] = [
  { value: '1m', label: '1 mnd' },
  { value: '3m', label: '3 mnd' },
  { value: '6m', label: '6 mnd' },
  { value: '1y', label: '1 år' },
  { value: '3y', label: '3 år' },
  { value: '5y', label: '5 år' },
  { value: '10y', label: '10 år' },
];

function getDateRange(interval: Interval): { from: string; to: string } {
  const to = new Date();
  const from = new Date();

  if (interval === '1m') from.setMonth(from.getMonth() - 1);
  else if (interval === '3m') from.setMonth(from.getMonth() - 3);
  else if (interval === '6m') from.setMonth(from.getMonth() - 6);
  else if (interval === '1y') from.setFullYear(from.getFullYear() - 1);
  else if (interval === '3y') from.setFullYear(from.getFullYear() - 3);
  else if (interval === '5y') from.setFullYear(from.getFullYear() - 5);
  else if (interval === '10y') from.setFullYear(from.getFullYear() - 10);

  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  };
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${day}.${month}.${year}`;
}

const Lotto = () => {
  const [activeInterval, setActiveInterval] = useState<Interval | null>(null);
  const [progress, setProgress] = useState<FetchProgress | null>(null);
  const [data, setData] = useState<unknown[] | undefined>(undefined);

  async function handleIntervalClick(interval: Interval) {
    setActiveInterval(interval);
    setData(undefined);
    setProgress(null);

    const { from, to } = getDateRange(interval);
    const result = await APIData(from, to, setProgress);

    setData(result);
    setProgress(null);
  }

  const loading = progress !== null;

  return (
    <>
      <div className="card">
        <h1>Lotto 🎰</h1>
        <p>Velg en periode for å se hvor mange ganger hvert tall er trukket.</p>
      </div>

      <div className="tab-bar">
        {intervals.map(({ value, label }) => (
          <button
            key={value}
            className={`btn-tab${activeInterval === value ? ' active' : ''}`}
            onClick={() => handleIntervalClick(value)}
            disabled={loading}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card">
        {loading && progress && (
          <div className="fetch-progress">
            <div className="fetch-progress-header">
              <span className="fetch-progress-label">Henter trekningstall...</span>
              <span className="fetch-progress-count">
                {progress.current} av {progress.total}
              </span>
            </div>
            <div className="fetch-progress-bar-track">
              <div
                className="fetch-progress-bar-fill"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
            <div className="fetch-progress-dates">
              {formatDate(progress.from)} &rarr; {formatDate(progress.to)}
            </div>
          </div>
        )}

        {!loading && data && data.length > 0 && (
          <Chart data={data as Parameters<typeof Chart>[0]['data']} />
        )}

        {!loading && data && data.length === 0 && (
          <p>Ingen trekningstall funnet for denne perioden.</p>
        )}

        {!loading && !data && (
          <p style={{ color: 'var(--text-muted)' }}>Velg en periode ovenfor.</p>
        )}
      </div>
    </>
  );
};

export default Lotto;
