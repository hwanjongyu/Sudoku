
export interface CellData {
    value: number | null;
    isGiven: boolean;
    notes: Set<number>;
    isError: boolean;
}

export type BoardState = CellData[][];

export interface Position {
    row: number;
    col: number;
}

export enum Difficulty {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
    Expert = 'Expert',
}
