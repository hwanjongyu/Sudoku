
import React from 'react';
import type { CellData } from '../types';

interface CellProps {
    data: CellData;
    isGiven: boolean;
    onClick: () => void;
    isSelected: boolean;
    isRelated: boolean;
    isSameValue: boolean;
    rowIndex: number;
    colIndex: number;
}

export const Cell: React.FC<CellProps> = ({ data, isGiven, onClick, isSelected, isRelated, isSameValue, rowIndex, colIndex }) => {
    const { value, notes, isError } = data;

    const baseClasses = "flex items-center justify-center text-2xl sm:text-3xl font-bold cursor-pointer aspect-square";
    const borderClasses = `
        ${(rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'border-b-2' : 'border-b'}
        ${(colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'border-r-2' : 'border-r'}
        border-slate-600
    `;

    let bgClass = 'bg-slate-800';
    if (isSelected) {
        bgClass = 'bg-blue-500';
    } else if (isRelated) {
        bgClass = 'bg-slate-700';
    }

    let textClass = 'text-sky-300';
    if (isGiven) {
        textClass = 'text-white';
    }
    if (isError) {
        textClass = 'text-red-500';
    }
    if (isSelected) {
        textClass = 'text-white';
    }

    if(isSameValue && !isSelected) {
        bgClass = 'bg-blue-400 bg-opacity-40';
    }

    return (
        <div
            className={`${baseClasses} ${borderClasses} ${bgClass} ${textClass} transition-colors duration-150`}
            onClick={onClick}
        >
            {value ? (
                <span>{value}</span>
            ) : (
                <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-center text-xs text-slate-400">
                            {notes && notes.has(i + 1) ? i + 1 : ''}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
