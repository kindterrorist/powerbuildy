import React, { createContext, useContext } from 'react';
import { ProgramState, ExerciseDatabase } from '../types/types';

interface ProgramContextType {
  program: ProgramState;
  setProgram: React.Dispatch<React.SetStateAction<ProgramState>>;
  exerciseDatabase: ExerciseDatabase; // Use the new type
  setExerciseDatabase: React.Dispatch<React.SetStateAction<ExerciseDatabase>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  isCustomizeModalOpen: boolean;
  setIsCustomizeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPreviewModalOpen: boolean;
  setIsPreviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadProgramModalOpen: boolean;
  setIsLoadProgramModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showNotification: (message: string) => void;
}

export const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export const useProgram = () => {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error('useProgram must be used within a ProgramProvider');
  }
  return context;
};