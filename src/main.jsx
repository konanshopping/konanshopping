import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import "./index.css";
import "./security/apiSecurity";
import App from "./App.jsx";

import { Toaster } from "react-hot-toast";

registerSW({
  immediate: true,
});

createRoot(document.getElementById("root")).render(
  <>
    <Toaster />
    <App />
  </>
);