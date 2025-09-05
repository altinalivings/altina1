// components/RightFloatActions.jsx
"use client";
import React from "react";
import RequestCall from "./RequestCall";

export default function RightFloatActions() {
  return (
    <div
      id="right-float-actions"
      style={{
        position: "fixed",
        right: 18,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2147483647,
        pointerEvents: "none"
      }}
    >
      <div style={{ pointerEvents: "auto" }}>
        <RequestCall />
      </div>
    </div>
  );
}
