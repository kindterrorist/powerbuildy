// src/components/ExercisesTab.tsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the component
import { useProgram } from "../context/ProgramContext";

const ExercisesTab: React.FC = () => {
  const { exerciseDatabase, setExerciseDatabase, showNotification } =
    useProgram();
  const [currentMuscleGroup, setCurrentMuscleGroup] = useState<string | null>(
    null
  );
  const [newGroupName, setNewGroupName] = useState("");
  const [newExercise, setNewExercise] = useState({
    name: "",
    equipment: "",
    difficulty: "",
    video: "",
  });
  const [isAddingExercise, setIsAddingExercise] = useState(false);

  // Handle adding a new muscle group
  const handleAddMuscleGroup = () => {
    if (!newGroupName.trim()) {
      showNotification("Please enter a muscle group name");
      return;
    }
    if (exerciseDatabase[newGroupName]) {
      showNotification(
        `A muscle group with the name "${newGroupName}" already exists!`
      );
      return;
    }
    setExerciseDatabase((prev) => ({ ...prev, [newGroupName]: [] }));
    setNewGroupName("");
    showNotification(`Muscle group "${newGroupName}" added successfully!`);
  };

  // Handle deleting a muscle group
  const handleDeleteMuscleGroup = (groupName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the "${groupName}" muscle group? All exercises in this group will be lost.`
      )
    ) {
      setExerciseDatabase((prev) => {
        const newDb = { ...prev };
        delete newDb[groupName];
        return newDb;
      });
      if (currentMuscleGroup === groupName) {
        setCurrentMuscleGroup(null);
      }
      showNotification(`Muscle group "${groupName}" deleted`);
    }
  };

  // Handle adding a new exercise
  const handleAddExercise = () => {
    if (!currentMuscleGroup) {
      showNotification("Please select a muscle group first!");
      return;
    }
    const { name, equipment, difficulty, video } = newExercise;
    if (!name || !equipment || !difficulty) {
      showNotification("Please fill in all required fields for the exercise");
      return;
    }

    const newExerciseObj = {
      name,
      equipment,
      difficulty,
      video: video || undefined,
    };
    setExerciseDatabase((prev) => ({
      ...prev,
      [currentMuscleGroup]: [
        ...(prev[currentMuscleGroup] || []),
        newExerciseObj,
      ],
    }));

    setNewExercise({ name: "", equipment: "", difficulty: "", video: "" });
    setIsAddingExercise(false);
    showNotification("Exercise added successfully!");
  };

  // Handle deleting an exercise
  const handleDeleteExercise = (groupName: string, index: number) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      setExerciseDatabase((prev) => ({
        ...prev,
        [groupName]: prev[groupName].filter((_, i) => i !== index),
      }));
      showNotification("Exercise deleted successfully!");
    }
  };

  // Handle editing an exercise (simplified, could use a form)
  const handleEditExercise = (groupName: string, index: number) => {
    const exercise = exerciseDatabase[groupName][index];
    const newName = prompt("Edit exercise name:", exercise.name);
    const newEquipment = prompt("Edit equipment:", exercise.equipment);
    const newDifficulty = prompt("Edit difficulty:", exercise.difficulty);
    const newVideo = prompt("Edit video URL (optional):", exercise.video || "");

    if (newName !== null && newEquipment !== null && newDifficulty !== null) {
      setExerciseDatabase((prev) => {
        const newGroupExercises = [...prev[groupName]];
        newGroupExercises[index] = {
          name: newName,
          equipment: newEquipment,
          difficulty: newDifficulty,
          video: newVideo || undefined,
        };
        return { ...prev, [groupName]: newGroupExercises };
      });
      showNotification("Exercise updated successfully!");
    }
  };

  return (
    <div className="exercise-management">
      <div className="muscle-group-list">
        <h3>Muscle Groups</h3>
        <div id="muscleGroupList">
          {Object.keys(exerciseDatabase).map((groupName) => (
            <div
              key={groupName}
              className={`muscle-group-item ${
                currentMuscleGroup === groupName ? "active" : ""
              }`}
              onClick={() => setCurrentMuscleGroup(groupName)}
            >
              {/* <i className={`fas fa-${groupName === 'chest' ? 'heart' : groupName === 'back' ? 'backspace' : groupName === 'legs' ? 'walking' : groupName === 'shoulders' ? 'hand-point-up' : groupName === 'arms' ? 'hand' : 'wind'}`}></i> */}
              {/* Icon removed as requested */}
              <span>
                {groupName.charAt(0).toUpperCase() + groupName.slice(1)} (
                {exerciseDatabase[groupName].length})
              </span>
            </div>
          ))}
        </div>
        <div className="muscle-group-manager">
          <h3>
            <FontAwesomeIcon icon="plus-circle" />
            &nbsp; Manage Muscle Groups
          </h3>{" "}
          {/* Use the component */}
          <div className="group-manager-form">
            <input
              type="text"
              id="newGroupName"
              className="form-control"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="New muscle group name"
            />
            <button onClick={handleAddMuscleGroup}>Add Group</button>
          </div>
          <h4>Existing Groups:</h4>
          <div className="existing-groups" id="existingGroups">
            {Object.keys(exerciseDatabase).map((groupName) => (
              <div key={groupName} className="group-item">
                <span>
                  {groupName.charAt(0).toUpperCase() + groupName.slice(1)}
                </span>
                <div className="group-actions">
                  <button
                    className="group-action-btn delete-group"
                    onClick={() => handleDeleteMuscleGroup(groupName)}
                  >
                    <FontAwesomeIcon icon="trash" />
                    &nbsp; {/* Use the component */}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="exercise-list-container">
        <h3 id="currentMuscleGroupTitle">
          {currentMuscleGroup
            ? `${
                currentMuscleGroup.charAt(0).toUpperCase() +
                currentMuscleGroup.slice(1)
              } Exercises`
            : "Select a Muscle Group"}
          {currentMuscleGroup && (
            <button
              className="btn btn-primary"
              onClick={() => setIsAddingExercise(true)}
            >
              <FontAwesomeIcon icon="plus" />
              &nbsp; {/* Use the component */}
              Add Exercise
            </button>
          )}
        </h3>
        <div id="exerciseListContainer">
          {!currentMuscleGroup ? (
            <div className="empty-state" id="exerciseListEmptyState">
              <FontAwesomeIcon icon="dumbbell" />
              &nbsp; {/* Use the component */}
              <h3>No Muscle Group Selected</h3>
              <p>Select a muscle group from the list to view exercises</p>
            </div>
          ) : exerciseDatabase[currentMuscleGroup].length === 0 ? (
            <div className="empty-state">
              <FontAwesomeIcon icon="dumbbell" />
              &nbsp; {/* Use the component */}
              <h3>No Exercises Yet</h3>
              <p>Add exercises to this muscle group</p>
            </div>
          ) : (
            <div id="exerciseList">
              {exerciseDatabase[currentMuscleGroup].map((ex, index) => (
                <div
                  key={index}
                  className="exercise-list-item"
                  data-exercise-index={index}
                >
                  <div className="exercise-info">
                    <h4>{ex.name}</h4>
                    <p>
                      Equipment: {ex.equipment} | Difficulty: {ex.difficulty}
                    </p>
                    {ex.video && (
                      <p>
                        Video:{" "}
                        <a
                          href={ex.video}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {ex.video}
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="exercise-actions-ex">
                    <button
                      className="action-btn-ex edit-exercise"
                      onClick={() =>
                        handleEditExercise(currentMuscleGroup, index)
                      }
                    >
                      <FontAwesomeIcon icon="edit" />
                      &nbsp; {/* Use the component */}
                    </button>
                    <button
                      className="action-btn-ex delete-exercise"
                      onClick={() =>
                        handleDeleteExercise(currentMuscleGroup, index)
                      }
                    >
                      <FontAwesomeIcon icon="trash" />
                      &nbsp; {/* Use the component */}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {isAddingExercise && (
          <div
            className="edit-exercise-form"
            id="addExerciseForm"
            style={{ display: "block" }}
          >
            <h3>Add New Exercise</h3>
            <div className="form-row-2col">
              <div className="form-group">
                <label htmlFor="newExerciseName">Exercise Name</label>
                <input
                  type="text"
                  id="newExerciseName"
                  className="form-control"
                  value={newExercise.name}
                  onChange={(e) =>
                    setNewExercise((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Exercise Name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newExerciseEquipment">Equipment</label>
                <input
                  type="text"
                  id="newExerciseEquipment"
                  className="form-control"
                  value={newExercise.equipment}
                  onChange={(e) =>
                    setNewExercise((prev) => ({
                      ...prev,
                      equipment: e.target.value,
                    }))
                  }
                  placeholder="Equipment"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newExerciseDifficulty">Difficulty</label>
                <input
                  type="text"
                  id="newExerciseDifficulty"
                  className="form-control"
                  value={newExercise.difficulty}
                  onChange={(e) =>
                    setNewExercise((prev) => ({
                      ...prev,
                      difficulty: e.target.value,
                    }))
                  }
                  placeholder="Difficulty"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newExerciseVideo">Tutorial Video URL</label>
                <input
                  type="text"
                  id="newExerciseVideo"
                  className="form-control"
                  value={newExercise.video}
                  onChange={(e) =>
                    setNewExercise((prev) => ({
                      ...prev,
                      video: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
            <button
              className="btn btn-success"
              id="saveExerciseBtn"
              onClick={handleAddExercise}
            >
              <FontAwesomeIcon icon="save" />
              &nbsp; {/* Use the component */}
              Save Exercise
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsAddingExercise(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisesTab;
