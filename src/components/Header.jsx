"use client";
import React from "react";

export default function Header() {
  return (
    <header style={{position:'relative',zIndex:50,background:'linear-gradient(90deg, rgba(14,21,33,0.9), rgba(14,21,33,0.7))',backdropFilter:'blur(6px)'}}>
      <div className="site-wrapper" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0'}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <a href="/" style={{fontWeight:800,color:'#e9a826',fontSize:20}}>Altina Livings</a>
          <nav className="nav" aria-label="Main navigation">
            <a href="/listings" style={{marginLeft:14,color:'#fff'}}>Listings</a>
            <a href="/about" style={{marginLeft:14,color:'#fff'}}>About</a>
            <a href="/contact" style={{marginLeft:14,color:'#fff'}}>Contact</a>
          </nav>
        </div>
        <div style={{display:'flex',gap:8}}>
          <a href="/contact" className="btn" style={{background:'#e9a826',color:'#081018'}}>Get in touch</a>
        </div>
      </div>
      <div style={{background:'#081018',color:'#e9a826',overflow:'hidden'}}>
        <div style={{whiteSpace:'nowrap',display:'flex',animation:'marquee 18s linear infinite',gap:40,padding:'8px 0'}}>
          <span>Premium listings • Exclusive channel partner deals • Curated properties</span>
          <span>Special offers • Limited time discounts • High ROI projects</span>
          <span>Trusted developers: DLF, M3M, Mahagun, Godrej</span>
        </div>
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0%)}100%{transform:translateX(-50%)}}`}</style>
    </header>
  );
}