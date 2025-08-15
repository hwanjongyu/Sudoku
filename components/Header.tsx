
import React from 'react';

interface HeaderProps {
    onNewGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewGame }) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <button onClick={onNewGame} className="text-slate-400 hover:text-white">
                <i className="fa-solid fa-chevron-left text-xl"></i>
            </button>
            <h1 className="text-2xl font-bold text-white">Sudoku</h1>
            <div className="flex items-center gap-4 text-slate-400">
                 <button className="hover:text-white"><i className="fa-solid fa-palette text-xl"></i></button>
                 <button className="hover:text-white"><i className="fa-solid fa-gear text-xl"></i></button>
            </div>
        </div>
    );
};
