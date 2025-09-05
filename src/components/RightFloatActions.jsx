// components/RightFloatActions.jsx
"use client";
import React from "react";
import RequestCall from "./RequestCall"; // path to component below
import ChatWithUs from "./ChatWithUs";   // path to component below

export default function RightFloatActions() {
  return (
    <div
      id="right-float-actions"
      style={{
        position: "fixed",
        right: 18,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 2147483647, // highest safe z-index
        pointerEvents: "none" // allow children to selectively receive pointer
      }}
    >
      {/* Buttons should accept pointer events */}
      <div style={{ pointerEvents: "auto" }}>
        <RequestCall />
      </div>
      <div style={{ pointerEvents: "auto" }}>
        <ChatWithUs />
      </div>
    </div>
  );
}
