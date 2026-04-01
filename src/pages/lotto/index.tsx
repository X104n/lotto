import { useState } from 'react';
import { APIData } from '../../getAPIData';
import { Chart } from '../../components/lotto/chart';

type Interval = '1m' | '3m' | '6m' | '1y';

const intervals: { value: Interval; label: string }[] = [
  { value: '1m', label: '1 mnd' },
  { value: '3m', label: '3 mnd' },
  { value: '6m', label: '6 mnd' },
  { value: '1y', label: '1 år' },
];

function getDateRange(interval: Interval): { from: string; to: string } {
  const to = new Date();
  const from = new Date();

  if (interval === '1m') from.setMonth(from.getMonth() - 1);
  else if (interval === '3m') from.setMonth(from.getMonth() - 3);
  else if (interval === '6m') from.setMonth(from.getMonth() - 6);
  else if (interval === '1y') from.setFullYear(from.getFullYear() - 1);

  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  };
}

const Lotto = () => {
  const [activeInterval, setActiveInterval] = useState<Interval | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<unknown[] | undefined>(undefined);

  async function handleIntervalClick(interval: Interval) {
    setActiveInterval(interval);
    setLoading(true);
    const { from, to } = getDateRange(interval);
    const result = await APIData(from, to);
    setData(result);
    setLoading(false);
  }

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
        {loading && <p>Laster...</p>}

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
