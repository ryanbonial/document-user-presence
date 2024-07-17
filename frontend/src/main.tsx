import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { UserPresenceProvider } from "./context/UserPresenceContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserPresenceProvider>
      <App />
    </UserPresenceProvider>
  </React.StrictMode>
);
