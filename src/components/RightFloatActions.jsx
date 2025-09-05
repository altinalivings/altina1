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
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 2147483647,
        pointerEvents: "none"
      }}
    >
      <div style={{ pointerEvents: "auto" }}>
        {/* RequestCall renders its own trigger button; same modal used site-wide */}
        <RequestCall buttonText="Request a Call" />
      </div>
      <div style={{ pointerEvents: "auto" }}>
        <ChatWithUs phone="91XXXXXXXXXX" prefill="Hi — I want to know about your projects." />
      </div>
    </div>
  );
}
