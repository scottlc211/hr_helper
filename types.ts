
export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Participant[];
}

export enum AppTab {
  Source = 'source',
  LuckyDraw = 'draw',
  Grouping = 'grouping'
}

export interface DrawWinner {
  id: string;
  name: string;
  timestamp: number; 
}
