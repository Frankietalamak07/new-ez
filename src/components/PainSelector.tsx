import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info } from 'lucide-react';

const PAIN_POINTS = [
  { 
    id: 'back', 
    name: 'Lower Back', 
    desc: 'Posture & spinal alignment', 
    clinicalInfo: 'Uneven weight distribution at the feet creates pelvic tilt. Leveling your base is the first step to permanent lumbar relief.',
    icon: '🫀', 
    pos: 'top-4 left-1/2 -translate-x-1/2' 
  },
  { 
    id: 'knee', 
    name: 'Knee Pain', 
    desc: 'Alignment & strain', 
    clinicalInfo: 'Torsional strain in the knee is often foot-driven. Correcting pronation eliminates the force causing patellar tracking pain.',
    icon: '🦵', 
    pos: 'top-1/4 left-1/2 -translate-x-1/2' 
  },
  { 
    id: 'achilles', 
    name: 'Achilles', 
    desc: 'Tendonitis & strain', 
    clinicalInfo: 'Tension in the Achilles tendon often results from over-pronation. Our orthotics provide measured heel lift and stabilization to reduce kinetic strain.',
    icon: '⚡', 
    pos: 'bottom-16 left-1/2 -translate-x-1/2' 
  },
  { 
    id: 'heel', 
    name: 'Heel Pain', 
    desc: 'Plantar fasciitis & heel spurs', 
    clinicalInfo: 'Inflammation of the plantar fascia causes sharp stabs. Our precision casting creates a "neutral zone" for the heel to heal.',
    icon: '🦶', 
    pos: 'bottom-8 left-1/2 -translate-x-1/2' 
  },
  { 
    id: 'arch', 
    name: 'Arch Pain', 
    desc: 'Flat feet & high arches', 
    clinicalInfo: 'Collapsing arches lead to total kinetic chain failure. We reinforce the medial longitudinal arch with medical-grade EVA.',
    icon: '🦴', 
    pos: 'top-1/2 left-1/2 -translate-x-1/2' 
  },
  { 
    id: 'neuroma', 
    name: 'Morton\'s Neuroma', 
    desc: 'Forefoot nerve pain', 
    clinicalInfo: 'Nerve compression between metatarsals causing burning. A built-in metatarsal pad sways the bones apart to relieve pressure instantly.',
    icon: '🔥', 
    pos: 'bottom-4 left-1/2 -translate-x-1/2 translate-y-2' 
  },
  { 
    id: 'bunions', 
    name: 'Bunions', 
    desc: 'Joint misalignment', 
    clinicalInfo: 'Hallux Valgus is exacerbated by poor foot mechanics. We redistribute pressure away from the first metatarsal joint to arrest progression.',
    icon: '👞', 
    pos: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-4' 
  },
];

