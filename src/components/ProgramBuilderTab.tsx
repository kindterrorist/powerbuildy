import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the component
import { useProgram } from "../context/ProgramContext";
import { ProgramState, Day, Exercise } from "../types/types";

const ProgramBuilderTab: React.FC = () => {
  const {
    program,
    setProgram,
    exerciseDatabase,
    showNotification,
    setIsPreviewModalOpen,
  } = useProgram();
  const [currentExerciseId, setCurrentExerciseId] = useState<number | null>(
    null
  );
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formState, setFormState] = useState({
    sets: "3",
    reps: "10",
    rest: "60",
    video: "",
  });

  // Calculate day stats
  const currentDay =
    program.days.find((day) => day.id === program.currentDayId) || null;
  const daySets = currentDay
    ? currentDay.exercises.reduce(
        (sum, ex) => sum + (parseInt(ex.sets) || 0),
        0
      )
    : 0;
  const dayExercises = currentDay ? currentDay.exercises.length : 0;

  // Handle adding a new day
  const handleAddDay = () => {
    const newDayId = Date.now();
    const newDay: Day = {
      id: newDayId,
      name: `روز ${program.days.length + 1}`,
      exercises: [],
    };
    setProgram((prev) => ({
      ...prev,
      days: [...prev.days, newDay],
      currentDayId: newDayId,
    }));
    showNotification("روز با موفقیت اضافه شد!");
  };

  // Handle deleting a day
  const handleDeleteDay = (dayId: number) => {
    if (program.days.length <= 1) {
      showNotification("نمی توان آخرین روز را حذف کرد.");
      return;
    }
    setProgram((prev) => {
      const newDays = prev.days.filter((day) => day.id !== dayId);
      const newCurrentDayId =
        prev.currentDayId === dayId
          ? newDays.length > 0
            ? newDays[0].id
            : null
          : prev.currentDayId;
      return { ...prev, days: newDays, currentDayId: newCurrentDayId };
    });
    if (program.currentDayId === dayId) {
      setCurrentExerciseId(null);
      setIsFormVisible(false);
    }
    showNotification("روز با موفقیت حذف شد!");
  };

  // Handle changing day name
  const handleDayNameChange = (dayId: number, newName: string) => {
    setProgram((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.id === dayId ? { ...day, name: newName } : day
      ),
    }));
  };

  // Handle drag and drop for days (simplified)
  const [draggedDayId, setDraggedDayId] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, dayId: number) => {
    setDraggedDayId(dayId);
    e.dataTransfer.setData("text/plain", dayId.toString()); // Required for Firefox
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow drop
  };

  const handleDrop = (e: React.DragEvent, targetDayId: number) => {
    e.preventDefault();
    if (draggedDayId === null || draggedDayId === targetDayId) return;

    setProgram((prev) => {
      const sourceIndex = prev.days.findIndex((d) => d.id === draggedDayId);
      const targetIndex = prev.days.findIndex((d) => d.id === targetDayId);

      if (sourceIndex === -1 || targetIndex === -1) return prev;

      const newDays = [...prev.days];
      const [sourceDay] = newDays.splice(sourceIndex, 1);
      newDays.splice(targetIndex, 0, {
        ...sourceDay,
        exercises: [...newDays[targetIndex].exercises],
        id: Date.now(),
      }); // Swap exercises and update ID
      newDays[targetIndex] = {
        ...newDays[targetIndex],
        exercises: [...sourceDay.exercises],
      };

      return { ...prev, days: newDays };
    });

    setDraggedDayId(null);
    showNotification("روزها با موفقیت تغییر ترتیب داده شدند!");
  };

  // Handle selecting a day
  const handleSelectDay = (dayId: number) => {
    setProgram((prev) => ({ ...prev, currentDayId: dayId }));
    setCurrentExerciseId(null);
    setIsFormVisible(false);
  };

  // Handle adding an exercise to the current day
  const handleAddExercise = (exerciseName: string) => {
    if (!program.currentDayId) {
      showNotification("لطفاً ابتدا یک روز را انتخاب کنید!");
      return;
    }

    const newExercise: Exercise = {
      id: Date.now(),
      name: exerciseName,
      sets: "3",
      reps: "10",
      rest: "60",
      video: "", // Default, can be updated later
    };

    setProgram((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.id === program.currentDayId
          ? { ...day, exercises: [...day.exercises, newExercise] }
          : day
      ),
    }));
    showNotification("تمرین با موفقیت اضافه شد!");
  };

  // Handle editing an exercise
  const handleEditExercise = (exerciseId: number) => {
    if (!currentDay) return;
    const exercise = currentDay.exercises.find((ex) => ex.id === exerciseId);
    if (exercise) {
      setCurrentExerciseId(exerciseId);
      setFormState({
        sets: exercise.sets,
        reps: exercise.reps,
        rest: exercise.rest,
        video: exercise.video || "",
      });
      setIsFormVisible(true);
    }
  };

  // Handle deleting an exercise
  const handleDeleteExercise = (exerciseId: number) => {
    if (!program.currentDayId) return;
    setProgram((prev) => ({
      ...prev,
      days: prev.days.map((day) =>
        day.id === program.currentDayId
          ? {
              ...day,
              exercises: day.exercises.filter((ex) => ex.id !== exerciseId),
            }
          : day
      ),
    }));
    if (currentExerciseId === exerciseId) {
      setCurrentExerciseId(null);
      setIsFormVisible(false);
    }
    showNotification("تمرین با موفقیت حذف شد!");
  };

  // Handle updating exercise details from form
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    if (!program.currentDayId || currentExerciseId === null) return;

    setProgram((prev) => ({
      ...prev,
      days: prev.days.map((day) => {
        if (day.id === program.currentDayId) {
          return {
            ...day,
            exercises: day.exercises.map((ex) =>
              ex.id === currentExerciseId ? { ...ex, ...formState } : ex
            ),
          };
        }
        return day;
      }),
    }));
    showNotification("تمرین با موفقیت به روز شد!");
    // Optionally hide form after saving
    // setIsFormVisible(false);
    // setCurrentExerciseId(null);
  };

  // Handle updating program info (name, weeks, description)
  const handleProgramInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProgram((prev) => ({ ...prev, [id]: value }));
  };

  // Handle updating trainee info
  const handleTraineeInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProgram((prev) => ({
      ...prev,
      trainee: {
        ...prev.trainee,
        [id.replace("trainee", "").toLowerCase()]: value,
      },
    }));
  };

  // Show exercises modal for a muscle group
  const showExercisesModal = (muscleGroup: string) => {
    // This logic needs to be handled carefully in React
    // We'll create a temporary modal component or use state to manage the modal content
    // For now, let's assume we have a state variable and a component for this modal
    // This part requires careful state management to avoid complexity
    // A simpler approach might be to have a dedicated component for the exercise selection modal
    // and manage its visibility and content via context or props
    // Let's assume a function exists in context to open this modal with data
    // This is getting complex - perhaps a separate component for the exercise selection modal is better
    // For brevity here, I'll simulate the modal creation imperatively, though it's not ideal in React
    // A better way would be a dedicated component like <ExerciseSelectionModal />
    const exercises = exerciseDatabase[muscleGroup] || [];
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.style.display = "flex";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0,0,0,0.7)";
    modal.style.zIndex = "1000";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";

    modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px; background: white; border-radius: 12px; padding: 20px;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h2>${
                      muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)
                    } تمرینات</h2>
                    <button class="close-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                </div>
                <div class="modal-body exercise-list-modal" style="max-height: 400px; overflow-y: auto;">
                    <div class="exercise-list">
                        ${exercises
                          .map(
                            (ex) => `
                            <div class="exercise-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 8px; background: #f1f8ff; border-radius: 8px;">
                                <div>
                                    <div class="exercise-name">${ex.name}</div>
                                    <div style="font-size: 0.8rem; color: #95a5a6;">${ex.equipment} | ${ex.difficulty}</div>
                                </div>
                                <button class="btn btn-primary add-exercise-btn" data-exercise-name="${ex.name}" style="padding: 5px 10px;">اضافه کردن</button>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector(".close-modal")!;
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    modal.querySelectorAll(".add-exercise-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const exerciseName = (btn as HTMLElement).dataset.exerciseName!;
        handleAddExercise(exerciseName);
        document.body.removeChild(modal);
      });
    });
  };

  // --- NEW: Handle Preview Button Click ---
  const handlePreviewClick = () => {
    if (program.days.length === 0) {
      showNotification(
        "نمی توان یک برنامه خالی را پیش نمایش داد. حداقل یک روز اضافه کنید."
      );
      return;
    }
    setIsPreviewModalOpen(true); // This should open the PreviewModal component
  };

  // --- NEW: Handle Download Button Click ---
  const handleDownloadClick = () => {
    if (program.days.length === 0) {
      showNotification(
        "نمی توان یک برنامه خالی را دانلود کرد. حداقل یک روز اضافه کنید."
      );
      return;
    }
    if (!program.name.trim()) {
      showNotification("لطفاً قبل از دانلود یک نام برنامه وارد کنید.");
      return;
    }

    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const logoHtml = program.logo
      ? `<div class="logo"><img src="${program.logo}" alt="Gym Logo" style="max-width: 100%; max-height: 100%;"></div>`
      : '<div class="logo">💪</div>';
    const traineeInfo = `
                <div class="trainee-info">
                    <div class="trainee-detail">
                        <span>نام:</span>
                        <span>${program.trainee.name || "N/A"}</span>
                    </div>
                    <div class="trainee-detail">
                        <span>سن:</span>
                        <span>${program.trainee.age || "N/A"} سال</span>
                    </div>
                    <div class="trainee-detail">
                        <span>وزن:</span>
                        <span>${program.trainee.weight || "N/A"} کیلوگرم</span>
                    </div>
                    <div class="trainee-detail">
                        <span>قد:</span>
                        <span>${
                          program.trainee.height || "N/A"
                        } سانتی متر</span>
                    </div>
                </div>
            `;
    const programDescriptionHtml = program.description
      ? `
                <div class="program-description">
                    <h3>توضیحات برنامه</h3>
                    <p>${program.description}</p>
                </div>
            `
      : "";
    const trainerInfo = `
                <div class="trainer-info">
                    <div class="trainer-detail" style="grid-column: 1 / -1;">
                        <span>بیو:</span>
                        <span>${program.trainer.bio || "N/A"}</span>
                    </div>
                    <div class="trainer-detail">
                        <span>مربی:</span>
                        <span>${program.trainer.name || "N/A"}</span>
                    </div>
                    <div class="trainer-detail">
                        <span>تماس:</span>
                        <span>${program.trainer.contact || "N/A"}</span>
                    </div>
                    <div class="trainer-detail">
                        <span>ایمیل:</span>
                        <span>${program.trainer.email || "N/A"}</span>
                    </div>
                </div>
            `;
    const daysHTML = program.days
      .map(
        (day) => `
                <div class="day-section">
                    <div class="day-header">${day.name}</div>
                    <div class="exercises">
                        ${day.exercises
                          .map(
                            (ex) => `
                            <div class="exercise">
                                <div class="exercise-name">
                                    ${ex.name}
                                    ${
                                      ex.video
                                        ? `<a href="${ex.video}" target="_blank" class="tutorial-link">آموزش</a>`
                                        : ""
                                    }
                                </div>
                                <div class="exercise-detail">
                                    <span>ست</span>
                                    ${ex.sets}
                                </div>
                                <div class="exercise-detail">
                                    <span>تکرار</span>
                                    ${ex.reps}
                                </div>
                                <div class="exercise-detail">
                                    <span>استراحت</span>
                                    ${ex.rest} ثانیه
                                </div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
            `
      )
      .join("");

    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${program.name || "Workout Program"}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Roboto:wght@400;500;700&display=swap');
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Roboto', sans-serif;
                background: linear-gradient(135deg, ${
                  program.accentColor
                } 0%, #764ba2 100%);
                padding: 20px;
            }
            .poster {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            .header {
                background: linear-gradient(135deg, ${
                  program.accentColor
                } 0%, #2a5298 100%);
                color: white;
                padding: 40px;
                text-align: center;
                position: relative;
            }
            .logo {
                width: 120px;
                height: 120px;
                margin: 0 auto 20px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 48px;
            }
            .program-title {
                font-family: 'Montserrat', sans-serif;
                font-size: 48px;
                font-weight: 900;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            .program-info {
                font-size: 18px;
                opacity: 0.9;
            }
            .trainee-info {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin: 20px 0;
                padding: 0 20px;
            }
            .trainee-detail {
                background: #f5f7fa;
                padding: 15px;
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                font-weight: 500;
            }
            .program-description {
                margin: 20px 0;
                padding: 0 20px;
            }
            .program-description h3 {
                margin-bottom: 10px;
                color: ${program.accentColor};
            }
            .program-description p {
                line-height: 1.6;
                color: #555;
            }
            .trainer-info {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin: 20px 0;
                padding: 0 20px;
            }
            .trainer-detail {
                background: #f5f7fa;
                padding: 15px;
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                font-weight: 500;
            }
            .content {
                padding: 40px;
            }
            .day-section {
                margin-bottom: 40px;
                border: 3px solid ${program.accentColor};
                border-radius: 12px;
                overflow: hidden;
                page-break-inside: avoid;
            }
            .day-header {
                background: linear-gradient(135deg, ${
                  program.accentColor
                } 0%, #2a5298 100%);
                color: white;
                padding: 20px;
                font-size: 24px;
                font-weight: 700;
                text-transform: uppercase;
            }
            .exercises {
                padding: 20px;
            }
            .exercise {
                display: grid;
                grid-template-columns: 1fr auto auto auto;
                gap: 20px;
                padding: 15px;
                border-bottom: 2px solid #f0f0f0;
                align-items: center;
            }
            .exercise:last-child {
                border-bottom: none;
            }
            .exercise-name {
                font-size: 18px;
                font-weight: 700;
                color: ${program.accentColor};
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .tutorial-link {
                background: ${program.accentColor};
                color: white;
                padding: 4px 10px;
                border-radius: 20px;
                font-size: 0.8rem;
                text-decoration: none;
                transition: background 0.3s;
            }
            .tutorial-link:hover {
                background: #1e3c72;
                text-decoration: underline;
            }
            .exercise-detail {
                text-align: center;
                padding: 8px 16px;
                background: #f5f7fa;
                border-radius: 6px;
                font-weight: 500;
                min-width: 80px;
            }
            .exercise-detail span {
                display: block;
                font-size: 12px;
                color: #666;
                margin-bottom: 3px;
            }
            .footer {
                background: #f5f7fa;
                padding: 30px;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
            @media print {
                body {
                    background: white;
                    padding: 0;
                }
                .poster {
                    box-shadow: none;
                }
            }
            @media (max-width: 768px) {
                .exercise {
                    grid-template-columns: 1fr;
                    gap: 10px;
                }
                .exercise-detail {
                    display: inline-block;
                    margin: 5px;
                }
            }
        </style>
    </head>
    <body>
        <div class="poster">
            <div class="header">
                ${logoHtml}
                <h1 class="program-title">${
                  program.name || "Workout Program"
                }</h1>
                <div class="program-info">${
                  program.weeks
                } هفته برنامه | ایجاد شده ${today}</div>
            </div>
            ${traineeInfo}
            <div class="content">
                ${daysHTML}
            </div>
            ${programDescriptionHtml}
            ${trainerInfo}
            <div class="footer">
                <strong>METAL FIT</strong> | ما را در @metalfit دنبال کنید<br>
                به یاد داشته باشید: افزایش تدریجی وزنه بسیار مهم است! وزن ها را ثبت کنید و به تدریج افزایش دهید.
            </div>
        </div>
    </body>
    </html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${
      program.name.replace(/\s+/g, "_") || "workout_program"
    }.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("برنامه با موفقیت دانلود شد!");
  };

  // Determine if buttons should be disabled
  const isPreviewDisabled = program.days.length === 0;
  const isDownloadDisabled = program.days.length === 0 || !program.name.trim();

  return (
    <div className="program-info-and-main">
      <div className="program-info">
        <div className="form-group">
          <label htmlFor="name">نام برنامه</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={program.name}
            onChange={handleProgramInfoChange}
            placeholder="مثلاً: پوش/پول/پا"
          />
        </div>
        <div className="form-group">
          <label htmlFor="weeks">مدت زمان (هفته)</label>
          <input
            type="number"
            id="weeks"
            className="form-control"
            value={program.weeks}
            onChange={handleProgramInfoChange}
            min="1"
            max="52"
          />
        </div>
      </div>

      <div className="trainee-info-section">
        <h3>
          <FontAwesomeIcon icon="user" />
          &nbsp; اطلاعات ورزشکار
        </h3>{" "}
        {/* Use the component */}
        <div className="trainee-info-grid">
          <div className="trainee-info-item">
            <label htmlFor="traineeName">نام</label>
            <input
              type="text"
              id="traineeName"
              className="form-control"
              value={program.trainee.name}
              onChange={handleTraineeInfoChange}
              placeholder="نام ورزشکار را وارد کنید"
            />
          </div>
          <div className="trainee-info-item">
            <label htmlFor="traineeAge">سن</label>
            <input
              type="number"
              id="traineeAge"
              className="form-control"
              value={program.trainee.age}
              onChange={handleTraineeInfoChange}
              placeholder="سن را وارد کنید"
            />
          </div>
          <div className="trainee-info-item">
            <label htmlFor="traineeWeight">وزن (کیلوگرم)</label>
            <input
              type="number"
              id="traineeWeight"
              className="form-control"
              value={program.trainee.weight}
              onChange={handleTraineeInfoChange}
              placeholder="وزن را وارد کنید"
            />
          </div>
          <div className="trainee-info-item">
            <label htmlFor="traineeHeight">قد (سانتی متر)</label>
            <input
              type="number"
              id="traineeHeight"
              className="form-control"
              value={program.trainee.height}
              onChange={handleTraineeInfoChange}
              placeholder="قد را وارد کنید"
            />
          </div>
        </div>
      </div>

      <div className="program-description-section">
        <h3>
          <FontAwesomeIcon icon="file-alt" />
          &nbsp; توضیحات برنامه
        </h3>{" "}
        {/* Use the component */}
        <textarea
          id="description"
          className="form-control"
          value={program.description}
          onChange={handleProgramInfoChange}
          placeholder="توضیحات، دستورالعمل ها یا جزئیات اضافی برنامه را اینجا وارد کنید..."
        ></textarea>
      </div>

      <div className="main-content">
        <div className="panel">
          <div className="panel-title">
            <h2>
              <FontAwesomeIcon icon="calendar-day" />
              &nbsp; روزهای تمرینی
            </h2>{" "}
            {/* Use the component */}
            <button className="btn btn-primary" onClick={handleAddDay}>
              <FontAwesomeIcon icon="plus" />
              &nbsp; {/* Use the component */}
              اضافه کردن روز
            </button>
          </div>
          <div className="days-container" id="daysContainer">
            {program.days.length === 0 ? (
              <div className="empty-state" id="daysEmptyState">
                <FontAwesomeIcon icon="calendar-plus" />
                &nbsp; {/* Use the component */}
                <h3>هنوز روز تمرینی وجود ندارد</h3>
                <p>
                  برای شروع ساخت برنامه، دکمه "اضافه کردن روز" را کلیک کنید!
                </p>
              </div>
            ) : (
              program.days.map((day) => (
                <div
                  key={day.id}
                  className={`day-card ${
                    day.id === program.currentDayId ? "active" : ""
                  } ${draggedDayId === day.id ? "dragging" : ""}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, day.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day.id)}
                  onClick={() => handleSelectDay(day.id)}
                >
                  <div className="day-header">
                    <FontAwesomeIcon
                      icon="grip-lines"
                      className="drag-handle"
                    />
                    &nbsp; {/* Use the component */}
                    <input
                      type="text"
                      className="day-name-input form-control"
                      value={day.name}
                      onChange={(e) =>
                        handleDayNameChange(day.id, e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()} // Prevent day selection when editing name
                    />
                    <button
                      className="action-btn delete-day"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDay(day.id);
                      }}
                    >
                      <FontAwesomeIcon icon="trash" />
                      &nbsp; {/* Use the component */}
                    </button>
                  </div>
                  <div className="day-stats">
                    <span>
                      <FontAwesomeIcon icon="dumbbell" />
                      &nbsp; {/* Use the component */}
                      {day.exercises.reduce(
                        (sum, ex) => sum + (parseInt(ex.sets) || 0),
                        0
                      )}{" "}
                      ست
                    </span>
                    <span>
                      <FontAwesomeIcon icon="list" />
                      &nbsp; {/* Use the component */}
                      {day.exercises.length} تمرین
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel">
          <div className="exercise-section">
            <div className="panel-title">
              <h2>
                <FontAwesomeIcon icon="dumbbell" />
                &nbsp; {/* Use the component */}
                {currentDay ? currentDay.name : "یک روز را انتخاب کنید"}
              </h2>
              <div className="day-stats">
                <span>
                  <FontAwesomeIcon icon="dumbbell" />
                  &nbsp; <span id="daySets">{daySets}</span> ست
                </span>{" "}
                {/* Use the component */}
                <span>
                  <FontAwesomeIcon icon="list" />
                  &nbsp; <span id="dayExercises">{dayExercises}</span> تمرین
                </span>{" "}
                {/* Use the component */}
              </div>
            </div>
            <div className="exercise-db">
              <h3>اضافه کردن تمرینات</h3>
              <div className="muscle-groups" id="muscleGroups">
                {Object.keys(exerciseDatabase).map((mg) => (
                  <div
                    key={mg}
                    className="muscle-group"
                    onClick={() => showExercisesModal(mg)}
                  >
                    {/* <i className={`fas fa-${mg === 'chest' ? 'heart' : mg === 'back' ? 'backspace' : mg === 'legs' ? 'walking' : mg === 'shoulders' ? 'hand-point-up' : mg === 'arms' ? 'hand' : 'wind'}`}></i> */}
                    {/* Icon removed as requested */}
                    <h4>{mg.charAt(0).toUpperCase() + mg.slice(1)}</h4>
                  </div>
                ))}
              </div>
            </div>
            <div className="selected-exercises">
              <h3>تمرینات انتخاب شده</h3>
              <div id="selectedExercisesContainer">
                {currentDay && currentDay.exercises.length === 0 ? (
                  <div className="empty-state" id="exercisesEmptyState">
                    <FontAwesomeIcon icon="dumbbell" />
                    &nbsp; {/* Use the component */}
                    <h3>هنوز تمرینی اضافه نشده است</h3>
                    <p>تمرینات را از دسته های بالا انتخاب کنید.</p>
                  </div>
                ) : (
                  <div className="exercise-list">
                    {currentDay?.exercises.map((exercise) => (
                      <div key={exercise.id} className="exercise-item">
                        <div className="exercise-name">{exercise.name}</div>
                        <div className="exercise-details">
                          <div className="exercise-detail">
                            ست: {exercise.sets}
                          </div>
                          <div className="exercise-detail">
                            تکرار: {exercise.reps}
                          </div>
                          <div className="exercise-detail">
                            استراحت: {exercise.rest} ثانیه
                          </div>
                        </div>
                        <div className="exercise-actions">
                          <button
                            className="action-btn edit-exercise"
                            onClick={() => handleEditExercise(exercise.id)}
                          >
                            <FontAwesomeIcon icon="edit" />
                            &nbsp; {/* Use the component */}
                          </button>
                          <button
                            className="action-btn delete-exercise"
                            onClick={() => handleDeleteExercise(exercise.id)}
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
            </div>
            {isFormVisible && (
              <div
                className="exercise-form"
                id="exerciseForm"
                style={{ display: "block" }}
              >
                <h3>ویرایش تمرین</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="sets">ست</label>
                    <input
                      type="number"
                      id="sets"
                      name="sets"
                      className="form-control"
                      value={formState.sets}
                      onChange={handleFormChange}
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reps">تکرار</label>
                    <input
                      type="number"
                      id="reps"
                      name="reps"
                      className="form-control"
                      value={formState.reps}
                      onChange={handleFormChange}
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="rest">استراحت (ثانیه)</label>
                    <input
                      type="number"
                      id="rest"
                      name="rest"
                      className="form-control"
                      value={formState.rest}
                      onChange={handleFormChange}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="video">آدرس ویدیو آموزشی</label>
                    <input
                      type="text"
                      id="video"
                      name="video"
                      className="form-control"
                      value={formState.video}
                      onChange={handleFormChange}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="equipment">تجهیزات (از پایگاه داده)</label>
                  <input
                    type="text"
                    id="equipment"
                    className="form-control"
                    value={(() => {
                      if (!currentDay) return "ناشناخته";
                      const ex = currentDay.exercises.find(
                        (e) => e.id === currentExerciseId
                      );
                      if (!ex) return "ناشناخته";
                      const dbEntry = Object.values(exerciseDatabase)
                        .flat()
                        .find((dbEx) => dbEx.name === ex.name);
                      return dbEntry ? dbEntry.equipment : "ناشناخته";
                    })()}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="difficulty">سختی (از پایگاه داده)</label>
                  <input
                    type="text"
                    id="difficulty"
                    className="form-control"
                    value={(() => {
                      if (!currentDay) return "ناشناخته";
                      const ex = currentDay.exercises.find(
                        (e) => e.id === currentExerciseId
                      );
                      if (!ex) return "ناشناخته";
                      const dbEntry = Object.values(exerciseDatabase)
                        .flat()
                        .find((dbEx) => dbEx.name === ex.name);
                      return dbEntry ? dbEntry.difficulty : "ناشناخته";
                    })()}
                    readOnly
                  />
                </div>
                <button className="btn btn-success" onClick={handleFormSubmit}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp; {/* Use the component */}
                  ذخیره تغییرات
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- UPDATED BUTTONS --- */}
      <div className="action-buttons">
        <button
          className="btn btn-secondary"
          id="previewBtn"
          onClick={handlePreviewClick} // Use the new handler
          disabled={isPreviewDisabled} // Apply the calculated state
        >
          <FontAwesomeIcon icon="eye" />
          &nbsp; {/* Use the component */}
          پیش نمایش
        </button>
        <button
          className="btn btn-success"
          id="downloadBtn"
          onClick={handleDownloadClick} // Use the new handler
          disabled={isDownloadDisabled} // Apply the calculated state
        >
          <FontAwesomeIcon icon="download" />
          &nbsp; {/* Use the component */}
          دانلود HTML
        </button>
      </div>
    </div>
  );
};

export default ProgramBuilderTab;
