
import { GoogleGenAI, Type } from "@google/genai";
import type { Difficulty } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const sudokuSchema = {
    type: Type.OBJECT,
    properties: {
        puzzle: {
            type: Type.ARRAY,
            description: "A 9x9 array representing the Sudoku puzzle. 0 represents an empty cell.",
            items: {
                type: Type.ARRAY,
                items: { type: Type.INTEGER }
            }
        },
        solution: {
            type: Type.ARRAY,
            description: "A 9x9 array representing the full solution to the puzzle.",
            items: {
                type: Type.ARRAY,
                items: { type: Type.INTEGER }
            }
        }
    },
    required: ["puzzle", "solution"]
};

export const generateSudokuPuzzle = async (difficulty: Difficulty): Promise<{ puzzle: number[][], solution: number[][] }> => {
    const prompt = `Generate a new Sudoku puzzle and its complete solution. The difficulty should be '${difficulty}'.
    The puzzle should be a 9x9 grid with some numbers filled in and others represented by 0 for empty cells.
    The solution should be the fully solved 9x9 grid.
    Ensure the puzzle is valid and has a unique solution.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: sudokuSchema,
                temperature: 1, // Higher temperature for more variability
            },
        });
        
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);

        if (validateSudokuResponse(parsed)) {
            return parsed;
        } else {
            throw new Error("Invalid Sudoku data received from API.");
        }
    } catch (error) {
        console.error("Error generating Sudoku puzzle with Gemini:", error);
        // Fallback or re-throw
        throw error;
    }
};

const validateSudokuResponse = (data: any): data is { puzzle: number[][], solution: number[][] } => {
    if (!data || !Array.isArray(data.puzzle) || !Array.isArray(data.solution)) {
        return false;
    }
    if (data.puzzle.length !== 9 || data.solution.length !== 9) {
        return false;
    }
    for (let i = 0; i < 9; i++) {
        if (!Array.isArray(data.puzzle[i]) || data.puzzle[i].length !== 9 || 
            !Array.isArray(data.solution[i]) || data.solution[i].length !== 9) {
            return false;
        }
    }
    return true;
};
