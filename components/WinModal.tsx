
import React from 'react';
import type { Difficulty } from '../types';

interface WinModalProps {
    time: number;
    difficulty: Difficulty;
    onPlayAgain: () => void;
    onChangeDifficulty: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({ time, difficulty, onPlayAgain, onChangeDifficulty }) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-8 text-center text-white w-full max-w-sm m-4 shadow-2xl border border-sky-500">
                <h2 className="text-4xl font-bold text-sky-400 mb-4">You Won!</h2>
                <div className="space-y-2 mb-8">
                    <p className="text-lg">Difficulty: <span className="font-semibold">{difficulty}</span></p>
                    <p className="text-lg">Time: <span className="font-semibold">{formatTime(time)}</span></p>
                </div>
                <div className="flex flex-col gap-4">
                    <button 
                        onClick={onPlayAgain}
                        className="w-full bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-500 transition-colors duration-200 text-lg"
                    >
                        Play Again
                    </button>
                    <button 
                        onClick={onChangeDifficulty}
                        className="w-full bg-slate-700 text-slate-300 font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors duration-200"
                    >
                        Change Difficulty
                    </button>
                </div>
            </div>
        </div>
    );
};
