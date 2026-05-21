import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Info, Move, Wand2, Volume2, Loader2 } from 'lucide-react';

interface PressurePoint {
  x: number;
  y: number;
  intensity: number; // 0 to 1
  radius: number;
}

interface SimulationData {
  natural: PressurePoint[];
  corrected: PressurePoint[];
}

const SIMULATION_MAP: Record<string, SimulationData> = {
  'back': {
    natural: [
      { x: 50, y: 85, intensity: 0.9, radius: 25 }, // Heel strike
      { x: 35, y: 50, intensity: 0.7, radius: 20 }, // Outer edge supination
      { x: 40, y: 20, intensity: 0.4, radius: 15 },
    ],
    corrected: [
      { x: 50, y: 80, intensity: 0.5, radius: 20 },
      { x: 50, y: 50, intensity: 0.4, radius: 18 },
      { x: 50, y: 25, intensity: 0.5, radius: 18 },
    ]
  },
  'knee': {
    natural: [
      { x: 50, y: 85, intensity: 0.6, radius: 20 },
      { x: 65, y: 45, intensity: 0.9, radius: 25 }, // Medial collapse
      { x: 60, y: 20, intensity: 0.8, radius: 22 },
    ],
    corrected: [
      { x: 50, y: 80, intensity: 0.5, radius: 20 },
      { x: 50, y: 55, intensity: 0.4, radius: 20 },
      { x: 50, y: 25, intensity: 0.5, radius: 18 },
    ]
  },
  'achilles': {
    natural: [
      { x: 50, y: 90, intensity: 1.0, radius: 30 }, // Excessive heel strike
      { x: 50, y: 20, intensity: 0.3, radius: 15 },
    ],
    corrected: [
      { x: 50, y: 80, intensity: 0.4, radius: 20 },
      { x: 50, y: 50, intensity: 0.3, radius: 15 },
      { x: 50, y: 20, intensity: 0.6, radius: 20 }, // Weight shifted forward
    ]
  },
  'heel': {
    natural: [
      { x: 50, y: 85, intensity: 1.0, radius: 35, }, // Acute plantar point
    ],
    corrected: [
      { x: 50, y: 85, intensity: 0.2, radius: 40 }, // Offloaded
      { x: 50, y: 40, intensity: 0.5, radius: 25 }, // Transferred forward
    ]
  },
  'arch': {
    natural: [
      { x: 50, y: 80, intensity: 0.7, radius: 20 },
      { x: 55, y: 50, intensity: 0.9, radius: 30 }, // Middle foot collapse
      { x: 50, y: 20, intensity: 0.7, radius: 20 },
    ],
    corrected: [
      { x: 50, y: 80, intensity: 0.5, radius: 20 },
      { x: 35, y: 50, intensity: 0.1, radius: 15 }, // Arch lifted
      { x: 50, y: 20, intensity: 0.5, radius: 20 },
    ]
  },
  'neuroma': {
    natural: [
      { x: 50, y: 80, intensity: 0.4, radius: 20 },
      { x: 55, y: 25, intensity: 1.0, radius: 25 }, // Forefoot compression
    ],
    corrected: [
      { x: 50, y: 80, intensity: 0.5, radius: 20 },
      { x: 50, y: 25, intensity: 0.4, radius: 30 }, // Expanded/Spread
    ]
  }
};