export const PainSelector: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [aiVerdict, setAiVerdict] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (selected) {
      const point = PAIN_POINTS.find(p => p.id === selected);
      if (point) {
        generateAiVerdict(point);
      }
    } else {
      setAiVerdict(null);
    }
  }, [selected]);

  const generateAiVerdict = async (point: any) => {
    setIsLoadingAi(true);
    setAiVerdict(null);
    try {
      const response = await fetch("/api/ai-verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          painPoint: point.id,
          conditionName: point.name,
          description: point.desc,
        }),
      });
      const data = await response.json();
      setAiVerdict(data.verdict);
    } catch (error) {
      console.error("Error fetching AI verdict:", error);
      setAiVerdict(point.clinicalInfo); // Fallback to static info
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 20, y: y * -20 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(null);
  };

  return (
    <div ref={containerRef} className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center scroll-mt-32">
      <div className="space-y-3 md:space-y-4 order-2 md:order-1">
        {PAIN_POINTS.map((point) => (
          <motion.div
            key={point.id}
            whileHover={{ scale: 1.01, x: 5 }}
            whileTap={{ scale: 0.99 }}
            onMouseEnter={() => setHovered(point.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setSelected(selected === point.id ? null : point.id)}
            className={`group relative p-6 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
              selected === point.id 
                ? 'bg-clinic-blue/10 border-clinic-blue ring-1 ring-clinic-blue shadow-lg' 
                : 'bg-white/5 border-white/10 hover:border-clinic-blue/30 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4 relative z-10">
              <span className="text-2xl transition-all duration-500 group-hover:scale-110">{point.icon}</span>
              <div className="flex-1">
                <h4 className={`font-display text-sm font-black uppercase tracking-widest transition-colors ${selected === point.id ? 'text-clinic-cyan' : 'text-white'}`}>
                  {point.name}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5 font-bold uppercase tracking-widest leading-none">{point.desc}</p>
              </div>
              
              <AnimatePresence>
                {selected === point.id && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -45 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-clinic-blue" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clinical Tooltip */}
            <AnimatePresence>
              {hovered === point.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute -top-20 left-1/2 -translate-x-1/2 w-[280px] z-50 pointer-events-none"
                >
                  <div className="bg-clinic-navy/95 text-white p-4 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/20 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-clinic-cyan" />
                    <div className="flex items-start gap-3">
                       <div className="w-8 h-8 rounded-lg bg-clinic-blue/20 flex items-center justify-center shrink-0 border border-clinic-blue/30">
                          <span className="text-lg">{point.icon}</span>
                       </div>
                       <div>
                          <div className="text-[9px] uppercase font-black tracking-widest text-clinic-cyan mb-1">{point.name} Clinical Profile</div>
                          <div className="text-[11px] leading-relaxed text-slate-200 font-medium">{point.clinicalInfo}</div>
                       </div>
                    </div>
                    {/* Arrow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-clinic-navy/95 rotate-45 border-r border-b border-white/20" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        
        <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-start relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-1 opacity-10">
             <Info className="w-12 h-12 text-white" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-serif italic relative z-10">
            "Clinical intervention begins with accurate mapping. Our diagnostic suite identifies misalignments in the kinetic chain, allowing for targeted correction that stabilizes the entire musculoskeletal structure."
          </p>
        </div>
      </div>

      <div 
        className="relative aspect-[3/4] bg-slate-900 rounded-[32px] md:rounded-[40px] border border-white/10 overflow-hidden shadow-2xl group perspective-[1000px] touch-none order-1 md:order-2"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (touch.clientX - rect.left) / rect.width - 0.5;
          const y = (touch.clientY - rect.top) / rect.height - 0.5;
          setTilt({ x: x * 20, y: y * -20 });
        }}
        onTouchEnd={handleMouseLeave}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,98,255,0.1),transparent_70%)]" />
        
        {/* Simple Anatomical Body Representation */}
        <motion.div 
          style={{ 
            rotateX: tilt.x, 
            rotateY: tilt.y,
            transformStyle: "preserve-3d"
          }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-12"
        >
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-white/10 shadow-inner" style={{ transform: "translateZ(50px)" }} />
          <div className="w-24 h-48 bg-slate-800 rounded-3xl mt-4 border border-white/10 relative shadow-inner" style={{ transform: "translateZ(30px)" }}>
             {/* Back highlight */}
             <AnimatePresence>
              {(selected === 'back' || hovered === 'back') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: selected === 'back' ? 1 : 0.6,
                    scale: selected === 'back' ? 1 : 0.9
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`absolute top-8 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full blur-xl ${
                    selected === 'back' ? 'bg-clinic-cyan/30 animate-pulse' : 'bg-clinic-blue/20'
                  }`}
                />
              )}
             </AnimatePresence>
          </div>
          <div className="flex gap-4 -mt-4" style={{ transform: "translateZ(40px)" }}>
            <div className="w-6 h-40 bg-slate-800 rounded-full border border-white/10 relative shadow-inner">
               <AnimatePresence>
                {(selected === 'knee' || hovered === 'knee') && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ 
                      opacity: selected === 'knee' ? 1 : 0.6,
                      scale: selected === 'knee' ? 1 : 0.9 
                    }} 
                    exit={{ opacity: 0, scale: 0.8 }} 
                    className={`absolute top-8 left-0 w-full h-8 blur-lg ${
                      selected === 'knee' ? 'bg-clinic-cyan/30 animate-pulse' : 'bg-clinic-blue/20'
                    }`} 
                  />
                )}
               </AnimatePresence>
            </div>
            <div className="w-6 h-40 bg-slate-800 rounded-full border border-white/10 relative shadow-inner">
               <AnimatePresence>
                {(selected === 'knee' || hovered === 'knee') && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ 
                      opacity: selected === 'knee' ? 1 : 0.6,
                      scale: selected === 'knee' ? 1 : 0.9 
                    }} 
                    exit={{ opacity: 0, scale: 0.8 }} 
                    className={`absolute top-8 left-0 w-full h-8 blur-lg ${
                      selected === 'knee' ? 'bg-clinic-cyan/30 animate-pulse' : 'bg-clinic-blue/20'
                    }`} 
                  />
                )}
               </AnimatePresence>
            </div>
          </div>
          <div className="flex gap-12 mt-4" style={{ transform: "translateZ(60px)" }}>
            <div className="w-12 h-8 bg-slate-800 rounded-lg border border-white/10 relative">
               <AnimatePresence>
                {['heel', 'arch', 'achilles', 'neuroma', 'bunions'].includes(selected || hovered || '') && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ 
                      opacity: ['heel', 'arch', 'achilles', 'neuroma', 'bunions'].includes(selected || '') ? 1 : 0.6,
                      scale: ['heel', 'arch', 'achilles', 'neuroma', 'bunions'].includes(selected || '') ? 1 : 0.9 
                    }} 
                    exit={{ opacity: 0, scale: 0.8 }} 
                    className={`absolute inset-0 blur-md ${
                      ['heel', 'arch', 'achilles', 'neuroma', 'bunions'].includes(selected || '') ? 'bg-clinic-cyan/40 animate-pulse' : 'bg-clinic-blue/20'
                    }`} 
                  />
                )}
               </AnimatePresence>
            </div>
            <div className="w-12 h-8 bg-slate-800 rounded-lg border border-white/10 relative">
               <AnimatePresence>
                {['heel', 'arch', 'achilles', 'neuroma', 'bunions'].includes(selected || hovered || '') && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ 
                      opacity: ['heel', 'arch', 'achilles', 'neuroma', 'bunions'].includes(selected || '') ? 1 : 0.6,
                      scale: ['heel', 'arch', 'achilles', 'neuroma', 'bunions'].includes(selected || '') ? 1 : 0.9 
                    }} 
                    exit={{ opacity: 0, scale: 0.8 }} 
                    className={`absolute inset-0 blur-md ${
                      ['heel', 'arch', 'achilles', 'neuroma', 'bunions'].includes(selected || '') ? 'bg-clinic-cyan/40 animate-pulse' : 'bg-clinic-blue/20'
                    }`} 
                  />
                )}
               </AnimatePresence>
            </div>
          </div>
        </motion.div>
        
        {/* Interactive Hotspots */}
        <div className="absolute inset-0 pointer-events-auto">
          {PAIN_POINTS.map((point) => (
            <motion.div
              key={`hotspot-${point.id}`}
              className={`absolute ${point.pos} z-50 cursor-pointer group/hotspot h-8 w-8 flex items-center justify-center`}
              onMouseEnter={() => setHovered(point.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(selected === point.id ? null : point.id)}
            >
              <div className={`w-3 h-3 rounded-full ${selected === point.id ? 'bg-clinic-cyan' : 'bg-clinic-blue'} shadow-[0_0_15px_rgba(0,98,255,0.8)] border-2 border-white transition-all duration-300 group-hover/hotspot:scale-150`} />
              <div className={`absolute inset-0 w-8 h-8 rounded-full animate-pulse opacity-20 ${selected === point.id ? 'bg-clinic-cyan' : 'bg-clinic-blue'}`} />
              
              <AnimatePresence>
                {hovered === point.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: -20 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 pointer-events-none"
                  >
                    <div className="bg-clinic-navy/90 backdrop-blur-xl border border-white/20 p-3 rounded-xl shadow-2xl text-center relative">
                       <div className="text-[10px] uppercase font-black tracking-widest text-clinic-cyan mb-0.5">{point.name}</div>
                       <div className="text-[9px] text-slate-300 leading-tight border-t border-white/5 pt-1 mt-1">{point.desc}</div>
                       <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-clinic-navy/90 rotate-45" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Scan lines effect - Subtle */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
      </div>

      {/* Clinical Modal Overlay */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-clinic-navy/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-clinic-navy border border-white/10 rounded-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-clinic-cyan" />
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-clinic-blue/20 flex items-center justify-center border border-clinic-blue/30">
                      <span className="text-3xl">{PAIN_POINTS.find(p => p.id === selected)?.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">
                        {PAIN_POINTS.find(p => p.id === selected)?.name}
                      </h3>
                      <div className="text-[10px] text-clinic-cyan font-bold uppercase tracking-widest mt-0.5">
                        Clinical Analysis Active
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelected(null)}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Clinical AI Analysis</div>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <div className={`transition-all duration-500 ${isLoadingAi ? 'opacity-50 blur-[2px]' : 'opacity-100'}`}>
                      <p className="text-slate-200 text-sm md:text-base leading-relaxed font-serif italic">
                        {aiVerdict || PAIN_POINTS.find(p => p.id === selected)?.clinicalInfo}
                      </p>
                    </div>
                    {isLoadingAi && (
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex gap-1">
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 rounded-full bg-clinic-cyan" />
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-clinic-cyan" />
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-clinic-cyan" />
                        </div>
                        <span className="text-[10px] font-bold text-clinic-cyan/60 uppercase tracking-widest animate-pulse">Scanning Bio-Data...</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-[8px] font-black text-clinic-cyan uppercase tracking-widest mb-1">Impact Level</div>
                      <div className="text-lg font-bold text-white uppercase tracking-tighter">High Severity</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-[8px] font-black text-clinic-cyan uppercase tracking-widest mb-1">Recommended Device</div>
                      <div className="text-lg font-bold text-white uppercase tracking-tighter">EZACTIVE PRO</div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <button 
                    onClick={() => setSelected(null)}
                    className="w-full py-4 bg-clinic-blue hover:bg-clinic-cyan text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl hover:shadow-clinic-cyan/20 active:scale-[0.98]"
                  >
                    Close Analysis
                  </button>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 flex items-center justify-center border-t border-white/5">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-clinic-cyan animate-pulse" />
                   <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Biometric Precision Assured</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
