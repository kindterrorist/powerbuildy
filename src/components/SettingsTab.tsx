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
    showNotification("داده ها در کلیپ بورد کپی شدند!");
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importData);
      if (data.program) {
        setProgram(data.program);
        showNotification("داده ها با موفقیت وارد شدند!");
      } else {
        showNotification("فرمت داده ورودی نامعتبر است.");
      }
    } catch (error) {
      console.error(error);
      showNotification("فرمت JSON نامعتبر است. لطفاً داده ها را بررسی کنید.");
    }
  };

  return (
    <div className="settings-content">
      <div className="settings-section">
        <h3>
          <FontAwesomeIcon icon="chalkboard-teacher" />
          &nbsp; اطلاعات مربی
        </h3>{" "}
        {/* Use the component */}
        <div className="trainee-info-grid">
          <div className="trainee-info-item">
            <label htmlFor="trainerName">نام مربی</label>
            <input
              type="text"
              id="trainerName"
              className="form-control"
              value={program.trainer.name}
              onChange={handleTrainerInfoChange}
              placeholder="نام مربی را وارد کنید"
            />
          </div>
          <div className="trainee-info-item">
            <label htmlFor="trainerEmail">ایمیل</label>
            <input
              type="email"
              id="trainerEmail"
              className="form-control"
              value={program.trainer.email}
              onChange={handleTrainerInfoChange}
              placeholder="ایمیل را وارد کنید"
            />
          </div>
          <div className="trainee-info-item">
            <label htmlFor="trainerContact">اطلاعات تماس</label>
            <input
              type="text"
              id="trainerContact"
              className="form-control"
              value={program.trainer.contact}
              onChange={handleTrainerInfoChange}
              placeholder="اطلاعات تماس را وارد کنید"
            />
          </div>
          <div className="trainee-info-item" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="trainerBio">بیوگرافی</label>
            <textarea
              id="trainerBio"
              className="form-control"
              value={program.trainer.bio}
              onChange={handleTrainerInfoChange}
              placeholder="بیوگرافی را وارد کنید"
              rows={4}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="settings-section">
        <h3>
          <FontAwesomeIcon icon="database" />
          &nbsp; صدور/واردات داده
        </h3>{" "}
        {/* Use the component */}
        <div className="export-import">
          <div className="form-group">
            <label htmlFor="exportDataArea">صادر کردن داده</label>
            <textarea
              id="exportDataArea"
              value={exportData}
              readOnly
              placeholder="داده های صادر شده اینجا نمایش داده می شوند..."
            ></textarea>
            <button className="btn btn-primary" onClick={handleExport}>
              <FontAwesomeIcon icon="file-export" />
              &nbsp; {/* Use the component */}
              صدور به JSON
            </button>
          </div>
          <div className="form-group">
            <label htmlFor="importDataArea">وارد کردن داده</label>
            <textarea
              id="importDataArea"
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="داده JSON را اینجا جایگذاری کنید..."
            ></textarea>
            <button className="btn btn-success" onClick={handleImport}>
              <FontAwesomeIcon icon="file-import" />
              &nbsp; {/* Use the component */}
              وارد کردن از JSON
            </button>
          </div>
        </div>
      </div>
      <div className="settings-section">
        <h3>
          <FontAwesomeIcon icon="info-circle" />
          &nbsp; اطلاعات برنامه
        </h3>{" "}
        {/* Use the component */}
        <div style={{ padding: "15px" }}>
          <p>
            این برنامه اجازه می دهد تا برنامه های تمرینی سفارشی را ایجاد کنید
            با:
          </p>
          <ul style={{ margin: "10px 0 15px 20px" }}>
            <li>پایگاه داده تمرینات قابل سفارشی</li>
            <li>پیگیری اطلاعات ورزشکار</li>
            <li>قابلیت کشیدن و رها کردن</li>
            <li>قابلیت های صدور و واردات</li>
            <li>خروجی HTML حرفه ای</li>
          </ul>
          <p>تمام داده ها به صورت محلی در مرورگر شما ذخیره می شوند.</p>
          <p style={{ marginTop: "15px", fontWeight: "bold" }}>
            توسعه داده شده توسط: Ali Morsali{" "}
          </p>
          <p>تماس: Ali.morsali.2000@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
