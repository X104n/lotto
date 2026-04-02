export interface SportType {
  sportId: string;
  sportName: string;
}

export interface Selection {
  selectionId: string;
  selectionValue: string;
  selectionName: string;
  selectionShortName: string;
  selectionOdds: string;
}

export interface Market {
  marketId: string;
  marketName: string;
  selections: Selection[];
  marketLineType: string | null;
  betStart: string;
  betStop: string;
  live: boolean;
}

export interface TournamentOrCountry {
  id: string;
  name: string;
}

export interface OddsenEvent {
  eventId: string;
  homeParticipant: string;
  awayParticipant: string;
  eventName: string;
  sportId: string;
  startTime: string;
  tournament: TournamentOrCountry;
  country: TournamentOrCountry;
  mainMarket: Market | null;
  broadcastingInfo: string[];
}

export interface Score {
  home: number;
  away: number;
}

export interface LiveData {
  eventId: string;
  matchTime: string;
  eventStatus: string;
  remainingTimeInPeriod: string;
  completed: string;
  currentScore: Score;
  matchScore: Score;
}
