
import React from 'react';

interface ControlsProps {
    onUndo: () => void;
    onErase: () => void;
    onToggleNotes: () => void;
    onHint: () => void;
    isNotesMode: boolean;
    hintsLeft: number;
    undoDisabled: boolean;
}

const ControlButton: React.FC<{
    icon: string;
    label: string;
    onClick: () => void;
    isActive?: boolean;
    badge?: number;
    disabled?: boolean;
}> = ({ icon, label, onClick, isActive = false, badge, disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors duration-200 relative ${isActive ? 'text-sky-400' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        <i className={`fa-solid ${icon} text-2xl w-8`}></i>
        <span className="text-xs">{label}</span>
        {badge !== undefined && badge > 0 && (
             <span className="absolute -top-1 -right-2 bg-sky-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {badge}
            </span>
        )}
    </button>
);


export const Controls: React.FC<ControlsProps> = ({ onUndo, onErase, onToggleNotes, onHint, isNotesMode, hintsLeft, undoDisabled }) => {
    return (
        <div className="flex justify-around items-center p-2 mb-4">
            <ControlButton icon="fa-rotate-left" label="Undo" onClick={onUndo} disabled={undoDisabled} />
            <ControlButton icon="fa-eraser" label="Erase" onClick={onErase} />
            <ControlButton icon="fa-pencil" label="Notes" onClick={onToggleNotes} isActive={isNotesMode} />
            <ControlButton icon="fa-lightbulb" label="Hint" onClick={onHint} badge={hintsLeft} disabled={hintsLeft <= 0} />
        </div>
    );
};
