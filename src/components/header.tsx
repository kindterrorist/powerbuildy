// src/components/Header.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the component
import { useProgram } from "../context/ProgramContext";

const Header: React.FC = () => {
  const {
    setIsCustomizeModalOpen,
    setIsLoadProgramModalOpen,
    showNotification,
  } = useProgram();

  const handleSaveProgram = () => {
    // Logic moved to App or a dedicated hook/service
    const programData = JSON.parse(
      localStorage.getItem("workoutProgramData") || "{}"
    );
    if (!programData.program.name.trim()) {
      showNotification("Please enter a program name before saving.");
      return;
    }
    if (programData.program.days.length === 0) {
      showNotification("Cannot save an empty program. Add at least one day.");
      return;
    }

    const savedPrograms = JSON.parse(
      localStorage.getItem("workoutPrograms") || "[]"
    );
    savedPrograms.push(programData);
    localStorage.setItem("workoutPrograms", JSON.stringify(savedPrograms));
    showNotification("Program saved successfully!");
  };

  return (
    <header>
      <div className="header-content">
        <div className="header-left">
          <h1>
            <FontAwesomeIcon icon="dumbbell" /> {/* Use the component */}
            &nbsp;Advanced Workout Program Builder{" "}
            {/* Add space manually if needed */}
          </h1>
          <p>Create your custom workout program with customization features</p>
        </div>
        <div className="header-right">
          <button
            className="btn btn-secondary"
            onClick={() => setIsCustomizeModalOpen(true)}
          >
            <FontAwesomeIcon icon="palette" />
            &nbsp; {/* Use the component */}
            Customize
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setIsLoadProgramModalOpen(true)}
          >
            <FontAwesomeIcon icon="folder-open" />
            &nbsp; {/* Use the component */}
            Load Program
          </button>
          <button className="btn btn-success" onClick={handleSaveProgram}>
            <FontAwesomeIcon icon="save" />
            &nbsp; {/* Use the component */}
            Save Program
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
