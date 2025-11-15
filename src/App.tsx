// src/App.tsx (Updated to manage notification state and pass showNotification function)
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import ProgramBuilderTab from './components/ProgramBuilderTab';
import ExercisesTab from './components/ExercisesTab';
import SettingsTab from './components/SettingsTab';
import CustomizeModal from './components/Modals/CustomizeModal';
import PreviewModal from './components/Modals/PreviewModal';
import LoadProgramModal from './components/Modals/LoadProgramModal';
import Notification from './components/UI/Notification';
import { ProgramContext } from './context/ProgramContext';
import { ProgramState } from './types/types';
import initialExerciseData from './data/exercises.json';

const initialProgramState: ProgramState = {
  name: "",
  weeks: 8,
  days: [],
  currentDayId: null,
  accentColor: "#667eea",
  logo: null,
  trainee: {
    name: "",
    age: "",
    weight: "",
    height: "",
  },
  trainer: {
    name: "",
    email: "",
    contact: "",
    bio: "",
  },
  description: "",
};

const App: React.FC = () => {
  const [program, setProgram] = useState<ProgramState>(initialProgramState);
  const [exerciseDatabase, setExerciseDatabase] = useState<any>(initialExerciseData);
  const [activeTab, setActiveTab] = useState<string>('program');
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isLoadProgramModalOpen, setIsLoadProgramModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; show: boolean }>({ message: '', show: false });

  // Load saved program or initial data on app start
  useEffect(() => {
     const savedProgramData = localStorage.getItem('workoutProgramData');
     if (savedProgramData) {
       try {
         const parsedData = JSON.parse(savedProgramData);
         setProgram(parsedData.program);
         setExerciseDatabase(parsedData.exerciseDatabase || initialExerciseData);
         document.documentElement.style.setProperty('--accent', parsedData.program.accentColor);
         document.querySelector('header')!.style.background = `linear-gradient(135deg, ${parsedData.program.accentColor} 0%, #2a5298 100%)`;
       } catch (e) {
         console.error("Failed to load saved program:", e);
         setProgram(initialProgramState);
         setExerciseDatabase(initialExerciseData);
       }
     } else {
       setProgram(initialProgramState);
       setExerciseDatabase(initialExerciseData);
     }
  }, []);

  // Save program data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = { program, exerciseDatabase };
    localStorage.setItem('workoutProgramData', JSON.stringify(dataToSave));
  }, [program, exerciseDatabase]);

  const showNotification = (message: string) => {
    setNotification({ message, show: true });
    setTimeout(() => setNotification({ message: '', show: false }), 3000);
  };

  const contextValue = {
    program,
    setProgram,
    exerciseDatabase,
    setExerciseDatabase,
    activeTab,
    setActiveTab,
    isCustomizeModalOpen,
    setIsCustomizeModalOpen,
    isPreviewModalOpen,
    setIsPreviewModalOpen,
    isLoadProgramModalOpen,
    setIsLoadProgramModalOpen,
    showNotification,
  };

  return (
    <ProgramContext.Provider value={contextValue}>
      <div className="app">
        <Header />
        <Tabs />
        <main className="main-content-wrapper">
          {activeTab === 'program' && <ProgramBuilderTab />}
          {activeTab === 'exercises' && <ExercisesTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
        <CustomizeModal />
        <PreviewModal />
        <LoadProgramModal />
        {notification.show && <Notification message={notification.message} />}
      </div>
    </ProgramContext.Provider>
  );
};

export default App;
