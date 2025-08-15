import React, { useState, useEffect, useCallback } from 'react';
import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { NumberPad } from './components/NumberPad';
import { Header } from './components/Header';
import { GameInfo } from './components/GameInfo';
import { DifficultySelector } from './components/DifficultySelector';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WinModal } from './components/WinModal';
import { generateSudokuPuzzle } from './services/geminiService';
import type { BoardState, Position, Difficulty } from './types';
import { DEFAULT_HINTS, MAX_MISTAKES } from './constants';

const deepCloneBoard = (board: BoardState): BoardState => {
    return board.map(row =>
        row.map(cell => ({
            ...cell,
            notes: new Set(cell.notes),
        }))
    );
};

const App: React.FC = () => {
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [board, setBoard] = useState<BoardState | null>(null);
    const [initialBoard, setInitialBoard] = useState<BoardState | null>(null);
    const [solution, setSolution] = useState<number[][] | null>(null);
    const [selectedCell, setSelectedCell] = useState<Position | null>(null);
    const [mistakes, setMistakes] = useState(0);
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isNotesMode, setIsNotesMode] = useState(false);
    const [history, setHistory] = useState<BoardState[]>([]);
    const [hintsLeft, setHintsLeft] = useState(DEFAULT_HINTS);
    const [isLoading, setIsLoading] = useState(false);
    const [isGameWon, setIsGameWon] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive && !isGameWon) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (!isActive && time !== 0) {
            if (interval) clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, isGameWon, time]);

    const startNewGame = useCallback(async (selectedDifficulty: Difficulty) => {
        setIsLoading(true);
        setDifficulty(selectedDifficulty);
        setSelectedCell(null);
        setIsGameWon(false);

        try {
            const { puzzle, solution: newSolution } = await generateSudokuPuzzle(selectedDifficulty);
            const newBoard: BoardState = puzzle.map(row =>
                row.map(value => ({
                    value: value === 0 ? null : value,
                    isGiven: value !== 0,
                    notes: new Set(),
                    isError: false,
                }))
            );
            setBoard(newBoard);
            setInitialBoard(deepCloneBoard(newBoard));
            setSolution(newSolution);
            setMistakes(0);
            setTime(0);
            setIsActive(true);
            setHistory([]);
            setHintsLeft(DEFAULT_HINTS);
        } catch (error) {
            console.error("Failed to generate Sudoku puzzle:", error);
            alert("Could not generate a new puzzle. Please try again.");
            setDifficulty(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const checkWinCondition = useCallback((currentBoard: BoardState) => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (currentBoard[r][c].value === null || currentBoard[r][c].value !== solution![r][c]) {
                    return false;
                }
            }
        }
        return true;
    }, [solution]);

    const handleNumberInput = (num: number) => {
        if (!selectedCell || !board || isGameWon) return;
        const { row, col } = selectedCell;
        if (board[row][col].isGiven) return;

        setHistory(prev => [...prev, board]);
        const newBoard = deepCloneBoard(board);

        if (isNotesMode) {
            const notes = newBoard[row][col].notes;
            if (notes.has(num)) {
                notes.delete(num);
            } else {
                notes.add(num);
            }
            newBoard[row][col].value = null; // Clear value when adding notes
        } else {
            newBoard[row][col].value = num;
            newBoard[row][col].notes = new Set();
            const isCorrect = solution![row][col] === num;
            newBoard[row][col].isError = !isCorrect;
            if (!isCorrect) {
                setMistakes(m => m + 1);
                if (mistakes + 1 >= MAX_MISTAKES) {
                    setIsActive(false);
                    // Optionally show a "Game Over" message
                }
            } else {
                // Clear errors from other cells with the same number if this is the last one
                for (let r = 0; r < 9; r++) {
                    for (let c = 0; c < 9; c++) {
                         if (newBoard[r][c].value === num && newBoard[r][c].isError) {
                            if (solution![r][c] === num) {
                                newBoard[r][c].isError = false;
                            }
                        }
                    }
                }
            }

            if(checkWinCondition(newBoard)) {
                setIsGameWon(true);
                setIsActive(false);
            }
        }
        setBoard(newBoard);
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const lastState = history[history.length - 1];
        setBoard(lastState);
        setHistory(history.slice(0, -1));
    };

    const handleErase = () => {
        if (!selectedCell || !board) return;
        const { row, col } = selectedCell;
        if (board[row][col].isGiven) return;
        setHistory(prev => [...prev, board]);

        const newBoard = deepCloneBoard(board);
        newBoard[row][col].value = null;
        newBoard[row][col].notes = new Set();
        newBoard[row][col].isError = false;
        setBoard(newBoard);
    };
    
    const handleHint = () => {
        if (hintsLeft <= 0 || !board || !solution) return;

        const emptyCells: Position[] = [];
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (!board[r][c].value) {
                    emptyCells.push({ row: r, col: c });
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const { row, col } = randomCell;
            
            setHistory(prev => [...prev, board]);
            const newBoard = deepCloneBoard(board);
            newBoard[row][col].value = solution[row][col];
            newBoard[row][col].isGiven = false; 
            newBoard[row][col].notes = new Set();
            newBoard[row][col].isError = false;
            setBoard(newBoard);
            setHintsLeft(h => h - 1);

            if(checkWinCondition(newBoard)) {
                setIsGameWon(true);
                setIsActive(false);
            }
        }
    };


    if (!difficulty) {
        return <DifficultySelector onSelectDifficulty={startNewGame} />;
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-2 sm:p-4">
            <div className="w-full max-w-md mx-auto bg-slate-800 rounded-2xl shadow-lg p-4">
                <Header onNewGame={() => setDifficulty(null)} />
                <GameInfo mistakes={mistakes} maxMistakes={MAX_MISTAKES} time={time} />
                {board && initialBoard && (
                    <Board
                        board={board}
                        initialBoard={initialBoard}
                        onCellClick={setSelectedCell}
                        selectedCell={selectedCell}
                    />
                )}
                <div className="mt-4">
                    <Controls
                        onUndo={handleUndo}
                        onErase={handleErase}
                        onToggleNotes={() => setIsNotesMode(!isNotesMode)}
                        onHint={handleHint}
                        isNotesMode={isNotesMode}
                        hintsLeft={hintsLeft}
                        undoDisabled={history.length === 0}
                    />
                    <NumberPad onNumberClick={handleNumberInput} />
                </div>
            </div>
            {isGameWon && (
                <WinModal 
                    time={time} 
                    difficulty={difficulty} 
                    onPlayAgain={() => startNewGame(difficulty)} 
                    onChangeDifficulty={() => setDifficulty(null)} 
                />
            )}
        </div>
    );
};

export default App;
