'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import type { SportType, OddsenEvent, Market, LiveData } from '../../types/oddsen';

const BASE = 'https://api.norsk-tipping.no/OddsenGameInfo/v1/api';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toApiDateTime(d: Date, endOfDay = false): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${endOfDay ? '2359' : '0000'}`;
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function formatDayTab(offset: number): string {
  if (offset === 0) return 'I dag';
  if (offset === 1) return 'I morgen';
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('nb-NO', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatDayTitle(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' });
}

const SPORT_EMOJI: Record<string, string> = {
  FBL: '⚽', HKY: '🏒', TNS: '🎾', BKB: '🏀', HBL: '🤾', VBL: '🏐',
  UFB: '🏈', GLF: '⛳', CYC: '🚴', DAR: '🎯', BOX: '🥊', RBL: '🏉',
  RBU: '🏉', BSB: '⚾', SNK: '🎱', TBT: '🏓', MSP: '🏎', CST: '🎮',
  DOT: '🎮', LOL: '🎮', BAD: '🏸', BSC: '⚽', FO1: '🏎', MCG: '🏍',
};

// Sports shown as quick-pick chips — everything else goes in the dropdown
const POPULAR_SPORT_IDS = ['FBL', 'HKY', 'TNS', 'HBL', 'BKB', 'DAR'];

function sportEmoji(id: string) { return SPORT_EMOJI[id] ?? '🏆'; }
function capitalizeSport(s: string) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); }

// Shorten an odds label to at most 3 chars for the compact row display
function shortLabel(value: string | undefined): string {
  if (!value) return '';
  return value.length > 3 ? value.slice(0, 3) : value;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LiveBadge({ time }: { time?: string }) {
  return (
    <span className="live-badge">
      <span className="live-dot" />
      {time ? `${time}'` : 'LIVE'}
    </span>
  );
}

function OddsBtn({ label, value }: { label: string; value: string }) {
  return (
    <div className="odds-btn">
      <span className="odds-label">{shortLabel(label)}</span>
      <span className="odds-value">{value}</span>
    </div>
  );
}

