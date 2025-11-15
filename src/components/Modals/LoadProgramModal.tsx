// src/components/Modals/LoadProgramModal.tsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the component
import { useProgram } from "../../context/ProgramContext";
import { ProgramState, ExerciseDatabase } from "../../types/types";

const LoadProgramModal: React.FC = () => {
  const {
    isLoadProgramModalOpen,
    setIsLoadProgramModalOpen,
    setProgram,
    setExerciseDatabase,
    showNotification,
  } = useProgram();
  const [savedPrograms, setSavedPrograms] = useState<
    { program: ProgramState; exerciseDatabase?: ExerciseDatabase }[]
  >([]);

  useEffect(() => {
    if (isLoadProgramModalOpen) {
      const stored = localStorage.getItem("workoutPrograms");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSavedPrograms(parsed);
        } catch (e) {
          console.error("Failed to parse saved programs:", e);
          setSavedPrograms([]);
        }
      } else {
        setSavedPrograms([]);
      }
    }
  }, [isLoadProgramModalOpen]);

  const handleLoadProgram = (index: number) => {
    const saved = savedPrograms[index];
    if (saved) {
      setProgram(saved.program);
      if (saved.exerciseDatabase) {
        setExerciseDatabase(saved.exerciseDatabase);
      }
      // Update accent color and header background
      document.documentElement.style.setProperty(
        "--accent",
        saved.program.accentColor
      );
      document.querySelector(
        "header"
      )!.style.background = `linear-gradient(135deg, ${saved.program.accentColor} 0%, #2a5298 100%)`;
      setIsLoadProgramModalOpen(false);
      showNotification("Program loaded successfully!");
    }
  };

  const handleDeleteProgram = (index: number) => {
    if (window.confirm("Are you sure you want to delete this saved program?")) {
      const newSavedPrograms = [...savedPrograms];
      newSavedPrograms.splice(index, 1);
      localStorage.setItem("workoutPrograms", JSON.stringify(newSavedPrograms));
      setSavedPrograms(newSavedPrograms);
      showNotification("Program deleted successfully!");
    }
  };

  if (!isLoadProgramModalOpen) return null;

  return (
    <div className="modal" style={{ display: "flex" }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Saved Programs</h2>
          <button
            className="close-modal"
            onClick={() => setIsLoadProgramModalOpen(false)}
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div id="savedProgramsList">
            {savedPrograms.length === 0 ? (
              <div className="empty-state" id="noSavedPrograms">
                <FontAwesomeIcon icon="folder-open" />
                &nbsp; {/* Use the component */}
                <h3>No Saved Programs</h3>
                <p>Create and save your first program!</p>
              </div>
            ) : (
              savedPrograms.map((saved, index) => (
                <div key={index} className="exercise-item">
                  <div>
                    <div className="exercise-name">{saved.program.name}</div>
                    <div className="exercise-details">
                      <div className="exercise-detail">
                        {saved.program.weeks} weeks
                      </div>
                      <div className="exercise-detail">
                        {saved.program.days.length} days
                      </div>
                      <div className="exercise-detail">
                        {saved.program.days.reduce(
                          (sum, day) => sum + day.exercises.length,
                          0
                        )}{" "}
                        exercises
                      </div>
                    </div>
                  </div>
                  <div className="exercise-actions">
                    <button
                      className="btn btn-primary load-program-btn"
                      onClick={() => handleLoadProgram(index)}
                    >
                      Load
                    </button>
                    <button
                      className="action-btn delete-saved-program"
                      onClick={() => handleDeleteProgram(index)}
                    >
                      <FontAwesomeIcon icon="trash" />
                      &nbsp; {/* Use the component */}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setIsLoadProgramModalOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoadProgramModal;
