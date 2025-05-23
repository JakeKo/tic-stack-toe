import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Routes, Route, HashRouter } from "react-router";
import App from "./App";
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
        <HashRouter>
          <Routes>
            <Route index element={<App />} />
            <Route path="/auto" element={<AutoPlayer />} />
            <Route path="/manual" element={<ManualPlayer />} />
          </Routes>
        </HashRouter>
      </DndProvider>
    </Provider>
  </React.StrictMode>
);
