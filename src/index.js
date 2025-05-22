import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SidebarProvider } from "./components/SidebarContext"; // ✅ أضف هذا

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SidebarProvider> {/* ✅ لف الـ App بالـ Context Provider */}
    <App />
  </SidebarProvider>
);
