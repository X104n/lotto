import { FrequencyChart } from '../lotto/chart';
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

// Viking Lotto: 6 main numbers from 1–48
function countMainNumbers(data: DrawResult[]): number[] {
  const counts = new Array<number>(48).fill(0);
  for (const draw of data) {
    for (const { number, type } of (draw.winnerNumber ?? [])) {
      if (type === 1) {
        const n = Number(number);
        if (n >= 1 && n <= 48) counts[n - 1]++;
      }
    }
  }
  return counts;
}

// Viking Lotto: 1 vikingtall from 1–5
function countVikingNumbers(data: DrawResult[]): number[] {
  const counts = new Array<number>(5).fill(0);
  for (const draw of data) {
    for (const { number, type } of (draw.winnerNumber ?? [])) {
      if (type === 2) {
        const n = Number(number);
        if (n >= 1 && n <= 5) counts[n - 1]++;
      }
    }
  }
  return counts;
}

const PRIZE_ORDER = ['6+1', '6+0', '5+1', '5+0', '4', '3'];

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
  const mainCounts = countMainNumbers(data);
  const vikingCounts = countVikingNumbers(data);

  const maxMain = Math.max(...mainCounts);
  const minMain = Math.min(...mainCounts);
  const hotMain = mainCounts.indexOf(maxMain) + 1;
  const coldMain = mainCounts.indexOf(minMain) + 1;
  const hotViking = vikingCounts.indexOf(Math.max(...vikingCounts)) + 1;

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
        <StatCard label="Norsk omsetning" value={`${formatNOK(totalTurnover)} kr`} />
        <StatCard label="Jackpot vinnere (6+1)" value={String(jackpotWinners)} />
        <StatCard label="Varmeste tall 🔥" value={String(hotMain)} highlight />
        <StatCard label="Kaldeste tall ❄️" value={String(coldMain)} />
        <StatCard label="Varmeste vikingtall" value={String(hotViking)} highlight />
      </div>
    </>
  );
}

// ── section: frequency charts ─────────────────────────────────────────────────

function FrequencyCharts({ data }: Props) {
  const mainCounts = countMainNumbers(data);
  const vikingCounts = countVikingNumbers(data);

  return (
    <>
      <div className="card">
        <SectionTitle>Hovedtall (1–48)</SectionTitle>
        <p style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>
          6 tall trekkes per runde. Brukes til jackpot (6+1) og de øvrige premienivåene.
        </p>
        <FrequencyChart counts={mainCounts} tooltipLabel="Trukket som hovedtall" colorRgb="26, 111, 212" />
      </div>
      <div className="card">
        <SectionTitle>Vikingtall (1–5)</SectionTitle>
        <p style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>
          1 tall trekkes per runde fra 1–5. Nødvendig for jackpot (6+1), men kan ikke vinne jackpoten alene.
        </p>
        <FrequencyChart counts={vikingCounts} tooltipLabel="Trukket som vikingtall" colorRgb="26, 111, 212" />
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
    for (const prize of (draw.prize ?? [])) {
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

// ── main dashboard ────────────────────────────────────────────────────────────

export default function Dashboard({ data }: Props) {
  return (
    <>
      <Summary data={data} />
      <FrequencyCharts data={data} />
      <NumberTables data={data} />
      <PrizeStats data={data} />
    </>
  );
}
