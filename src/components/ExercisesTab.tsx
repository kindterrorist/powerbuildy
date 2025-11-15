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
      showNotification("لطفاً نام یک دسته عضلانی وارد کنید");
      return;
    }
    if (exerciseDatabase[newGroupName]) {
      showNotification(
        `یک دسته عضلانی با نام "${newGroupName}" از قبل وجود دارد!`
      );
      return;
    }
    setExerciseDatabase((prev) => ({ ...prev, [newGroupName]: [] }));
    setNewGroupName("");
    showNotification(`دسته عضلانی "${newGroupName}" با موفقیت اضافه شد!`);
  };

  // Handle deleting a muscle group
  const handleDeleteMuscleGroup = (groupName: string) => {
    if (
      window.confirm(
        `آیا مطمئن هستید که می خواهید دسته عضلانی "${groupName}" را حذف کنید؟ تمام تمرینات این دسته از بین خواهند رفت.`
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
      showNotification(`دسته عضلانی "${groupName}" حذف شد`);
    }
  };

  // Handle adding a new exercise
  const handleAddExercise = () => {
    if (!currentMuscleGroup) {
      showNotification("لطفاً ابتدا یک دسته عضلانی انتخاب کنید!");
      return;
    }
    const { name, equipment, difficulty, video } = newExercise;
    if (!name || !equipment || !difficulty) {
      showNotification("لطفاً تمام فیلدهای الزامی تمرین را پر کنید");
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
    showNotification("تمرین با موفقیت اضافه شد!");
  };

  // Handle deleting an exercise
  const handleDeleteExercise = (groupName: string, index: number) => {
    if (window.confirm("آیا مطمئن هستید که می خواهید این تمرین را حذف کنید؟")) {
      setExerciseDatabase((prev) => ({
        ...prev,
        [groupName]: prev[groupName].filter((_, i) => i !== index),
      }));
      showNotification("تمرین با موفقیت حذف شد!");
    }
  };

  // Handle editing an exercise (simplified, could use a form)
  const handleEditExercise = (groupName: string, index: number) => {
    const exercise = exerciseDatabase[groupName][index];
    const newName = prompt("ویرایش نام تمرین:", exercise.name);
    const newEquipment = prompt("ویرایش تجهیزات:", exercise.equipment);
    const newDifficulty = prompt("ویرایش سختی:", exercise.difficulty);
    const newVideo = prompt(
      "ویرایش آدرس ویدیو (اختیاری):",
      exercise.video || ""
    );

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
      showNotification("تمرین با موفقیت به روز شد!");
    }
  };

  return (
    <div className="exercise-management">
      <div className="muscle-group-list">
        <h3>دسته های عضلانی</h3>
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
            &nbsp; مدیریت دسته های عضلانی
          </h3>{" "}
          {/* Use the component */}
          <div className="group-manager-form">
            <input
              type="text"
              id="newGroupName"
              className="form-control"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="نام دسته عضلانی جدید"
            />
            <button onClick={handleAddMuscleGroup}>اضافه کردن گروه</button>
          </div>
          <h4>گروه های موجود:</h4>
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
              } تمرینات`
            : "یک دسته عضلانی را انتخاب کنید"}
          {currentMuscleGroup && (
            <button
              className="btn btn-primary"
              onClick={() => setIsAddingExercise(true)}
            >
              <FontAwesomeIcon icon="plus" />
              &nbsp; {/* Use the component */}
              اضافه کردن تمرین
            </button>
          )}
        </h3>
        <div id="exerciseListContainer">
          {!currentMuscleGroup ? (
            <div className="empty-state" id="exerciseListEmptyState">
              <FontAwesomeIcon icon="dumbbell" />
              &nbsp; {/* Use the component */}
              <h3>هیچ دسته عضلانی انتخاب نشده است</h3>
              <p>برای مشاهده تمرینات، یک دسته عضلانی از لیست انتخاب کنید</p>
            </div>
          ) : exerciseDatabase[currentMuscleGroup].length === 0 ? (
            <div className="empty-state">
              <FontAwesomeIcon icon="dumbbell" />
              &nbsp; {/* Use the component */}
              <h3>هنوز تمرینی وجود ندارد</h3>
              <p>به این دسته عضلانی تمرین اضافه کنید</p>
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
                      تجهیزات: {ex.equipment} | سختی: {ex.difficulty}
                    </p>
                    {ex.video && (
                      <p>
                        ویدیو:{" "}
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
            <h3>اضافه کردن تمرین جدید</h3>
            <div className="form-row-2col">
              <div className="form-group">
                <label htmlFor="newExerciseName">نام تمرین</label>
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
                  placeholder="نام تمرین"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newExerciseEquipment">تجهیزات</label>
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
                  placeholder="تجهیزات"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newExerciseDifficulty">سختی</label>
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
                  placeholder="سختی"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newExerciseVideo">آدرس ویدیو آموزشی</label>
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
              ذخیره تمرین
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsAddingExercise(false)}
            >
              لغو
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisesTab;
