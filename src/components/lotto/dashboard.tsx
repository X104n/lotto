import { FrequencyChart, countMainNumbers, countBonusNumbers, countAllNumbers } from './chart';
import type { DrawResult } from '../../types/lotto';

interface Props {
  data: DrawResult[];
}

// ── helpers ──────────────────────────────────────────────────────────────────

function formatNOK(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} mrd`;
  if (value >= 1_000_000) return `${Math.round(value / 1_000_000)} mill`;
  return value.toLocaleString('nb-NO');
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nb-NO', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

const PRIZE_ORDER = ['7 rette', '6 + 1 rette', '6 rette', '5 rette', '4 rette', 'Supertrekning'];

// ── sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="stat-card">
      <div className="stat-card-label">{label}</div>
      <div className={`stat-card-value${highlight ? ' highlight' : ''}`}>{value}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="section-title">{children}</h2>;
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <span className={`rank-badge${rank <= 3 ? ` rank-${rank}` : ''}`}>
      {rank}
    </span>
  );
}

// ── section: summary ─────────────────────────────────────────────────────────

function Summary({ data }: Props) {
  const counts = countMainNumbers(data);
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  const hotNumber = counts.indexOf(max) + 1;
  const coldNumber = counts.indexOf(min) + 1;

  const totalTurnover = data.reduce((sum, d) => sum + parseFloat(d.turnover), 0);

  const jackpotWinners = data.reduce((sum, d) => {
    const tier = d.prize.find((p) => p.id === 1);
    return sum + (tier ? parseInt(tier.winners) : 0);
  }, 0);

  const dates = data.map((d) => d.drawDate).sort();
  const period = dates.length
    ? `${formatDate(dates[0])} – ${formatDate(dates[dates.length - 1])}`
    : '';

  return (
    <>
      {period && (
        <p style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>
          {data.length} trekkinger · {period}
        </p>
      )}
      <div className="stat-grid">
        <StatCard label="Trekkinger" value={String(data.length)} />
        <StatCard label="Total omsetning" value={`${formatNOK(totalTurnover)} kr`} />
        <StatCard label="7 rette vinnere" value={String(jackpotWinners)} />
        <StatCard label="Varmeste tall 🔥" value={String(hotNumber)} highlight />
        <StatCard label="Kaldeste tall ❄️" value={String(coldNumber)} />
      </div>
    </>
  );
}

// ── section: frequency charts ─────────────────────────────────────────────────

function FrequencyCharts({ data }: Props) {
  const allCounts = countAllNumbers(data);
  const mainCounts = countMainNumbers(data);
  const bonusCounts = countBonusNumbers(data);

  return (
    <>
      <div className="card">
        <SectionTitle>Alle tall (hovedtall + tilleggstall)</SectionTitle>
        <FrequencyChart counts={allCounts} tooltipLabel="Trukket" />
      </div>
      <div className="two-col">
        <div className="card">
          <SectionTitle>Hovedtall</SectionTitle>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            De 7 tallene som trekkes per runde. Disse brukes til jackpot (7 rette).
          </p>
          <FrequencyChart counts={mainCounts} tooltipLabel="Trukket som hovedtall" />
        </div>
        <div className="card">
          <SectionTitle>Tilleggstall</SectionTitle>
          <p style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            1 tall per runde. Gir premie for «6 + 1 rette», men kan ikke vinne jackpot.
          </p>
          <FrequencyChart counts={bonusCounts} tooltipLabel="Trukket som tilleggstall" />
        </div>
      </div>
    </>
  );
}

// ── section: top & bottom 10 ──────────────────────────────────────────────────

function NumberTable({
  title,
  rows,
}: {
  title: string;
  rows: { rank: number; number: number; count: number; pct: number }[];
}) {
  return (
    <div className="card">
      <SectionTitle>{title}</SectionTitle>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Tall</th>
            <th>Trukket</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ rank, number, count, pct }) => (
            <tr key={number}>
              <td><RankBadge rank={rank} /></td>
              <td><strong>{number}</strong></td>
              <td>{count}</td>
              <td style={{ color: 'var(--text-muted)' }}>{pct.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NumberTables({ data }: Props) {
  const counts = countMainNumbers(data);
  const totalDraws = data.length;

  const ranked = counts
    .map((count, i) => ({ number: i + 1, count, pct: totalDraws ? (count / totalDraws) * 100 : 0 }))
    .sort((a, b) => b.count - a.count);

  const top10 = ranked.slice(0, 10).map((r, i) => ({ ...r, rank: i + 1 }));
  const bottom10 = [...ranked].reverse().slice(0, 10).map((r, i) => ({ ...r, rank: i + 1 }));

  return (
    <div className="two-col">
      <NumberTable title="Mest trukne hovedtall" rows={top10} />
      <NumberTable title="Minst trukne hovedtall" rows={bottom10} />
    </div>
  );
}

// ── section: prize stats ──────────────────────────────────────────────────────

function PrizeStats({ data }: Props) {
  const agg: Record<string, { winners: number; totalValue: number }> = {};

  for (const draw of data) {
    for (const prize of draw.prize) {
      if (!agg[prize.name]) agg[prize.name] = { winners: 0, totalValue: 0 };
      const w = parseInt(prize.winners);
      const v = parseInt(prize.value);
      agg[prize.name].winners += w;
      if (!isNaN(v)) agg[prize.name].totalValue += w * v;
    }
  }

  const rows = PRIZE_ORDER.filter((name) => agg[name]).map((name) => ({
    name,
    ...agg[name],
  }));

  return (
    <div className="card">
      <SectionTitle>Premiestatistikk</SectionTitle>
      <table className="data-table">
        <thead>
          <tr>
            <th>Premie</th>
            <th>Vinnere totalt</th>
            <th>Utbetalt totalt</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ name, winners, totalValue }) => (
            <tr key={name}>
              <td><strong>{name}</strong></td>
              <td>{winners.toLocaleString('nb-NO')}</td>
              <td style={{ color: 'var(--text-muted)' }}>
                {totalValue > 0 ? `${formatNOK(totalValue)} kr` : '–'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── section: county winners ───────────────────────────────────────────────────

function CountyStats({ data }: Props) {
  const counts: Record<string, number> = {};
  for (const draw of data) {
    for (const { county } of draw.weekWinnerDetail) {
      if (county) counts[county] = (counts[county] || 0) + 1;
    }
  }

  const ranked = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (ranked.length === 0) return null;

  const maxCount = ranked[0][1];

  return (
    <div className="card">
      <SectionTitle>Flest ukevinnere per fylke</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {ranked.map(([county, count], i) => (
          <div key={county} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ width: '7rem', fontSize: '0.875rem', fontWeight: 500, flexShrink: 0 }}>
              {county}
            </span>
            <div style={{ flex: 1, background: 'var(--border)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${(count / maxCount) * 100}%`,
                  background: i === 0 ? 'var(--red)' : 'rgba(212,16,64,0.4)',
                  borderRadius: 99,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            <span style={{ width: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── main dashboard ────────────────────────────────────────────────────────────

export default function Dashboard({ data }: Props) {
  return (
    <>
      <Summary data={data} />
      <FrequencyCharts data={data} />
      <NumberTables data={data} />
      <div className="two-col">
        <CountyStats data={data} />
      </div>
      <PrizeStats data={data} />
    </>
  );
}
