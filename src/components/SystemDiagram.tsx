import { useState } from "react";

interface DiagramProps {
  systemType: "on-grid" | "off-grid" | "hybrid";
}

export default function SystemDiagram({ systemType }: DiagramProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Active flow helpers
  const flowColorClass = systemType === "off-grid" ? "text-brand-orange" : "text-brand-teal-light";

  return (
    <div className="relative w-full h-[260px] bg-black/50 border border-white/5 rounded-2xl flex flex-col items-center justify-center overflow-hidden p-6 shadow-2xl">
      {/* Schematic Layout Title */}
      <div className="absolute top-4 left-4 flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="font-mono text-[9px] uppercase tracking-widest text-white/50">
          Schematic: {systemType.toUpperCase()} ARCHITECTURE
        </span>
      </div>

      {/* Interactive Node Info Overlay */}
      <div className="absolute top-4 right-4 h-6 px-3 bg-white/5 border border-white/10 rounded-full flex items-center text-[10px] font-mono tracking-wider text-cyan-400">
        {hoveredNode ? hoveredNode : "Hover components to detail flow"}
      </div>

      {/* SVG Diagram Canvas */}
      <svg className="w-full max-w-[380px] h-[160px] select-none pointer-events-auto" viewBox="0 0 380 160">
        <defs>
          <linearGradient id="panel-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e9d9d" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#167070" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="sun-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f57d31" />
            <stop offset="100%" stopColor="#ff8f45" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* ── SUN ── */}
        <g 
          transform="translate(40, 30)" 
          className="cursor-help"
          onMouseEnter={() => setHoveredNode("Sun Array — Photonic Energy Source")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <circle cx="0" cy="0" r="14" fill="url(#sun-orange)" className="animate-pulse" />
          <circle cx="0" cy="0" r="22" stroke="#f57d31" strokeWidth="0.5" strokeDasharray="3 3" className="spin" style={{ transformOrigin: "0px 0px" }} />
          {/* Light Rays */}
          <path d="M0 -18 L0 -24 M0 18 L0 24 M-18 0 L-24 0 M18 0 L24 0" stroke="#f57d31" strokeWidth="1" />
        </g>

        {/* Ray to Panel Flow */}
        <line x1="40" y1="52" x2="40" y2="84" stroke="#f57d31" strokeWidth="1.5" strokeDasharray="4 4" className="energy-line-anim" />

        {/* ── SOLAR PANEL ARRAY ── */}
        <g 
          transform="translate(15, 85)"
          className="cursor-help"
          onMouseEnter={() => setHoveredNode("Bifacial Solar Module Array (PV)")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <rect x="0" y="0" width="54" height="32" rx="3" fill="url(#panel-blue)" stroke="rgba(30,157,157,0.5)" strokeWidth="1" />
          {/* Panel grid detailing */}
          <line x1="18" y1="0" x2="18" y2="32" stroke="#070708" strokeWidth="0.75" />
          <line x1="36" y1="0" x2="36" y2="32" stroke="#070708" strokeWidth="0.75" />
          <line x1="0" y1="16" x2="54" y2="16" stroke="#070708" strokeWidth="0.75" />
        </g>

        {/* ── PANEL TO INVERTER / BATTERY CABLES ── */}
        {systemType === "off-grid" ? (
          // Off Grid flows to battery first
          <>
            <path d="M 69 101 Q 120 101 120 115" fill="none" stroke="#f57d31" strokeWidth="2" className="energy-line-anim" />
            <path d="M 140 120 L 220 120" fill="none" stroke="#e4e4ea" strokeWidth="1.5" strokeDasharray="4 4" />
          </>
        ) : systemType === "hybrid" ? (
          // Hybrid splits to inverter and battery
          <>
            <path d="M 69 101 L 140 101" fill="none" stroke="#1e9d9d" strokeWidth="2" className="energy-line-anim" />
            <path d="M 105 101 L 105 130 Q 105 130 140 130" fill="none" stroke="#f57d31" strokeWidth="2.5" className="energy-line-anim" />
          </>
        ) : (
          // On Grid flows directly to synchronizing inverter
          <path d="M 69 101 L 140 101" fill="none" stroke="#1e9d9d" strokeWidth="2.5" className="energy-line-anim" />
        )}

        {/* ── CORE MULTIPHASE INVERTER ── */}
        <g 
          transform="translate(140, 85)"
          className="cursor-help"
          onMouseEnter={() => setHoveredNode("Multi-MPPT High Frequency Inverter")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <rect x="0" y="0" width="46" height="32" rx="3" fill="#111115" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <rect x="6" y="6" width="34" height="20" rx="1.5" fill="#070708" />
          {/* LED display blinkers */}
          <circle cx="12" cy="16" r="1.5" fill="#1e9d9d" className="animate-pulse" />
          <circle cx="20" cy="16" r="1.5" fill="#f57d31" />
          {/* Grid vent */}
          <line x1="28" y1="12" x2="34" y2="12" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
          <line x1="28" y1="16" x2="34" y2="16" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
          <line x1="28" y1="20" x2="34" y2="20" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
        </g>

        {/* ── BATTERY ARRAY (FOR OFF-GRID & HYBRID) ── */}
        {(systemType === "off-grid" || systemType === "hybrid") && (
          <g 
            transform="translate(140, 125)"
            className="cursor-help"
            onMouseEnter={() => setHoveredNode("Deep-Cycle Battery Storage")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <rect x="0" y="0" width="46" height="24" rx="3" fill="#18181d" stroke="rgba(245,125,49,0.3)" strokeWidth="1" />
            <line x1="10" y1="8" x2="36" y2="8" stroke="#f57d31" strokeWidth="1.5" />
            <line x1="10" y1="14" x2="36" y2="14" stroke="#f57d31" strokeWidth="1.5" />
            {/* Battery node nodes */}
            <circle cx="6" cy="11" r="1.5" fill="#25d366" />
          </g>
        )}

        {/* Connection from inverter onwards */}
        <path d="M 186 101 L 246 101" fill="none" stroke="#1e9d9d" strokeWidth="2" className="energy-line-anim" />

        {/* ── CONSUMER HOME / METRIC LOADS ── */}
        <g 
          transform="translate(246, 75)"
          className="cursor-help"
          onMouseEnter={() => setHoveredNode("Primary Customer House Layout (Load)")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <polygon points="20,0 2,16 38,16" fill="#167070" opacity="0.65" />
          <rect x="5" y="16" width="30" height="24" rx="2" fill="#111115" stroke="rgba(30,157,157,0.3)" strokeWidth="1" />
          <rect x="15" y="24" width="10" height="16" fill="rgba(30,157,157,0.2)" />
          {/* Glow lights inside home to indicate active current flow */}
          <circle cx="20" cy="20" r="2.5" fill="#f57d31" className="animate-pulse" />
        </g>

        {/* ── EXTERNAL ELECTIVE UTILITY GRID ── */}
        {systemType !== "off-grid" && (
          <>
            <path d="M 286 95 Q 320 95 330 66" fill="none" stroke="#e4e4ea" strokeWidth="1.5" strokeDasharray="3 3" />
            <g 
              transform="translate(320, 22)"
              className="cursor-help"
              onMouseEnter={() => setHoveredNode("External TANGEDCO / Utility Power Grid")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Electric tower schematic */}
              <line x1="15" y1="0" x2="15" y2="35" stroke="#f57d31" strokeWidth="1.5" />
              <line x1="0" y1="35" x2="30" y2="35" stroke="#f57d31" strokeWidth="1.5" />
              <line x1="0" y1="12" x2="30" y2="12" stroke="#f57d31" strokeWidth="1.2" />
              <line x1="3" y1="22" x2="27" y2="22" stroke="#f57d31" strokeWidth="1.2" />
              <polygon points="15,0 7,35 23,35" fill="none" stroke="#f57d31" strokeWidth="0.8" />
              <circle cx="15" cy="0" r="2" fill="#f57d31" className="animate-pulse" />
            </g>
          </>
        )}
      </svg>

      {/* Schematic Footnote */}
      <div className="absolute bottom-4 text-center text-[10px] text-white/30 font-mono">
        Active current transfer indicated in <span className={flowColorClass}>colored running paths</span>
      </div>
    </div>
  );
}
