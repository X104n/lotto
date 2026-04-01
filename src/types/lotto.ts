export interface WinnerNumber {
  number: string;
  type: 1 | 2;
  name: string;
  drawOrder: number;
}

export interface Prize {
  id: number;
  name: string;
  value: string;
  winners: string;
  jackpotAmount?: number;
}

export interface WeekWinnerDetail {
  gender: string;
  borough: string;
  county: string;
}

export interface DrawResult {
  drawDate: string;
  drawId: number;
  prize: Prize[];
  turnover: string;
  weekWinnerDetail: WeekWinnerDetail[];
  winnerNumber: WinnerNumber[];
}
