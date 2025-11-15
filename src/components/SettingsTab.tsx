// src/components/SettingsTab.tsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the component
import { useProgram } from "../context/ProgramContext";

const SettingsTab: React.FC = () => {
  const { program, setProgram, showNotification } = useProgram();
  const [exportData, setExportData] = useState("");
  const [importData, setImportData] = useState("");

  const handleTrainerInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProgram((prev) => ({
      ...prev,
      trainer: {
        ...prev.trainer,
        [id.replace("trainer", "").toLowerCase()]: value,
      },
    }));
  };

  const handleExport = () => {
    const dataToExport = { program, exerciseDatabase: {} }; // Simplified, might need full state
    setExportData(JSON.stringify(dataToExport, null, 2));
    navigator.clipboard.writeText(exportData);
    showNotification("Data exported to clipboard!");
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importData);
      if (data.program) {
        setProgram(data.program);
        showNotification("Data imported successfully!");
      } else {
        showNotification("Invalid import data format.");
      }
    } catch (error) {
      console.error(error);
      showNotification("Invalid JSON format. Please check your data.");
    }
  };

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h3>
          <FontAwesomeIcon icon="chalkboard-teacher" />
          &nbsp; Trainer Information
        </h3>{" "}
        {/* Use the component */}
        <div className="trainee-info-grid">
          <div className="trainee-info-item">
            <label htmlFor="trainerName">Trainer Name</label>
            <input
              type="text"
              id="trainerName"
              className="form-control"
              value={program.trainer.name}
              onChange={handleTrainerInfoChange}
              placeholder="Enter trainer name"
            />
          </div>
          <div className="trainee-info-item">
            <label htmlFor="trainerEmail">Email</label>
            <input
              type="email"
              id="trainerEmail"
              className="form-control"
              value={program.trainer.email}
              onChange={handleTrainerInfoChange}
              placeholder="Enter email"
            />
          </div>
          <div className="trainee-info-item">
            <label htmlFor="trainerContact">Contact</label>
            <input
              type="text"
              id="trainerContact"
              className="form-control"
              value={program.trainer.contact}
              onChange={handleTrainerInfoChange}
              placeholder="Enter contact info"
            />
          </div>
          <div className="trainee-info-item" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="trainerBio">Bio</label>
            <textarea
              id="trainerBio"
              className="form-control"
              value={program.trainer.bio}
              onChange={handleTrainerInfoChange}
              placeholder="Enter bio"
              rows={4}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="settings-section">
        <h3>
          <FontAwesomeIcon icon="database" />
          &nbsp; Export/Import Data
        </h3>{" "}
        {/* Use the component */}
        <div className="export-import">
          <div className="form-group">
            <label htmlFor="exportDataArea">Export Data</label>
            <textarea
              id="exportDataArea"
              value={exportData}
              readOnly
              placeholder="Exported data will appear here..."
            ></textarea>
            <button className="btn btn-primary" onClick={handleExport}>
              <FontAwesomeIcon icon="file-export" />
              &nbsp; {/* Use the component */}
              Export to JSON
            </button>
          </div>
          <div className="form-group">
            <label htmlFor="importDataArea">Import Data</label>
            <textarea
              id="importDataArea"
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste JSON data here..."
            ></textarea>
            <button className="btn btn-success" onClick={handleImport}>
              <FontAwesomeIcon icon="file-import" />
              &nbsp; {/* Use the component */}
              Import from JSON
            </button>
          </div>
        </div>
      </div>
      <div className="settings-section">
        <h3>
          <FontAwesomeIcon icon="info-circle" />
          &nbsp; Application Info
        </h3>{" "}
        {/* Use the component */}
        <div style={{ padding: "15px" }}>
          <p>
            This application allows you to create custom workout programs with:
          </p>
          <ul style={{ margin: "10px 0 15px 20px" }}>
            <li>Customizable exercise database</li>
            <li>Trainee information tracking</li>
            <li>Drag-and-drop functionality</li>
            <li>Export and import capabilities</li>
            <li>Professional HTML output</li>
          </ul>
          <p>All data is stored locally in your browser.</p>
          <p style={{ marginTop: "15px", fontWeight: "bold" }}>
            Developed by: [Your Name]
          </p>
          <p>Contact: [Your Email]</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
