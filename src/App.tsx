import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Sliders, 
  HelpCircle, 
  Sparkles, 
  Activity, 
  Layout, 
  Cpu, 
  Layers, 
  Zap, 
  Play, 
  RotateCcw, 
  Check, 
  Copy, 
  Info, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  MessageSquare
} from "lucide-react";
import ParticlesBackground from "./components/ParticlesBackground";
import SystemDiagram from "./components/SystemDiagram";
import RoiCalculator from "./components/RoiCalculator";

// Type definitions for portfolio items
interface ProjectItem {
  id: string;
  title: string;
  category: "rooftop" | "commercial" | "industrial";
  thumb: string;
  scale: string;
  location: string;
}

export default function App() {
  // Navigation active state
  const [activeTab, setActiveTab] = useState<string>("home");
  
  // Sticky subsidy bar visibility
  const [showStickyBar, setShowStickyBar] = useState<boolean>(false);
  const [dismissStickyBar, setDismissStickyBar] = useState<boolean>(false);

  // System architecture active card
  const [activeSys, setActiveSys] = useState<"on-grid" | "off-grid" | "hybrid">("on-grid");

  // Project portfolio filters
  const [currFilter, setCurrFilter] = useState<string>("all");

  // Custom cursor smooth state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
  // Refs for custom cursor trailing lerp animation
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringRef = useRef({ x: 0, y: 0 });

  // Hero parallax mouse coordinate offsets
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  // Countdown clock state representation
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // AI Chatbot specialist state
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "Welcome to Q Techs Expert Engine. Ask me any technical questions about the 2027 subsidy, peak-load shaving, grid synchronizations, or system ROIs in Tamil Nadu."
    }
  ]);
  const [userQuery, setUserQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Contact form submission status
  const [formState, setFormState] = useState<{
    name: string;
    phone: string;
    email: string;
    location: string;
    message: string;
    isSending: boolean;
    success: boolean;
  }>({
    name: "",
    phone: "",
    email: "",
    location: "",
    message: "",
    isSending: false,
    success: false,
  });

  // Target Countdown anchor limit (March 31, 2027)
  const COUNTDOWN_TARGET = useMemo(() => new Date("2027-03-31T23:59:59"), []);

  // 1. Countdown timer calculation
  useEffect(() => {
    const calcTime = () => {
      const diff = COUNTDOWN_TARGET.getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setTimeLeft({
        days: String(days),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    calcTime();
    const interval = setInterval(calcTime, 1000);
    return () => clearInterval(interval);
  }, [COUNTDOWN_TARGET]);

  // 2. Custom trailing cursor dot-ring physics simulation via RAF
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Calculate hero parallax on scroll limits
      const px = (e.clientX / window.innerWidth - 0.5) * 22;
      const py = (e.clientY / window.innerHeight - 0.5) * 16;
      setParallaxOffset({ x: px, y: py });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Custom requestAnimationFrame loop for interactive lerping
    let animationId: number;
    const animateRing = () => {
      // Lerping formula: current = current + (target - current) * factor
      const speed = 0.16; // Buttery delay coefficient
      ringRef.current.x += (mouseRef.current.x - ringRef.current.x) * speed;
      ringRef.current.y += (mouseRef.current.y - ringRef.current.y) * speed;
      
      setRingPos({ x: ringRef.current.x, y: ringRef.current.y });
      animationId = requestAnimationFrame(animateRing);
    };
    
    animationId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Set cursor interaction state on active hovering
  const toggleCursorHover = (hovering: boolean) => {
    setIsHovered(hovering);
  };

  // 3. Dynamic sticky bar alert on scroll boundaries
  useEffect(() => {
    const handleScroll = () => {
      const boundary = document.getElementById("countdown-section");
      if (boundary) {
        const rect = boundary.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 4. AI Consultant Expert Bot Responses Router
  const handleBotResponse = async (queryText: string) => {
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800)); // Simulated AI delay
    
    const query = queryText.toLowerCase();
    let reply = "";

    if (query.includes("subsidy") || query.includes("deadline") || query.includes("2027")) {
      reply = "The current rooftop solar subsidy scheme ends on March 31, 2027. Under this mandate (PM Surya Ghar), household grid integrations up to 3kW obtain ₹78,000 in upfront subsidies. High commercial setups (like some 50kW installations) obtain strategic tax benefits, but slot approvals are strictly limited. Proceeding now secures your grid synchronization priority on the local TANGEDCO node.";
    } else if (query.includes("50kw") || query.includes("config") || query.includes("optimal") || query.includes("industrial")) {
      reply = "For industrial applications, we typically engineer a 50kW configuration using 3-phase string inverters with modern multi-MPPT tracking and heavy-duty, outdoor-hardened ACDB/DCDB protection boxes. Adding 20-40kWh of integrated battery storage allows peak-load shaving, saving thousands in high commercial tariff durations. Review our 'ROI Simulation' tool on-screen to view exact parameters.";
    } else if (query.includes("approach") || query.includes("why") || query.includes("quality")) {
      reply = "Unlike other installers, Q Techs has an engineering-first approach. We build and test custom ACDB and DCDB combiner boxes at our headquarters, featuring high-frequency metal oxides, surge suppressors, and tier-1 component selections that resist coastal corrosion (essential for Thoothukudi & Chennai microclimates).";
    } else {
      reply = "That is a great inquiry. Our full B2B solar material logistics and rooftop subsidy installation hub specializes in matching custom capacity to existing facility load configurations. I strongly recommend filling out our Consultation Form below to trigger a pre-design shadow audit of your site.";
    }

    setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    setIsTyping(false);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setUserQuery("");
    handleBotResponse(text);
  };

  // 5. Portfolio project collection
  const portfolioItems: ProjectItem[] = [
    { id: "p1", title: "Industrial Rooftop Alignment — 100kW", category: "industrial", thumb: "https://picsum.photos/seed/indu-panel/600/450", scale: "100 kW", location: "Thoothukudi Zone" },
    { id: "p2", title: "Commercial Office Complex — 25kW", category: "commercial", thumb: "https://picsum.photos/seed/comm-office/600/450", scale: "25 kW", location: "Chennai Hub" },
    { id: "p3", title: "Premium Residential Villa — 8kW", category: "rooftop", thumb: "https://picsum.photos/seed/villa/600/450", scale: "8 kW", location: "Madurai District" },
    { id: "p4", title: "Industrial Storage — 50kW", category: "industrial", thumb: "https://picsum.photos/seed/indu-fac/600/450", scale: "50 kW", location: "Coimbatore Corridor" },
    { id: "p5", title: "Commercial Complex Matrix — 15kW", category: "commercial", thumb: "https://picsum.photos/seed/shop/600/450", scale: "15 kW", location: "Trichy Center" },
    { id: "p6", title: "B2C Subsidy Residential Set — 5kW", category: "rooftop", thumb: "https://picsum.photos/seed/roof-home/600/450", scale: "5 kW", location: "Tirunelveli Zone" },
  ];

  // Filtering portfolio collection based on category
  const filteredPortfolio = useMemo(() => {
    if (currFilter === "all") return portfolioItems;
    return portfolioItems.filter(item => item.category === currFilter);
  }, [currFilter]);

  // 6. Contact form validation and submittal simulation
  const handleContactForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.phone.trim() || !formState.message.trim()) {
      alert("Please specify Name, Phone, and Project Requirements.");
      return;
    }
    setFormState((prev) => ({ ...prev, isSending: true }));
    setTimeout(() => {
      setFormState((prev) => ({ ...prev, isSending: false, success: true }));
      // Generate dynamic WhatsApp link corresponding to the inputs
      const msgText = encodeURIComponent(`Hi Q Techs Solar! My name is ${formState.name} located in ${formState.location || "Tamil Nadu"}. I am interested in solar consultation. Scope requirement: ${formState.message}.`);
      window.open(`https://wa.me/919363966626?text=${msgText}`, "_blank");
    }, 1500);
  };

  return (
    <div className="relative min-h-screen">
      
      {/* Background Layer with Particles Canvas */}
      <ParticlesBackground />

      {/* Primary Top Progress Bar scrolled metrics */}
      <div 
        id="top-progress" 
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-brand-teal via-brand-teal-light to-brand-orange z-[1100] transition-all duration-300"
        style={{
          width: `${typeof window !== "undefined" ? (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100 : 0}%`
        }}
      />

      {/* High-fidelity Custom Cursor Trail */}
      <div 
        id="custom-cursor-dot" 
        className="fixed w-2 h-2 bg-brand-teal-light rounded-full pointer-events-none z-[2000] -translate-x-1/2 -translate-y-1/2 hidden lg:block"
        style={{ left: mousePos.x, top: mousePos.y }}
      />
      <div 
        id="custom-cursor-ring" 
        className="fixed rounded-full border pointer-events-none z-[1999] -translate-x-1/2 -translate-y-1/2 hidden lg:block transition-all duration-150"
        style={{ 
          left: ringPos.x, 
          top: ringPos.y,
          width: isHovered ? "54px" : "34px",
          height: isHovered ? "54px" : "34px",
          borderColor: isHovered ? "rgba(30,157,157,0.7)" : "rgba(255,255,255,0.25)",
          backgroundColor: isHovered ? "rgba(30,157,157,0.08)" : "transparent"
        }}
      />

      {/* Floating Sticky Countdown Header Ribbons */}
      <div 
        id="sticky-subsidy-ribbon" 
        className={`fixed top-16 left-0 right-0 h-14 bg-deep-black/95 border-b border-brand-orange/30 shadow-[0_4px_30px_rgba(245,125,49,0.12)] backdrop-blur-md z-[990] flex items-center justify-between px-6 lg:px-12 transition-transform duration-300 translate-y-[-140%] ${
          showStickyBar && !dismissStickyBar ? "translate-y-0" : ""
        }`}
      >
        <span className="font-mono text-xs text-brand-orange uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 bg-brand-orange rounded-full animate-ping" />
          Subsidy ends soon:
        </span>
        <div className="flex items-center gap-2">
          <div className="text-sm font-mono font-bold text-brand-orange-light">
            {timeLeft.days}D : {timeLeft.hours}H : {timeLeft.minutes}M : {timeLeft.seconds}S
          </div>
          <a 
            href="#contact" 
            className="btn btn-primary btn-sm rounded-full bg-brand-orange hover:bg-brand-orange-light text-white ml-4 font-mono font-bold text-[10px] tracking-widest uppercase transition-all"
            onMouseEnter={() => toggleCursorHover(true)}
            onMouseLeave={() => toggleCursorHover(false)}
          >
            Apply Now →
          </a>
          <button 
            onClick={() => setDismissStickyBar(true)}
            className="text-white/40 hover:text-white text-xs ml-4 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Navigation Header */}
      <nav id="navbar" className="fixed top-0 left-0 right-0 h-16 border-b border-white/10 flex items-center justify-between px-6 lg:px-12 z-[1000] bg-deep-black/90 backdrop-blur-md">
        <a 
          href="#" 
          className="flex items-center gap-3"
          onMouseEnter={() => toggleCursorHover(true)}
          onMouseLeave={() => toggleCursorHover(false)}
        >
          <div className="w-10 h-10 bg-brand-teal rounded-full flex items-center justify-center font-bold text-lg italic text-white glow-teal animate-pulse">S</div>
          <div className="flex flex-col line-none">
            <span className="text-sm font-bold tracking-wider text-white">Q Techs Solar</span>
            <span className="text-[10px] text-brand-orange font-mono tracking-widest uppercase">Current Into Time</span>
          </div>
        </a>

        {/* Desktop links navigation with scroll monitor */}
        <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-semibold text-white/50">
          <a href="#" className="hover:text-brand-teal-light transition-all duration-300">Home</a>
          <a href="#solutions" className="hover:text-brand-teal-light transition-all duration-300">Solutions</a>
          <a href="#products" className="hover:text-brand-teal-light transition-all duration-300">Products</a>
          <a href="#portfolio" className="hover:text-brand-teal-light transition-all duration-300">Projects</a>
          <a href="#contact" className="hover:text-brand-teal-light transition-all duration-300">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="#contact" 
            className="btn btn-primary btn-sm rounded-lg"
            onMouseEnter={() => toggleCursorHover(true)}
            onMouseLeave={() => toggleCursorHover(false)}
          >
            Get Audit
          </a>
          <a 
            href="tel:+919363966626" 
            className="hidden sm:inline-flex px-3 py-1.5 rounded-lg border border-white/10 hover:border-brand-teal-light hover:bg-brand-teal/10 text-xs font-mono transition-all text-white/70"
            onMouseEnter={() => toggleCursorHover(true)}
            onMouseLeave={() => toggleCursorHover(false)}
          >
            Direct: 9363966626
          </a>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="min-h-screen pt-24 pb-12 flex items-center relative overflow-hidden" id="home-section">
        <div className="wrap max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero text description */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-teal/15 border border-brand-teal/30 text-brand-teal-light font-mono text-[9px] uppercase tracking-widest rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" />
              Smart Solar Solutions For A Better Tomorrow
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-bold tracking-tighter uppercase leading-[0.9] text-white">
              Q Techs<br /><span className="text-brand-teal-light">Solar.</span>
            </h1>
            <p className="font-mono text-xs uppercase tracking-widest text-[#f57d31] mt-3">Rooftop Solar Subsidy Projects &amp; B2B Material Supply</p>
            <p className="text-sm sm:text-base text-white/50 max-w-lg leading-relaxed mt-4">
              We provide end-to-end technical consultation, premium material supply, and custom-engineered protection box fabrication (ACDB &amp; DCDB) for commercial, residential, and industrial grids across Tamil Nadu.
            </p>
            
            {/* CTA action buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button 
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3 bg-brand-teal hover:bg-brand-teal-light text-white rounded-lg text-xs uppercase tracking-widest font-bold glow-teal transition-all flex items-center gap-2"
                onMouseEnter={() => toggleCursorHover(true)}
                onMouseLeave={() => toggleCursorHover(false)}
              >
                Get Free Consultation
                <ArrowRight className="w-4 h-4" />
              </button>
              <a 
                href="https://wa.me/919363966626" 
                target="_blank" 
                rel="noopener" 
                className="px-6 py-3 bg-brand-orange hover:bg-[#ff8f45] text-white rounded-lg text-xs uppercase tracking-widest font-bold glow-orange transition-all"
                onMouseEnter={() => toggleCursorHover(true)}
                onMouseLeave={() => toggleCursorHover(false)}
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Interactive Parallax SVG Graphic Column */}
          <div className="flex items-center justify-center relative">
            <div 
              id="hero-illus" 
              className="w-full max-w-[500px] border border-white/5 bg-[#0a0a0d]/80 rounded-2xl p-6 glow-teal transition-transform duration-75"
              style={{
                transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`
              }}
              onMouseEnter={() => toggleCursorHover(true)}
              onMouseLeave={() => toggleCursorHover(false)}
            >
              <svg viewBox="0 0 520 420" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background soft glowing vector ellipses */}
                <ellipse cx="260" cy="210" rx="190" ry="120" fill="rgba(30,157,157,0.06)" />
                <circle cx="390" cy="80" r="28" fill="#f57d31" opacity="0.8" className="animate-pulse" />
                <circle cx="390" cy="80" r="42" stroke="#f57d31" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />

                {/* Animated Solar Panel Circuit Outline */}
                <rect x="120" y="130" width="240" height="150" rx="8" fill="#111115" stroke="rgba(30,157,157,0.3)" strokeWidth="2" />
                <line x1="120" y1="180" x2="360" y2="180" stroke="rgba(30,157,157,0.2)" strokeWidth="1" />
                <line x1="120" y1="230" x2="360" y2="230" stroke="rgba(30,157,157,0.2)" strokeWidth="1" />
                <line x1="180" y1="130" x2="180" y2="280" stroke="rgba(30,157,157,0.2)" strokeWidth="1" />
                <line x1="240" y1="130" x2="240" y2="280" stroke="rgba(30,157,157,0.2)" strokeWidth="1" />
                <line x1="300" y1="130" x2="300" y2="280" stroke="rgba(30,157,157,0.2)" strokeWidth="1" />

                {/* Power Distribution line flow indicators */}
                <path className="energy-line-anim" d="M 360 205 Q 430 190 450 160 Q 470 135 480 120" stroke="#f57d31" strokeWidth="3" fill="none" />
                <path className="energy-line-anim" d="M 120 205 Q 60 190 48 160 Q 36 135 30 120" stroke="#f57d31" strokeWidth="3" fill="none" />

                <g transform="translate(14, 98)">
                  <circle cx="20" cy="20" r="14" fill="#f57d31" opacity="0.8" className="animate-pulse" />
                  <circle cx="20" cy="20" r="8" fill="#fff" opacity="0.3" />
                </g>
                <g transform="translate(450, 98)">
                  <circle cx="20" cy="20" r="14" fill="#f57d31" opacity="0.8" className="animate-pulse" />
                  <circle cx="20" cy="20" r="8" fill="#fff" opacity="0.3" />
                </g>
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* ── TIME CRITICAL SUBSIDY COUNTDOWN ── */}
      <section class="alert-bar" id="countdown-section">
        <div className="wrap max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-10 bg-[#111115]/80 border-y border-white/5 rounded-3xl relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-brand-orange uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" />
              TANGEDCO SLOT RESERVATION EXPIRY
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white mb-2">Solar Subsidy Scheme Closing!</h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-lg">
              Secure your MNRE national subsidy approval slot before the closing window. Apply today to guarantee a refund allotment of up to <strong>₹78,000</strong>.
            </p>
          </div>
          <div>
            <div className="grid grid-cols-4 gap-3 bg-#070708 p-4 rounded-xl border border-white/5 relative overflow-hidden">
              <div className="text-center bg-[#1c1c24] border border-white/5 rounded-lg py-4 relative overflow-hidden">
                <span className="font-mono text-3xl sm:text-4xl font-bold text-brand-orange block" id="cd-d">--</span>
                <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono mt-1 block">Days</span>
              </div>
              <div className="text-center bg-[#1c1c24] border border-white/5 rounded-lg py-4 relative overflow-hidden">
                <span className="font-mono text-3xl sm:text-4xl font-bold text-brand-orange block" id="cd-h">--</span>
                <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono mt-1 block">Hours</span>
              </div>
              <div className="text-center bg-[#1c1c24] border border-white/5 rounded-lg py-4 relative overflow-hidden">
                <span className="font-mono text-3xl sm:text-4xl font-bold text-brand-orange block" id="cd-m">--</span>
                <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono mt-1 block">Minutes</span>
              </div>
              <div className="text-center bg-[#1c1c24] border border-white/5 rounded-lg py-4 relative overflow-hidden">
                <span className="font-mono text-3xl sm:text-4xl font-bold text-brand-orange block" id="cd-s">--</span>
                <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono mt-1 block">Seconds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES / SOLUTIONS SECTION ── */}
      <section className="section py-24" id="solutions">
        <div className="wrap max-w-7xl mx-auto px-6 w-full">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <div>
              <div className="tag"><span className="tag-dot"></span>Capabilities Index</div>
              <h2 className="sh">Our Tailored<br /><span className="em">Solar Services.</span></h2>
            </div>
            <p style={{ color: 'rgba(228,228,234,0.6)', fontSize: '.9rem', maxWidth: '380px', lineHeight: '1.7' }}>Our experienced engineers deploy custom end-to-end solar models designed to bypass billing hikes for high-tension systems.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-dark-surface border border-white/5 rounded-xl hover:border-brand-teal/50 transition-all duration-300">
              <div className="text-3xl mb-4">☀️</div>
              <h4 className="text-sm uppercase font-mono tracking-wider font-bold mb-2">Solar Consultation</h4>
              <p className="text-xs text-white/50 leading-relaxed">Feasibility audits, shadow assessment, TANGEDCO policy filing and accurate load-mapping.</p>
            </div>
            <div className="p-6 bg-dark-surface border border-white/5 rounded-xl hover:border-brand-teal/50 transition-all duration-300">
              <div className="text-3xl mb-4">📦</div>
              <h4 className="text-sm uppercase font-mono tracking-wider font-bold mb-2">Material Supply</h4>
              <p className="text-xs text-white/50 leading-relaxed">Direct logistics of Tier-1 PV modules, string inverters, and heavy-duty cabling arrays.</p>
            </div>
            <div className="p-6 bg-dark-surface border border-white/5 rounded-xl hover:border-brand-teal/50 transition-all duration-300">
              <div className="text-3xl mb-4">⚡</div>
              <h4 className="text-sm uppercase font-mono tracking-wider font-bold mb-2">ACDB &amp; DCDB Fabrication</h4>
              <p className="text-xs text-white/50 leading-relaxed">In-house premium build of surge protective and metallic distribution cabinet models.</p>
            </div>
            <div className="p-6 bg-dark-surface border border-white/5 rounded-xl hover:border-brand-teal/50 transition-all duration-300">
              <div className="text-3xl mb-4">🔧</div>
              <h4 className="text-sm uppercase font-mono tracking-wider font-bold mb-2">Engineering Support</h4>
              <p className="text-xs text-white/50 leading-relaxed">Robust civil mounting, mechanical anchoring, array testing, and final net-meter synchs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SYSTEMS EXPLANATION SECTION (INTEGRATION OF DIAGRAM & DOSSIERS) ── */}
      <section className="section py-20 bg-dark-surface" id="architectures">
        <div className="wrap max-w-7xl mx-auto px-6 w-full">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap', marginBottom: '52px' }}>
            <div>
              <div className="tag"><span className="tag-dot"></span>Interactive Blueprint</div>
              <h2 className="sh">Structural <br /><span className="em">Solar Architectures.</span></h2>
            </div>
            <p style={{ color: 'rgba(228,228,234,0.6)', fontSize: '.9rem', maxWidth: '380px', lineHeight: '1.7' }}>
              We merge the operational clarity of system routing diagrams with detailed technical dossiers. Select a mode below to view current flow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* System select dossiers (the expandable cards from second site) */}
            <div className="space-y-4">
              {/* On-Grid Card */}
              <div 
                className={`border p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col gap-2 select-none ${
                  activeSys === "on-grid" 
                    ? "border-brand-teal glow-teal bg-brand-teal/5" 
                    : "border-white/5 hover:border-white/20 bg-black/40"
                }`}
                onClick={() => setActiveSys("on-grid")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${activeSys === "on-grid" ? "bg-brand-teal-light" : "bg-white/15"}`} />
                    <h3 className="font-bold uppercase tracking-wider text-sm">On-Grid Integration</h3>
                  </div>
                  <span className="font-mono text-[9px] text-[#f57d31] font-bold">RECOMMENDED FOR BILL REDUCTION</span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">Runs in parallel with the local grid. Direct injection of power reduces consumer billing rates instantaneously under net-meter rules.</p>
                {activeSys === "on-grid" && (
                  <div className="mt-2 text-[10px] space-y-2 text-white/60">
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}><strong>Pros:</strong> Max ROI efficiency, zero storage replacement costs, subsidy ready.</div>
                    <div><strong>Constraints:</strong> Grid-tie inverters automatically shutdown during total local grid blackouts for linesman safety.</div>
                  </div>
                )}
              </div>

              {/* Off-Grid Card */}
              <div 
                className={`border p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col gap-2 select-none ${
                  activeSys === "off-grid" 
                    ? "border-brand-orange-light glow-orange bg-brand-orange/5" 
                    : "border-white/5 hover:border-white/20 bg-black/40"
                }`}
                onClick={() => setActiveSys("off-grid")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${activeSys === "off-grid" ? "bg-brand-orange-light" : "bg-white/15"}`} />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Off-Grid Autonomy</h3>
                  </div>
                  <span className="font-mono text-[9px] text-white/30">TOTAL INDEPENDENCE</span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">Operates completely detached from utility wires. Solar energy charges a localized deep-cycle LiFePO4 battery storage reserve.</p>
                {activeSys === "off-grid" && (
                  <div className="mt-2 text-[10px] space-y-2 text-white/60">
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}><strong>Pros:</strong> 100% immune to external load-shedding and power outages. Perfect for remote sites.</div>
                    <div><strong>Constraints:</strong> Sizing must be precise to handle peak load; battery replacement adds cycle amortizations.</div>
                  </div>
                )}
              </div>

              {/* Hybrid Card */}
              <div 
                className={`border p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col gap-2 select-none ${
                  activeSys === "hybrid" 
                    ? "border-brand-teal glow-teal bg-brand-teal/5" 
                    : "border-white/5 hover:border-white/20 bg-black/40"
                }`}
                onClick={() => setActiveSys("hybrid")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${activeSys === "hybrid" ? "bg-brand-teal-light" : "bg-white/15"}`} />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Hybrid Bidirectional</h3>
                  </div>
                  <span className="font-mono text-[9px] text--white-40">SMART FLEX-LOAD</span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">The ultimate industrial choice. Integrates automatic lithium-ion backup reserves while syncing surplus generation back to TANGEDCO wires.</p>
                {activeSys === "hybrid" && (
                  <div className="mt-2 text-[10px] space-y-2 text-white/60">
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}><strong>Pros:</strong> Peak-shaving utility; uninterrupted power during blackouts with back-feeding.</div>
                    <div><strong>Constraints:</strong> Higher initial complexity and investment requirements for inverter synchronization.</div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Interactive Diagram (SVG circuit model) */}
            <div className="w-full">
              <SystemDiagram systemType={activeSys} />
            </div>
          </div>
        </div>
      </section>

      {/* ── ROI SIMULATOR SECTION ── */}
      <section className="section py-24" id="roi-simulator">
        <div className="wrap max-w-7xl mx-auto px-6 w-full">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap', marginBottom: '52px' }}>
            <div>
              <div className="tag"><span className="tag-dot"></span>Simulation Sandbox</div>
              <h2 className="sh">Solar Investment<br /><span class="em">ROI Modeler.</span></h2>
            </div>
            <p style={{ color: 'rgba(228,228,234,0.6)', fontSize: '.9rem', maxWidth: '380px', lineHeight: '1.7' }}>
              Adjust capacity and cost coefficients in real-time to simulate investment payback curves, carbon offsets, and net-savings over a 25-year panel design lifecycle.
            </p>
          </div>

          {/* ROI Simulator block */}
          <div className="w-full">
            <RoiCalculator />
          </div>
        </div>
      </section>

      {/* ── BENTO WORKS PORTFOLIO ── */}
      <section className="section py-24 bg-dark-surface" id="portfolio">
        <div className="wrap max-w-7xl mx-auto px-6 w-full">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <div>
              <div className="tag"><span className="tag-dot"></span>Case Studies</div>
              <h2 class="sh">Bento Grid<br /><span class="em">Deployments.</span></h2>
            </div>
            
            {/* Filter buttons */}
            <div className="flex gap-2">
              {["all", "rooftop", "commercial", "industrial"].map((f) => (
                <button 
                  key={f}
                  onClick={() => setCurrFilter(f)}
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold capitalize tracking-wider transition-all ${
                    currFilter === f 
                      ? "bg-brand-teal border-brand-teal text-white" 
                      : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Works Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map((p) => (
              <div 
                key={p.id}
                className="bg-deep-black border border-white/5 rounded-xl overflow-hidden group select-none hover:border-brand-teal/40 transition-all duration-300"
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
                  <img src={p.thumb} alt={p.title} className="w-full h-full object-cover brightness-[0.75] group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 bg-deep-black/60 border border-white/15 px-3 py-1 text-[10px] font-mono tracking-wider uppercase rounded-full text-white/80">{p.location}</span>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#f57d31]">{p.category}</span>
                    <span className="font-mono text-[10px] font-bold text-brand-teal-light">{p.scale}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-brand-teal-light transition-colors">{p.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT / LEADERSHIP SECTION ── */}
      <section className="section py-24" id="about">
        <div className="wrap max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 750'%3E%3Crect width='600' height='750' fill='%23111115'/%3E%3Ccircle cx='300' cy='280' r='140' fill='%231e9d9d' opacity='0.25'/%3E%3Cellipse cx='300' cy='630' rx='220' ry='160' fill='%231e9d9d' opacity='0.25'/%3E%3Ctext x='50%25' y='52%25' dominant-baseline='middle' text-anchor='middle' fill='%238b8b9e' font-family='sans-serif' font-size='32'%3EAvneeshan S — MD%3C/text%3E%3C/svg%3E" alt="Avneeshan S — Managing Director" className="w-full h-auto" />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-deep-black border border-white/10 rounded-xl font-mono text-xs uppercase tracking-widest text-brand-teal-light glow-teal text-center min-w-[200px]">
              Avneeshan S<div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Managing Director</div>
            </div>
          </div>
          <div>
            <div className="tag"><span className="tag-dot"></span>Director's Desk</div>
            <h2 className="sh" style={{ marginBottom: '18px' }}>Vision for<br /><span class="em">Solar Synergy.</span></h2>
            <blockquote style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'rgba(228,228,234,0.85)', fontFamily: 'serif', fontStyle: 'italic', borderLeft: '2px solid #167070', paddingLeft: '18px', margin: '24px 0' }}>
              "Q Techs Solar was founded on a simple principle: Solar energy shouldn't be an experimental process. It must be an asset. We prioritize heavy-duty safety designs over cut-rate setups."
            </blockquote>
            <p style={{ color: 'rgba(228,228,234,0.6)', fontSize: '.93rem', lineHeight: '1.78' }}>
              We understand that industrial partners seek absolute financial parameters. Our engineering models remove the uncertainty of solar system longevity from the local Tamil Nadu corporate framework.
            </p>
            <div className="about-stats" style={{ display: 'flex', gap: '32px', marginTop: '28px' }}>
              <div><span style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#1e9d9d' }}>15+</span><div style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: '4px' }}>Years Operations</div></div>
              <div><span style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#1e9d9d' }}>500+</span><div style={{ fontFamily: 'var(--font-mono)', fontSize: '.62rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: '4px' }}>Projects Configured</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT COMPREHENSIVE AREA ── */}
      <section className="section py-24 bg-dark-surface" id="contact">
        <div className="wrap max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="tag"><span className="tag-dot"></span>Geospatial Liaison</div>
            <h2 className="sh" style={{ marginBottom: '18px' }}>Direct<br /><span class="em">Connectivity.</span></h2>
            <p style={{ color: 'rgba(228,228,234,0.6)', fontSize: '.93rem', lineHeight: '1.78', marginBottom: '32px' }}>Initialize contact with our engineering core to lock in the 2027 TANGEDCO solar subsidy slot allotment.</p>
            
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-deep-black border border-white/5 rounded-xl">
                <span className="text-xl">📞</span>
                <div><div className="text-[10px] text-white/30 uppercase font-mono tracking-wider">Liaison HotLine</div><strong style={{ fontSize: '.95rem', fontWeight: '500' }}><a href="tel:+919363966626">+91 93639 66626</a></strong></div>
              </div>
              <div className="flex gap-4 p-4 bg-deep-black border border-white/5 rounded-xl">
                <span className="text-xl">✉️</span>
                <div><div className="text-[10px] text-white/30 uppercase font-mono tracking-wider">Corporate Mailbox</div><strong style={{ fontSize: '.95rem', fontWeight: '500' }}><a href="mailto:q.techs.md@gmail.com">q.techs.md@gmail.com</a></strong></div>
              </div>
              <div className="flex gap-4 p-4 bg-deep-black border border-white/5 rounded-xl">
                <span className="text-xl">📍</span>
                <div><div className="text-[10px] text-white/30 uppercase font-mono tracking-wider">Engineering Base</div><strong style={{ fontSize: '.95rem', fontWeight: '500' }}>111/33E/1E, State Bank Colony, Thoothukudi - 628 002.</strong></div>
              </div>
            </div>
          </div>

          {/* Form and Map details panel */}
          <div className="space-y-6">
            <div className="bg-[#111115] border border-white/10 rounded-2xl p-6 lg:p-8 relative">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-teal to-brand-orange rounded-t-2xl" />
              <h3 className="text-lg font-bold text-white mb-2">Request Consultation</h3>
              <p className="text-xs text-white/40 mb-6">Receive highly detailed technical feedback within 2 hours of submittal.</p>
              
              <form onSubmit={handleContactForm} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="fg">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Ravi Kumar" 
                      value={formState.name}
                      onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="fg">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="e.g., 919363966626" 
                      value={formState.phone}
                      onChange={(e) => setFormState(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="fg">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">Email ID</label>
                    <input 
                      type="email" 
                      placeholder="e.g., ravi@mail.com" 
                      value={formState.email}
                      onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="fg">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Thoothukudi" 
                      value={formState.location}
                      onChange={(e) => setFormState(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="fg">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-white/40">Project Scope / Requirements</label>
                  <textarea 
                    placeholder="Specify space context, estimated load capacity (kW), or billing inquiries..." 
                    value={formState.message}
                    onChange={(e) => setFormState(prev => ({ ...prev, message: e.target.value }))}
                    required
                  />
                </div>
                
                {formState.success && (
                  <div className="p-3 bg-brand-teal/10 border border-brand-teal/30 text-brand-teal-light text-xs rounded-lg flex items-center gap-2">
                    <span>✅</span> Redirecting to WhatsApp Sync Expert...
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={formState.isSending}
                  className="w-full py-3.5 bg-brand-teal hover:bg-brand-teal-light text-white rounded-lg text-xs uppercase tracking-widest font-bold glow-teal flex items-center justify-center gap-2"
                >
                  {formState.isSending ? "Processing..." : "Launch Project Brief"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── GLOBAL FOOTER ── */}
      <footer className="footer border-t border-white/10 py-16 bg-deep-black z-10 relative">
        <div className="wrap max-w-7xl mx-auto px-6 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-brand-teal rounded-full flex items-center justify-center font-bold text-sm italic text-white animate-pulse">S</div>
              <div className="flex flex-col">
                <span className="font-bold text-xs tracking-wider text-white">Q Techs Solar</span>
                <span className="text-[8px] text-brand-orange font-mono tracking-widest uppercase">Current Into Time</span>
              </div>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">Specializing in high-power string combinatorial setups, ACDB/DCDB protection boxes, and smooth MNRE subsidy file management.</p>
          </div>
          <div>
            <h5 className="font-mono text-[9px] uppercase tracking-widest text-[#f57d31] mb-4">Navigations</h5>
            <ul className="space-y-2 text-xs text-white/50">
              <li><a href="#" className="hover:text-brand-teal-light transition-colors">Home</a></li>
              <li><a href="#solutions" className="hover:text-brand-teal-light transition-colors">Solutions Platform</a></li>
              <li><a href="#products" className="hover:text-brand-teal-light transition-colors">Hardware Catalog</a></li>
              <li><a href="#portfolio" className="hover:text-brand-teal-light transition-colors">Active Portfolio</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-mono text-[9px] uppercase tracking-widest text-[#f57d31] mb-4">Capabilities</h5>
            <ul className="space-y-2 text-xs text-white/50">
              <li><a href="#" className="hover:text-brand-teal-light transition-colors">On-Grid Integration</a></li>
              <li><a href="#" className="hover:text-brand-teal-light transition-colors">Off-Grid Microgrids</a></li>
              <li><a href="#" className="hover:text-brand-teal-light transition-colors">Hybrid Peak-Shaving</a></li>
              <li><a href="#" className="hover:text-brand-teal-light transition-colors">Dynamic ROI Engineering</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-mono text-[9px] uppercase tracking-widest text-[#f57d31] mb-4">HQ Contact</h5>
            <ul className="space-y-2 text-xs text-white/50">
              <li>Liaison: <a href="tel:+919363966626" className="text-white hover:text-brand-teal-light">+91 93639 66626</a></li>
              <li>Tech Core: <a href="mailto:q.techs.md@gmail.com" className="text-white hover:text-brand-teal-light">q.techs.md@gmail.com</a></li>
              <li>Zone: <span className="text-white/40">Thoothukudi, Tamil Nadu</span></li>
            </ul>
          </div>
        </div>
        <div className="wrap max-w-7xl mx-auto px-6 w-full mt-12 pt-8 border-t border-white/5 flex flex-wrap justify-between gap-4 text-[10px] font-mono text-white/30">
          <span>© 2026 Q TECHS SOLAR. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-teal-light">Privacy Policy</a>
            <a href="#" className="hover:text-brand-teal-light">SLA Compliance</a>
            <a href="#" className="hover:text-brand-teal-light">MNRE terms</a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp expert link */}
      <a 
        href="https://wa.me/919363966626?text=Hi%20Q%20Techs%20Solar!%20Interested%20in%20a%20solar%20audit." 
        target="_blank" 
        rel="noopener" 
        className="fixed bottom-6 right-6 z-[1200] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_6px_24px_rgba(37,211,102,0.35)] hover:scale-110 active:scale-95 transition-all glow-orange"
        onMouseEnter={() => toggleCursorHover(true)}
        onMouseLeave={() => toggleCursorHover(false)}
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
      </a>

    </div>
  );
}
