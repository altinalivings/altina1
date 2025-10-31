"use client";
import { useEffect, useState } from "react";

export default function CookieConsent(){
  const [visible, setVisible] = useState(false);
  useEffect(()=>{
    const c = localStorage.getItem("altina_cookie_consent");
    if(!c) setVisible(true);
  },[]);

  function accept(){
    localStorage.setItem("altina_cookie_consent","accepted");
    setVisible(false);
    window.dispatchEvent(new Event("altina-analytics-enable"));
  }
  function decline(){
    localStorage.setItem("altina_cookie_consent","declined");
    setVisible(false);
  }

  if(!visible) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#FFF6D6] text-black border-t border-black/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row gap-3 items-center justify-between">
        <p className="text-sm">
          We use cookies to personalize content, analyze traffic, and enhance your experience. By continuing, you agree to our{" "}
          <a href="/privacy" className="underline text-[#C9A23F]">Privacy Policy</a>.
        </p>
        <div className="flex gap-2">
          <button type="button\" onClick={accept} className="px-4 py-1 rounded-md bg-[#C9A23F] text-white text-sm">Accept</button>
          <button type="button\" onClick={decline} className="px-4 py-1 rounded-md bg-gray-200 text-black text-sm">Decline</button>
        </div>
      </div>
    </div>
  )
}