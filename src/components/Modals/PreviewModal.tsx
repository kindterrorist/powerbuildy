// src/components/Modals/PreviewModal.tsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the component
import { useProgram } from "../../context/ProgramContext";

const PreviewModal: React.FC = () => {
  const {
    isPreviewModalOpen,
    setIsPreviewModalOpen,
    program,
    showNotification,
  } = useProgram();
  const [previewContent, setPreviewContent] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (isPreviewModalOpen) {
      // Generate preview content based on program state
      const content = [];
      if (program.days.length === 0) {
        content.push(
          <div key="empty" className="empty-state">
            <FontAwesomeIcon icon="calendar-times" />
            &nbsp; {/* Use the component */}
            <h3>هیچ روزی در برنامه نیست</h3>
            <p>برای پیش نمایش برنامه خود، حداقل یک روز اضافه کنید.</p>
          </div>
        );
      } else {
        // Add program info card
        content.push(
          <div key="info" className="detail-card">
            <div className="label">نام برنامه</div>
            <div className="value">{program.name || "برنامه بدون نام"}</div>
            <div className="label">مدت زمان</div>
            <div className="value">{program.weeks} هفته</div>
          </div>
        );

        // Add day summary cards
        program.days.forEach((day) => {
          const totalSets = day.exercises.reduce(
            (sum, ex) => sum + (parseInt(ex.sets) || 0),
            0
          );
          content.push(
            <div key={day.id} className="detail-card">
              <div className="label">روز</div>
              <div className="value">{day.name}</div>
              <div className="label">تمرینات</div>
              <div className="value">{day.exercises.length}</div>
              <div className="label">مجموع ست ها</div>
              <div className="value">{totalSets}</div>
            </div>
          );
        });
      }
      setPreviewContent(content);
    }
  }, [isPreviewModalOpen, program]);

  const handleDownload = () => {
    // Logic moved from original script to a utility or context function
    // This modal might just trigger the download via context
    // For now, simulate the download logic here
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
                <strong>نام باشگاه شما</strong> | ما را در @yourgym دنبال کنید<br>
                به یاد داشته باشید: افزایش تدریجی بار بسیار مهم است! وزن ها را ثبت کنید و به تدریج افزایش دهید.
            </div>
        </div>
    </body>
    </html>`;

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

  if (!isPreviewModalOpen) return null;

  return (
    <div className="modal" style={{ display: "flex" }}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>پیش نمایش برنامه</h2>
          <button
            className="close-modal"
            onClick={() => setIsPreviewModalOpen(false)}
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="exercise-details-grid" id="previewContent">
            {previewContent}
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setIsPreviewModalOpen(false)}
          >
            بستن
          </button>
          <button
            className="btn btn-success"
            id="downloadPreviewBtn"
            onClick={handleDownload}
          >
            <FontAwesomeIcon icon="download" />
            &nbsp; {/* Use the component */}
            دانلود HTML
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
