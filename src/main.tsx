import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/App.scss";
import "./fontawesome";

document.body.classList.add("rtl");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
