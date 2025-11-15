// src/components/Modals/CustomizeModal.tsx
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the component
import { useProgram } from "../../context/ProgramContext";

const CustomizeModal: React.FC = () => {
  const {
    isCustomizeModalOpen,
    setIsCustomizeModalOpen,
    program,
    setProgram,
    showNotification,
  } = useProgram();
  const [logoPreview, setLogoPreview] = useState<string | null>(program.logo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCustomizeModalOpen) {
      setLogoPreview(program.logo);
    }
  }, [isCustomizeModalOpen, program.logo]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoPreview(result);
        setProgram((prev) => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (color: string) => {
    setProgram((prev) => ({ ...prev, accentColor: color }));
    document.documentElement.style.setProperty("--accent", color);
    document.querySelector(
      "header"
    )!.style.background = `linear-gradient(135deg, ${color} 0%, #2a5298 100%)`;
  };

  const colors = [
    "#667eea",
    "#3498db",
    "#2ecc71",
    "#e74c3c",
    "#f39c12",
    "#9b59b6",
  ];

  if (!isCustomizeModalOpen) return null;

  return (
    <div className="modal" style={{ display: "flex" }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Customize Your Program</h2>
          <button
            className="close-modal"
            onClick={() => setIsCustomizeModalOpen(false)}
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="logoUpload">Upload Logo</label>
            <div className="logo-preview" id="logoPreview">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" />
              ) : (
                <FontAwesomeIcon icon="image" />
              )}{" "}
              {/* Use the component */}
            </div>
            <input
              type="file"
              id="logoUpload"
              ref={fileInputRef}
              className="form-control"
              accept="image/*"
              onChange={handleLogoChange}
            />
          </div>
          <div className="form-group">
            <label>Accent Color</label>
            <div className="color-picker">
              {colors.map((color) => (
                <div
                  key={color}
                  className={`color-option ${
                    program.accentColor === color ? "active" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                  data-color={color}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setIsCustomizeModalOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeModal;
