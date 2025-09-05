// components/RightFloatActions.jsx
"use client";
import React from "react";
import RequestCall from "./RequestCall";
import SiteVisitPopup from "./SiteVisitPopup"; // assuming you already have this component
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
      {/* Organize Site Visit */}
      <div style={{ pointerEvents: "auto" }}>
        <SiteVisitPopup>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 20px",
              background: "#2563eb", // blue
              color: "#fff",
              border: "none",
              borderRadius: 9999,
              fontWeight: 600,
              fontSize: 14,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            Organize Site Visit
          </button>
        </SiteVisitPopup>
      </div>

      {/* Request a Callback */}
      <div style={{ pointerEvents: "auto" }}>
        <RequestCall
          buttonText="Request a Callback"
          buttonStyle={{
            background: "#0ea5a4", // teal
          }}
        />
      </div>

      {/* Chat with us */}
      <div style={{ pointerEvents: "auto" }}>
        <ChatWithUs
          phone="919891234195"
          prefill="Hello, I would like to know more about your projects."
          buttonStyle={{
            background: "#25D366", // WhatsApp green
          }}
        />
      </div>
    </div>
  );
}
