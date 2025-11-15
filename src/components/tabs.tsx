import React from "react";
import { useProgram } from "../context/ProgramContext";

const Tabs: React.FC = () => {
  const { activeTab, setActiveTab } = useProgram();

  return (
    <div className="tabs">
      <div
        className={`tab ${activeTab === "program" ? "active" : ""}`}
        onClick={() => setActiveTab("program")}
      >
        سازنده برنامه
      </div>
      <div
        className={`tab ${activeTab === "exercises" ? "active" : ""}`}
        onClick={() => setActiveTab("exercises")}
      >
        تمرینات
      </div>
      <div
        className={`tab ${activeTab === "settings" ? "active" : ""}`}
        onClick={() => setActiveTab("settings")}
      >
        تنظیمات
      </div>
    </div>
  );
};

export default Tabs;