function MarketCard({ market }: { market: Market }) {
  return (
    <div className="market-card">
      <div className="market-name">{market.marketName}</div>
      <div className="market-selections">
        {market.selections.map((sel) => (
          <div key={sel.selectionId} className="selection-btn" title={sel.selectionName}>
            <span className="selection-label">{shortLabel(sel.selectionValue)}</span>
            <span className="selection-name-text">{sel.selectionShortName || sel.selectionName}</span>
            <span className="selection-odds">{sel.selectionOdds}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function OddsenPage() {
  const [sportTypes, setSportTypes] = useState<SportType[]>([]);
  const [activeSport, setActiveSport] = useState('FBL');
  const [mode, setMode] = useState<'upcoming' | 'live'>('upcoming');
  const [dayOffset, setDayOffset] = useState(0);
  const [events, setEvents] = useState<OddsenEvent[]>([]);
  const [liveEvents, setLiveEvents] = useState<OddsenEvent[]>([]);
  const [liveData, setLiveData] = useState<Record<string, LiveData>>({});
  const [liveCount, setLiveCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedMarkets, setExpandedMarkets] = useState<Market[] | null>(null);
  const [marketsLoading, setMarketsLoading] = useState(false);

  // Load sport types once
  useEffect(() => {
    axios.get<{ sportTypeList: SportType[] }>(`${BASE}/sportTypes`)
      .then((res) => {
        const data = res.data?.sportTypeList ?? [];
        data.sort((a, b) => a.sportName.localeCompare(b.sportName, 'nb'));
        setSportTypes(data);
      })
      .catch(console.error);
  }, []);

  // Refresh live count whenever active sport changes
  useEffect(() => {
    axios.get<{ eventList: OddsenEvent[] }>(`${BASE}/liveevents/${activeSport}`)
      .then((res) => setLiveCount(res.data?.eventList?.length ?? 0))
      .catch(() => setLiveCount(0));
  }, [activeSport]);

  // Fetch events when sport/day/mode changes
  useEffect(() => {
    setExpandedId(null);
    setExpandedMarkets(null);
    setLoading(true);

    if (mode === 'upcoming') {
      const d = new Date();
      d.setDate(d.getDate() + dayOffset);
      const from = toApiDateTime(d, false);
      const to = toApiDateTime(d, true);
      axios.get<{ eventList: OddsenEvent[] }>(`${BASE}/events/${activeSport}/${from}/${to}`)
        .then((res) => setEvents(res.data?.eventList ?? []))
        .catch(() => setEvents([]))
        .finally(() => setLoading(false));
    } else {
      axios.get<{ eventList: OddsenEvent[] }>(`${BASE}/liveevents/${activeSport}`)
        .then(async (res) => {
          const evts: OddsenEvent[] = res.data?.eventList ?? [];
          setLiveEvents(evts);
          setLiveCount(evts.length);
          const map: Record<string, LiveData> = {};
          await Promise.all(
            evts.map((e) =>
              axios.get<LiveData>(`${BASE}/livedata/${e.eventId}`)
                .then((r) => { map[e.eventId] = r.data; })
                .catch(() => {})
            )
          );
          setLiveData(map);
        })
        .catch(() => setLiveEvents([]))
        .finally(() => setLoading(false));
    }
  }, [activeSport, dayOffset, mode]);

  async function handleEventClick(eventId: string) {
    if (expandedId === eventId) {
      setExpandedId(null);
      setExpandedMarkets(null);
      return;
    }
    setExpandedId(eventId);
    setExpandedMarkets(null);
    setMarketsLoading(true);
    try {
      const res = await axios.get<{ markets: Market[] }>(`${BASE}/markets/${eventId}`);
      setExpandedMarkets(res.data?.markets ?? []);
    } catch {
      setExpandedMarkets([]);
    }
    setMarketsLoading(false);
  }

  function groupByTournament(evts: OddsenEvent[]): [string, OddsenEvent[]][] {
    const map: Record<string, OddsenEvent[]> = {};
    for (const e of evts) {
      const key = e.tournament?.name ?? e.country?.name ?? 'Annet';
      if (!map[key]) map[key] = [];
      map[key].push(e);
    }
    return Object.entries(map);
  }

  const popularSports = sportTypes.filter((s) => POPULAR_SPORT_IDS.includes(s.sportId))
    .sort((a, b) => POPULAR_SPORT_IDS.indexOf(a.sportId) - POPULAR_SPORT_IDS.indexOf(b.sportId));
  const activeIsPopular = POPULAR_SPORT_IDS.includes(activeSport);
  const activeSportName = sportTypes.find((s) => s.sportId === activeSport)?.sportName ?? activeSport;

  const currentEvents = mode === 'live' ? liveEvents : events;
  const grouped = groupByTournament(currentEvents);

  return (
    <div className="theme-oddsen">
      {/* Header */}
      <div className="card">
        <h1>Oddsen ⚽</h1>
        <p style={{ margin: 0 }}>
          Kommende kamper og live odds fra Norsk Tippings sportsbook.
          Data hentes direkte fra Norsk Tippings åpne API.
        </p>
      </div>

      {/* Sport selector: popular chips + dropdown for all */}
      <div className="sport-selector">
        <div className="sport-chips">
          {popularSports.map((s) => (
            <button
              key={s.sportId}
              className={`sport-chip${activeSport === s.sportId ? ' active' : ''}`}
              onClick={() => setActiveSport(s.sportId)}
            >
              {sportEmoji(s.sportId)} {capitalizeSport(s.sportName)}
            </button>
          ))}
          {/* Show the active non-popular sport as a chip too */}
          {!activeIsPopular && (
            <span className="sport-chip active">
              {sportEmoji(activeSport)} {capitalizeSport(activeSportName)}
            </span>
          )}
        </div>
        <select
          className="sport-select"
          value={activeSport}
          onChange={(e) => setActiveSport(e.target.value)}
          aria-label="Velg idrett"
        >
          {sportTypes.map((s) => (
            <option key={s.sportId} value={s.sportId}>
              {capitalizeSport(s.sportName)}
            </option>
          ))}
        </select>
      </div>

      {/* Mode toggle */}
      <div className="tab-bar">
        <button
          className={`btn-tab${mode === 'upcoming' ? ' active' : ''}`}
          onClick={() => setMode('upcoming')}
        >
          Kommende
        </button>
        <button
          className={`btn-tab${mode === 'live' ? ' active' : ''}`}
          onClick={() => setMode('live')}
        >
          Live {liveCount > 0 && <span className="live-count">{liveCount}</span>}
        </button>
        {mode === 'live' && (
          <button
            className="btn-tab"
            style={{ marginLeft: 'auto' }}
            onClick={() => {
              setMode('upcoming');
              setTimeout(() => setMode('live'), 0);
            }}
          >
            ↺ Oppdater
          </button>
        )}
      </div>

      {/* Day tabs — upcoming only */}
      {mode === 'upcoming' && (
        <div className="day-tabs">
          {[0, 1, 2, 3, 4, 5, 6].map((offset) => (
            <button
              key={offset}
              className={`day-tab${dayOffset === offset ? ' active' : ''}`}
              onClick={() => setDayOffset(offset)}
            >
              {formatDayTab(offset)}
            </button>
          ))}
        </div>
      )}

      {/* Event list */}
      {loading ? (
        <div className="card">
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Henter kamper...</p>
        </div>
      ) : currentEvents.length === 0 ? (
        <div className="card">
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>
            {mode === 'live'
              ? 'Ingen live-kamper akkurat nå.'
              : `Ingen kamper funnet for ${formatDayTitle(dayOffset)}.`}
          </p>
        </div>
      ) : (
        grouped.map(([tournament, evts]) => (
          <div key={tournament} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="tournament-header">
              {evts[0]?.country?.name && evts[0].country.name !== tournament
                ? `${evts[0].country.name} · ${tournament}`
                : tournament}
            </div>

            {evts.map((event, i) => {
              const ld = liveData[event.eventId];
              const isExpanded = expandedId === event.eventId;
              const isLast = i === evts.length - 1;

              return (
                <div key={event.eventId}>
                  <div
                    className={`event-row${isExpanded ? ' expanded' : ''}${isLast && !isExpanded ? ' last' : ''}`}
                    onClick={() => handleEventClick(event.eventId)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleEventClick(event.eventId)}
                  >
                    {/* Time / live */}
                    <div className="event-time">
                      {mode === 'live' && ld
                        ? <LiveBadge time={ld.matchTime} />
                        : formatTime(event.startTime)}
                    </div>

                    {/* Teams */}
                    <div className="event-teams">
                      {event.homeParticipant && event.awayParticipant ? (
                        <span className="event-matchup">
                          <span className="event-team-name">{event.homeParticipant}</span>
                          <span className="event-vs">–</span>
                          <span className="event-team-name">{event.awayParticipant}</span>
                        </span>
                      ) : (
                        <span className="event-team-name">{event.eventName}</span>
                      )}
                    </div>

                    {/* Score (live only) */}
                    {mode === 'live' && ld?.currentScore != null && (
                      <div className="live-score">
                        {ld.currentScore.home}–{ld.currentScore.away}
                      </div>
                    )}

                    {/* Main market odds */}
                    {event.mainMarket?.selections && event.mainMarket.selections.length > 0 && (
                      <div className="odds-row">
                        {event.mainMarket.selections.map((sel) => (
                          <OddsBtn key={sel.selectionId} label={sel.selectionValue} value={sel.selectionOdds} />
                        ))}
                      </div>
                    )}

                    <span className="event-chevron">{isExpanded ? '▲' : '▼'}</span>
                  </div>

                  {/* Expanded: all markets */}
                  {isExpanded && (
                    <div className={`markets-panel${isLast ? ' last' : ''}`}>
                      {marketsLoading ? (
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Henter markeder...</p>
                      ) : expandedMarkets && expandedMarkets.length > 0 ? (
                        <div className="markets-grid">
                          {expandedMarkets.map((m) => (
                            <MarketCard key={m.marketId} market={m} />
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Ingen markeder tilgjengelig.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
