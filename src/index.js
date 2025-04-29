import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import AutoPlayer from "./pages/AutoPlayer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="/auto" element={<AutoPlayer />} />
        <Route path="/manual" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
