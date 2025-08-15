
import React from 'react';

interface NumberPadProps {
    onNumberClick: (num: number) => void;
}

export const NumberPad: React.FC<NumberPadProps> = ({ onNumberClick }) => {
    return (
        <div className="grid grid-cols-9 gap-1">
            {Array.from({ length: 9 }, (_, i) => i + 1).map(num => (
                <button
                    key={num}
                    onClick={() => onNumberClick(num)}
                    className="flex items-center justify-center bg-slate-700 text-white text-3xl font-semibold rounded-md aspect-square hover:bg-sky-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                    {num}
                </button>
            ))}
        </div>
    );
};
