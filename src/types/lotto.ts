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

export interface Merchandise {
  borough: string;
  gender: string;
  prizeLevelTypeNo: number;
  prizeValue: number;
  andelslagWinner: boolean;
  spillelagWinner: boolean;
  syndicateWinner: boolean;
}

export interface DrawResult {
  drawDate: string;
  drawId: number;
  gameNo: number;
  prize: Prize[];
  turnover: string;
  weekWinnerDetail: WeekWinnerDetail[];
  winnerNumber: WinnerNumber[];
  merchandise: Merchandise[];
}
