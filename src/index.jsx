import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import AutoPlayer from "./pages/AutoPlayer";
import ManualPlayer from "./pages/ManualPlayer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Provider } from "react-redux";
import { store } from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <BrowserRouter>
          <Routes>
            <Route index element={<ManualPlayer />} />
            <Route path="/auto" element={<AutoPlayer />} />
          </Routes>
        </BrowserRouter>
      </DndProvider>
    </Provider>
  </React.StrictMode>
);
