// components/RightFloatActions.jsx
"use client";
import React from "react";
import RequestCall from "./RequestCall";
import ChatWithUs from "./ChatWithUs";

export default function RightFloatActions() {
  return (
    <div
      id="right-float-actions"
      style={{
        position: "fixed",
        right: 18,
        top: "50vh", // avoid transform to keep fixed children truly fixed to viewport
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 2147483647,
        pointerEvents: "none"
      }}
    >
      <div style={{ pointerEvents: "auto" }}>
        <RequestCall />
      </div>
      <div style={{ pointerEvents: "auto" }}>
        <ChatWithUs phone="919891234195" prefill="Hello, I would like to know more about your projects." />
      </div>
    </div>
  );
}