export const GaitPressureSimulation: React.FC<{ conditionId: string }> = ({ conditionId }) => {
  const [isCorrected, setIsCorrected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const data = useMemo(() => SIMULATION_MAP[conditionId] || SIMULATION_MAP['heel'], [conditionId]);
  const activePoints = isCorrected ? data.corrected : data.natural;

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/gait-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conditionId, isCorrected })
      });
      const data = await response.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSpeak = async () => {
    if (isSpeaking || !analysis) return;
    setIsSpeaking(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: analysis })
      });
      const data = await response.json();
      if (data.audioData) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioData}`);
        audio.onended = () => setIsSpeaking(false);
        await audio.play();
      }
    } catch (err) {
      console.error("Speech failed:", err);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="relative w-full bg-slate-900/50 rounded-3xl border border-white/5 p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h5 className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
            <Move className="w-3 h-3 text-clinic-cyan" /> Pressure Distribution
          </h5>
          <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest">Dynamic Gait Simulation</p>
        </div>
        
        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setIsCorrected(false)}
            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${!isCorrected ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-slate-500'}`}
          >
            Natural
          </button>
          <button 
            onClick={() => setIsCorrected(true)}
            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isCorrected ? 'bg-clinic-cyan/20 text-clinic-cyan border border-clinic-cyan/30' : 'text-slate-500'}`}
          >
            Orthotic
          </button>
        </div>
      </div>

      <div className="relative aspect-[3/4] max-w-[240px] mx-auto">
        {/* Foot Outline SVG */}
        <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-2xl">
          <path 
            d="M 50 120 C 30 120 20 105 20 85 C 20 65 30 55 25 40 C 20 25 25 10 35 5 C 45 0 55 0 65 5 C 75 10 80 25 75 40 C 70 55 80 65 80 85 C 80 105 70 120 50 120 Z" 
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
          
          <defs>
            <radialGradient id="heatGradient">
              <stop offset="0%" stopColor={isCorrected ? "#00e5ff" : "#ff3d00"} stopOpacity="0.8" />
              <stop offset="50%" stopColor={isCorrected ? "#00e5ff" : "#ff3d00"} stopOpacity="0.3" />
              <stop offset="100%" stopColor={isCorrected ? "#00e5ff" : "#ff3d00"} stopOpacity="0" />
            </radialGradient>
            
            <filter id="liquid-glow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
          </defs>

          <AnimatePresence>
            {activePoints.map((p, i) => (
              <motion.circle
                key={`${isCorrected ? 'c' : 'n'}-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: p.intensity * 1.5, 
                  opacity: p.intensity,
                  cx: p.x,
                  cy: p.y,
                  r: p.radius
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 100 }}
                fill="url(#heatGradient)"
                filter="url(#liquid-glow)"
              />
            ))}
          </AnimatePresence>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4">
           <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isCorrected ? 'bg-clinic-cyan' : 'bg-red-500'}`} />
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">High Pressure Target</span>
           </div>
        </div>

        {/* Floating Metrics */}
        <div className="absolute top-1/4 -left-12 space-y-4 hidden md:block">
           <div className="space-y-1">
              <div className="text-[7px] text-slate-500 font-bold uppercase">Alignment</div>
              <div className={`text-[10px] font-black transition-colors ${isCorrected ? 'text-clinic-cyan' : 'text-red-400'}`}>
                {isCorrected ? 'NEUTRAL' : 'MISALIGNED'}
              </div>
           </div>
           <div className="space-y-1">
              <div className="text-[7px] text-slate-500 font-bold uppercase">Load Dist.</div>
              <div className={`text-[10px] font-black transition-colors ${isCorrected ? 'text-clinic-cyan' : 'text-slate-200'}`}>
                {isCorrected ? 'BALANCED' : 'UNSTABLE'}
              </div>
           </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-2xl bg-slate-950/50 border border-white/5 space-y-3">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest">
             <Info className="w-3 h-3 text-clinic-blue" /> Machine Note
           </div>
           <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-1 text-[7px] font-black text-clinic-cyan uppercase tracking-widest hover:bg-clinic-cyan/10 px-2 py-1 rounded transition-colors disabled:opacity-50"
           >
            {isAnalyzing ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Wand2 className="w-2.5 h-2.5" />}
            AI Analysis
           </button>
         </div>
         
         <AnimatePresence mode="wait">
           {analysis ? (
             <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-3"
             >
               <p className="text-[9px] text-clinic-cyan font-medium leading-relaxed italic border-l border-clinic-cyan/30 pl-3">
                 "{analysis}"
               </p>
               <div className="flex gap-2">
                 <button 
                  onClick={handleSpeak}
                  disabled={isSpeaking}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-clinic-cyan/10 text-clinic-cyan text-[8px] font-black uppercase tracking-widest hover:bg-clinic-cyan/20 transition-all ${isSpeaking ? 'animate-pulse' : ''}`}
                 >
                  <Volume2 className="w-3 h-3" /> {isSpeaking ? 'Reading...' : 'Listen to Report'}
                 </button>
                 <button 
                  onClick={() => setAnalysis(null)}
                  className="px-3 py-1.5 text-[8px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                 >
                  Hide
                 </button>
               </div>
             </motion.div>
           ) : (
             <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[9px] text-slate-400 font-medium leading-relaxed"
             >
                {isCorrected 
                ? "EZStep shell lift & density correction has normalized the center of pressure (CoP) trajectory." 
                : "Abnormal peak pressures detected. Kinetic chain vulnerability identified in " + conditionId.toUpperCase() + "."}
             </motion.p>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
};
