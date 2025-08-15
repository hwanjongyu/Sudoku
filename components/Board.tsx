
import React from 'react';
import { Cell } from './Cell';
import type { BoardState, Position } from '../types';

interface BoardProps {
    board: BoardState;
    initialBoard: BoardState;
    onCellClick: (position: Position) => void;
    selectedCell: Position | null;
}

export const Board: React.FC<BoardProps> = ({ board, initialBoard, onCellClick, selectedCell }) => {
    const getRelatedCells = (row: number, col: number): boolean[][] => {
        const related = Array(9).fill(null).map(() => Array(9).fill(false));
        const blockRowStart = Math.floor(row / 3) * 3;
        const blockColStart = Math.floor(col / 3) * 3;

        for (let i = 0; i < 9; i++) {
            related[row][i] = true; // Highlight row
            related[i][col] = true; // Highlight column
        }

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                related[blockRowStart + i][blockColStart + j] = true; // Highlight block
            }
        }
        return related;
    };

    const relatedCells = selectedCell ? getRelatedCells(selectedCell.row, selectedCell.col) : Array(9).fill(null).map(() => Array(9).fill(false));
    const selectedValue = selectedCell ? board[selectedCell.row][selectedCell.col].value : null;

    return (
        <div className="grid grid-cols-9 bg-slate-700 border-2 border-slate-600 rounded-lg overflow-hidden aspect-square">
            {board.map((row, rowIndex) =>
                row.map((cellData, colIndex) => (
                    <Cell
                        key={`${rowIndex}-${colIndex}`}
                        data={cellData}
                        isGiven={initialBoard[rowIndex][colIndex].isGiven}
                        onClick={() => onCellClick({ row: rowIndex, col: colIndex })}
                        isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                        isRelated={relatedCells[rowIndex][colIndex]}
                        isSameValue={selectedValue !== null && cellData.value === selectedValue}
                        rowIndex={rowIndex}
                        colIndex={colIndex}
                    />
                ))
            )}
        </div>
    );
};
