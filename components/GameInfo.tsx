
import React from 'react';

interface GameInfoProps {
    mistakes: number;
    maxMistakes: number;
    time: number;
}

export const GameInfo: React.FC<GameInfoProps> = ({ mistakes, maxMistakes, time }) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex justify-between items-center mb-4 px-2 text-slate-400 text-sm">
            <div>
                <span>Mistakes: </span>
                <span className={mistakes > 0 ? 'text-red-400 font-semibold' : 'text-slate-300 font-semibold'}>
                    {mistakes}/{maxMistakes}
                </span>
            </div>
            <div className="bg-sky-500 text-white font-bold rounded-full px-4 py-1 flex items-center gap-2">
                <i className="fa-solid fa-pause"></i>
                <span>{formatTime(time)}</span>
            </div>
        </div>
    );
};
