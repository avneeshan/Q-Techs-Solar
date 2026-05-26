import { useState, useMemo } from "react";

export default function RoiCalculator() {
  // Input parameters
  const [capacity, setCapacity] = useState<number>(10); // kW
  const [exposure, setExposure] = useState<number>(4.5); // Hours of peak sun per day
  const [tariff, setTariff] = useState<number>(8.5); // Tariff per kWh in ₹
  const [storage, setStorage] = useState<number>(10); // Battery capacity in kWh

  // Live Calculations
  const metrics = useMemo(() => {
    // 1 kW solar generates ~4 units (kWh) per exposure hour daily, adjusted for normal system loss (82% efficiency)
    const annualGen = capacity * exposure * 365 * 0.82;
    
    // Annual cash savings
    const annualSavings = annualGen * tariff;

    // Estimated Base Capital Cost (approx. ₹55,000 per kW for Tier-1 setups)
    const baseCost = capacity * 55000;
    
    // Battery storage cost (approx. ₹18,000 per kWh for high-quality LiFePO4 batteries)
    const batteryCost = storage * 18000;
    
    const grossCost = baseCost + batteryCost;

    // Subsidy rules (PM Surya Ghar: ₹18k for 1kW, ₹36k for 2kW, maximum ₹78k for 3kW and above)
    let subsidy = 0;
    if (capacity >= 3) {
      subsidy = 78000;
    } else if (capacity >= 2) {
      subsidy = 36000;
    } else if (capacity >= 1) {
      subsidy = 18000;
    }
    // High B2B projects (e.g., > 10 kW) do not receive standard residential subsidies
    if (capacity > 10) {
      subsidy = 0;
    }

    const netCost = Math.max(15000, grossCost - subsidy);
    const paybackYears = netCost / annualSavings;
    
    // Carbon abatement calculations (0.82 kg CO2 offset per kWh generated)
    const co2Abatement = (annualGen * 0.82) / 1000; // in Metric Tons

    return {
      annualGen: Math.round(annualGen),
      annualSavings: Math.round(annualSavings),
      grossCost: Math.round(grossCost),
      subsidy,
      netCost: Math.round(netCost),
      paybackYears: parseFloat(paybackYears.toFixed(1)),
      co2Abatement: parseFloat(co2Abatement.toFixed(1)),
    };
  }, [capacity, exposure, tariff, storage]);

  // Generate 25 year cumulative data points for SVG path
  const chartPath = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    const maxVal = metrics.annualSavings * 25 - metrics.netCost;
    
    for (let yr = 0; yr <= 25; yr++) {
      // Cash flow: initial cost at year 0, cumulative savings thereafter
      const val = yr === 0 ? -metrics.netCost : (metrics.annualSavings * yr) - metrics.netCost;
      const x = (yr / 25) * 320;
      
      // Map val to y-pixel coordinance (0 to 110, offset from baseline)
      // Since val can range from negative net investment to massive positive cash savings
      const minChartVal = -metrics.netCost;
      const chartRange = maxVal - minChartVal;
      const pct = (val - minChartVal) / (chartRange || 1);
      const y = 110 - (pct * 95); // 15px top margin pad
      points.push({ x, y });
    }

    return {
      line: points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" "),
      points
    };
  }, [metrics]);

  return (
    <div className="bg-[#111115]/95 rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative z-10">
      {/* Structural Header */}
      <div className="h-10 border-b border-white/10 px-4 bg-white/5 flex items-center justify-between text-[10px] font-mono tracking-widest text-[#1e9d9d] font-bold">
        <span>⚙️ SYSTEM COST &amp; FINANCING MODELER</span>
        <span className="text-white/40">v4.1.2_SOLVE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 p-5 gap-6">
        {/* Left Side: Parameters sliders */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-brand-teal-light">Tuning Parameters</h4>
          
          {/* Capacity Slider */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="font-mono text-white/50 uppercase">1. System Capacity</span>
              <span className="font-bold text-brand-teal-light font-mono">{capacity} kW-peak</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full accent-brand-teal h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-white/30 font-mono mt-0.5">
              <span>Residential (3kW)</span>
              <span>Commercial (50kW)</span>
            </div>
          </div>

          {/* Exposure Slider */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="font-mono text-white/50 uppercase">2. Peak Solar Exposure</span>
              <span className="font-bold text-brand-teal-light font-mono">{exposure} Hours/Day</span>
            </div>
            <input 
              type="range" 
              min="3" 
              max="6.5" 
              step="0.1"
              value={exposure}
              onChange={(e) => setExposure(Number(e.target.value))}
              className="w-full accent-brand-teal h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-white/30 font-mono mt-0.5">
              <span>Shaded (3.0h)</span>
              <span>Pure Sun (6.5h)</span>
            </div>
          </div>

          {/* Electricity Tariff Slider */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="font-mono text-white/50 uppercase">3. Electricity Cost rate</span>
              <span className="font-bold text-brand-orange-light font-mono">₹{tariff} / kWh</span>
            </div>
            <input 
              type="range" 
              min="4" 
              max="14" 
              step="0.5"
              value={tariff}
              onChange={(e) => setTariff(Number(e.target.value))}
              className="w-full accent-brand-orange h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-white/30 font-mono mt-0.5">
              <span>Base (₹4.0)</span>
              <span>Industrial Peak (₹14.0)</span>
            </div>
          </div>

          {/* Battery Reserves */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="font-mono text-white/50 uppercase">4. Integrated Storage reserves</span>
              <span className="font-bold text-brand-teal-light font-mono">{storage} kWh (LiFePO4)</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="40" 
              value={storage}
              onChange={(e) => setStorage(Number(e.target.value))}
              className="w-full accent-brand-teal h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-white/30 font-mono mt-0.5">
              <span>Direct Grid (0kWh)</span>
              <span>Full Autonomy (40kWh)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Projected Metrics Readouts & Live Chart */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#f57d31]">Economic Telemetry</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#070708] border border-white/5 rounded-lg">
              <span className="text-[10px] uppercase font-mono text-white/40 block mb-0.5">Net CAPEX investment</span>
              <span className="text-lg font-mono text-white font-bold">₹{metrics.netCost.toLocaleString("en-IN")}</span>
              <span className="text-[9px] text-[#25d366] block font-mono mt-1">
                {metrics.subsidy > 0 ? `Subsidized (-₹${metrics.subsidy/1000}k)` : "Commercial Rate"}
              </span>
            </div>

            <div className="p-3 bg-[#070708] border border-white/5 rounded-lg">
              <span className="text-[10px] uppercase font-mono text-white/40 block mb-0.5">Estimated Payback Period</span>
              <span className="text-lg font-mono text-brand-orange-light font-bold">
                {metrics.paybackYears <= 0 ? "Infinite" : `${metrics.paybackYears} Years`}
              </span>
              <span className="text-[9px] text-white/30 block font-mono mt-1">
                Annual Gen: {metrics.annualGen} KWh
              </span>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="bg-[#070708] border border-white/5 rounded-lg p-3">
            <div className="flex justify-between text-[9px] font-mono text-white/40 mb-2">
              <span>CUMULATIVE RETURN (25 YEARS)</span>
              <span className="text-[#25d366] font-bold">Net Return: +₹{((metrics.annualSavings * 25) - metrics.netCost).toLocaleString("en-IN")}</span>
            </div>
            
            <div className="relative w-full h-[120px] bg-black/40 rounded flex items-end">
              <svg className="w-full h-full text-brand-teal-light" viewBox="0 0 320 120" preserveAspectRatio="none">
                {/* Zero line reference */}
                <line 
                  x1="0" 
                  y1={110 - (metrics.netCost / (metrics.annualSavings * 25 + metrics.netCost) * 95)} 
                  x2="320" 
                  y2={110 - (metrics.netCost / (metrics.annualSavings * 25 + metrics.netCost) * 95)} 
                  stroke="rgba(255,255,255,0.06)" 
                  strokeWidth="1" 
                  strokeDasharray="4 4" 
                />

                {/* Draw Return Curve Path */}
                <path d={chartPath.line} fill="none" stroke="currentColor" strokeWidth="2" className="drop-shadow-[0_0_8px_rgba(30,157,157,0.3)]" />
                
                {/* Highlight Point of Break-Even */}
                {(() => {
                  const paybackIndex = Math.min(25, Math.ceil(metrics.paybackYears));
                  const pt = chartPath.points[paybackIndex];
                  if (pt) {
                    return (
                      <g>
                        <circle cx={pt.x} cy={pt.y} r="4" fill="#f57d31" className="animate-pulse" />
                        <line x1={pt.x} y1="0" x2={pt.x} y2="120" stroke="rgba(245,125,49,0.3)" strokeWidth="0.5" strokeDasharray="2 2" />
                      </g>
                    );
                  }
                  return null;
                })()}
              </svg>
              <div className="absolute top-2 left-2 text-[8px] font-mono text-white/30">CAPEX Loss Threshold</div>
            </div>
            <div className="flex justify-between text-[8px] text-white/30 font-mono mt-1">
              <span>Y0</span>
              <span>Y12.5 (Mid Life)</span>
              <span>Y25 (End Design)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Environmental Abatement Telemetry */}
      <div className="bg-[#2563eb]/5 border-t border-white/5 p-4 flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
        <span className="text-white/50 uppercase font-mono">📈 Environmental Abatement Ratio:</span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>CO₂ Offset: <span className="text-brand-teal-light font-bold">{metrics.co2Abatement} Tons / Year</span></div>
          <div>Equiv. Trees: <span className="text-[#25d366] font-bold">{Math.round(metrics.co2Abatement * 45)} Planted</span></div>
        </div>
      </div>
    </div>
  );
}
