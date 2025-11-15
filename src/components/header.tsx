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
          showNotification("لطفاً قبل از ذخیره یک نام برنامه وارد کنید.");
          return;
        }
        if (programData.program.days.length === 0) {
          showNotification(
            "نمی توان یک برنامه خالی را ذخیره کرد. حداقل یک روز اضافه کنید."
          );
          return;
        }

        const savedPrograms = JSON.parse(
          localStorage.getItem("workoutPrograms") || "[]"
        );
        savedPrograms.push(programData);
        localStorage.setItem("workoutPrograms", JSON.stringify(savedPrograms));
        showNotification("برنامه با موفقیت ذخیره شد!");
      };

      return (
        <header>
          <div className="header-content">
            <div className="header-left">
              <h1>
                <FontAwesomeIcon icon="dumbbell" /> {/* Use the component */}
                &nbsp;سازنده پیشرفته برنامه تمرینی{" "}
                {/* Add space manually if needed */}
              </h1>
              <p>برنامه تمرینی سفارشی خود را با ویژگی های سفارشی ایجاد کنید</p>
            </div>
            <div className="header-right">
              <button
                className="btn btn-secondary"
                onClick={() => setIsCustomizeModalOpen(true)}
              >
                <FontAwesomeIcon icon="palette" />
                &nbsp; {/* Use the component */}
                سفارشی سازی
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setIsLoadProgramModalOpen(true)}
              >
                <FontAwesomeIcon icon="folder-open" />
                &nbsp; {/* Use the component */}
                بارگذاری برنامه
              </button>
              <button className="btn btn-success" onClick={handleSaveProgram}>
                <FontAwesomeIcon icon="save" />
                &nbsp; {/* Use the component */}
                ذخیره برنامه
              </button>
            </div>
          </div>
        </header>
      );
    };

    k / service;
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
            &nbsp;PowerBuildy {/* Add space manually if needed */}
          </h1>
          <p>ساخت برنامه های بدنسازی شخصی سازی شده</p>
        </div>
        <div className="header-right">
          <button
            className="btn btn-secondary"
            onClick={() => setIsCustomizeModalOpen(true)}
          >
            <FontAwesomeIcon icon="palette" />
            &nbsp; {/* Use the component */}
            شخصی سازی
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setIsLoadProgramModalOpen(true)}
          >
            <FontAwesomeIcon icon="folder-open" />
            &nbsp; {/* Use the component */}
            بارگذاری برنامه
          </button>
          <button className="btn btn-success" onClick={handleSaveProgram}>
            <FontAwesomeIcon icon="save" />
            &nbsp; {/* Use the component */}
            ذخیره برنامه
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
