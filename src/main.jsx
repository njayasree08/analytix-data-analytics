import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { DatasetProvider } from "./context/DatasetContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DatasetProvider>
      <App />
    </DatasetProvider>
  </StrictMode>
);