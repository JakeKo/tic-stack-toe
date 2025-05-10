import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import AutoPlayer from "./pages/AutoPlayer";
import ManualPlayer from "./pages/ManualPlayer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <Routes>
          <Route index element={<App />} />
          <Route path="/auto" element={<AutoPlayer />} />
          <Route path="/manual" element={<ManualPlayer />} />
        </Routes>
      </BrowserRouter>
    </DndProvider>
  </React.StrictMode>
);
