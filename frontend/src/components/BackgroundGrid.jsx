import React from "react";

export default function BackgroundGrid() {
  return (
    <>
      {/* Neon grid plane */}
      <div className="neon-grid" />
      {/* Vignette overlay */}
      <div className="vignette" />
      {/* Top neon gradient glow */}
      <div className="pointer-events-none fixed inset-x-0 -top-32 h-64 opacity-60"
           style={{
             background:
               "radial-gradient(50% 50% at 50% 0%, rgba(0,255,255,0.25) 0%, rgba(0,0,0,0) 70%)",
             zIndex: -1
           }}
      />
    </>
  );
}
