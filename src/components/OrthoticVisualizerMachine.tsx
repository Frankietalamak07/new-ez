import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dna, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Database, 
  Fingerprint,
  ChevronRight,
  Info,
  Scan,
  RefreshCw,
  Search,
  Box,
  ClipboardList
} from 'lucide-react';
import { GaitPressureSimulation } from './GaitPressureSimulation';
import { DynamicForm, FormConfig } from './DynamicForm';

interface DiagnosticResult {
  condition: string;
  verdict: string;
  specifications: {
    arch: string;
    heel: string;
    materials: string[];
    densityCorrection: string;
  };
  recommendedProduct: string;
}

const CONSULTATION_CONFIG: FormConfig = {
  sections: [
    {
      id: 'lifestyle',
      title: 'Lifestyle Assessment',
      fields: [
        {
          id: 'activity_level',
          label: 'Daily Activity Level',
          type: 'select',
          required: true,
          options: [
            { value: 'sedentary', label: 'Sedentary (Office/Home)' },
            { value: 'moderate', label: 'Moderate (Active/Walking)' },
            { value: 'athlete', label: 'Vigorous (Sports/Running)' },
          ],
          placeholder: 'Select your activity level'
        },
        {
          id: 'footwear',
          label: 'Primary Footwear Type',
          type: 'radio',
          required: true,
          options: [
            { value: 'sneakers', label: 'Athletic/Sneakers' },
            { value: 'dress', label: 'Formal/Dress Shoes' },
            { value: 'boots', label: 'Work Boots' },
            { value: 'flats', label: 'Casual/Flats' },
          ]
        }
      ]
    },
    {
      id: 'pain_analysis',
      title: 'Pain Manifestation',
      fields: [
        {
          id: 'pain_description',
          label: 'Specific Pain Problem',
          type: 'textarea',
          required: true,
          placeholder: [
            'EN: Describe your exact pain (e.g., sharp heel pain when waking up)',
            'TL: Ilarawan ang iyong sakit (halimbawa: matalim na sakit sa sakong pagkagising)',
            'BY: Ihulagway ang imong kasakit (pananglitan: hait nga sakit sa tikod inigmata)'
          ]
        }
      ]
    },
    {
      id: 'biometric',
      title: 'Physical Parameters',
      fields: [
        {
          id: 'weight_kg',
          label: 'Estimated Weight (kg)',
          type: 'number',
          placeholder: 'e.g. 75',
          required: true
        },
        {
          id: 'pain_intensity',
          label: 'Pain Intensity (1-10)',
          type: 'radio',
          required: true,
          options: [
            { value: 'low', label: '1-3' },
            { value: 'moderate', label: '4-6' },
            { value: 'high', label: '7-10' },
          ]
        }
      ]
    }
  ]
};

const FOOTWEAR_MODIFIERS: Record<string, { materials: string[], density: string, additionalSpec?: string }> = {
  'sneakers': {
    materials: ['Max-Rebound EVA', 'Poron XRD'],
    density: '+25% Shock Absorption',
    additionalSpec: 'Dynamic Arch Flex'
  },
  'dress': {
    materials: ['Ultra-Slim Carbon Fiber', 'Leather Top-Cover'],
    density: 'High-Tensile Minimal Profile',
    additionalSpec: 'Narrow-Medial Cut'
  },
  'boots': {
    materials: ['Heavy-Duty Reinforced Polymer', 'Anti-Static Foam'],
    density: '+40% Load Bearing',
    additionalSpec: 'Wide-Base Stability'
  },
  'flats': {
    materials: ['Memory-Fit Lite', 'Breathable Mesh'],
    density: 'Medium-Soft Calibrated',
    additionalSpec: 'Multi-Surface Grip'
  }
};

const CLINICAL_LOGIC: Record<string, DiagnosticResult> = {
  'back': {
    condition: 'Lower Back / Spinal Alignment',
    verdict: 'Pelvic tilt detected. Misalignment originating from unstable foot strike causing unilateral lumbar strain.',
    specifications: {
      arch: 'Neutralizing Medial Longitudinal Support',
      heel: 'Gait-Stabilizing Lateral Posting',
      materials: ['High-Rebound EVA', 'Carbon-Flex Core'],
      densityCorrection: '+15% Medial Stiffening'
    },
    recommendedProduct: 'COMFORT PRO'
  },
  'knee': {
    condition: 'Genu Valgum / Knee Strain',
    verdict: 'Excessive internal tibial rotation. Tibial alignment requires dynamic pronation control.',
    specifications: {
      arch: 'Anti-Pronation Wedging',
      heel: 'Neutral Alignment Cup',
      materials: ['Poron XRD cushioning', 'Rigid Shell'],
      densityCorrection: 'Dual-Density Gradient'
    },
    recommendedProduct: 'ORTHO RELIEF'
  },
  'achilles': {
    condition: 'Achilles Tendonitis',
    verdict: 'Over-stretching of the tendon during heel-off phase. Requires controlled elevation.',
    specifications: {
      arch: 'Soft Transition Foam',
      heel: '8mm Therapeutic Heel Lift',
      materials: ['Impact-Shield Foam', 'Soft-Touch Microfiber'],
      densityCorrection: '+20% Heel Damping'
    },
    recommendedProduct: 'EZACTIVE SPORT'
  },
  'heel': {
    condition: 'Plantar Fasciitis',
    verdict: 'Tensile stress at the calcaneal attachment. Acute inflammation site requires offloading.',
    specifications: {
      arch: 'Full Bio-Contoured Support',
      heel: 'Deep Anatomical Well + Poron Insert',
      materials: ['Medical-Grade EVA', 'RecoilGel'],
      densityCorrection: 'Multi-Zonal Firmness'
    },
    recommendedProduct: 'ORTHO RELIEF'
  },
  'arch': {
    condition: 'Pes Planus (Flat Feet)',
    verdict: 'Total collapse of the medial arch structure. Kinetic chain failure starting at mid-foot.',
    specifications: {
      arch: 'Structural Medial Longitudinal Reinforcement',
      heel: 'Rearfoot Stability Control',
      materials: ['Kevlar-Reinforced Polymers', 'Memory-Fit Foam'],
      densityCorrection: 'High-Tensile Rigidity'
    },
    recommendedProduct: 'ORTHO RELIEF'
  },
  'neuroma': {
    condition: 'Morton\'s Neuroma',
    verdict: 'Intermetatarsal nerve compression (3rd/4th space). Digital nerve entrapment.',
    specifications: {
      arch: 'Transverse Arch Expansion',
      heel: 'Neutral Base',
      materials: ['Teardrop Met-Pad', 'Breathable Mesh Cover'],
      densityCorrection: 'Adaptive Compression'
    },
    recommendedProduct: 'COMFORT PRO'
  }
};

export const OrthoticVisualizerMachine: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentResult, setCurrentResult] = useState<DiagnosticResult | null>(null);
  const [machineState, setMachineState] = useState<'idle' | 'consulting' | 'scanning' | 'complete'>('idle');
  const [consultationData, setConsultationData] = useState<Record<string, any>>({});

  const selectCondition = (id: string) => {
    setSelectedId(id);
    setMachineState('consulting');
  };

  const handleConsultationSubmit = (data: Record<string, any>) => {
    setIsSubmitting(true);
    setConsultationData(data);
    
    // Brief delay to show button loading state before full screen transition
    setTimeout(() => {
      setIsSubmitting(false);
      setIsAnalyzing(true);
      setMachineState('scanning');
      
      // Simulate AI data crunching with footwear influence
      setTimeout(() => {
        const baseResult = CLINICAL_LOGIC[selectedId!];
        const modifier = FOOTWEAR_MODIFIERS[data.footwear] || FOOTWEAR_MODIFIERS['sneakers'];
        
        const refinedResult: DiagnosticResult = {
          ...baseResult,
          specifications: {
            ...baseResult.specifications,
            materials: [...modifier.materials, ...baseResult.specifications.materials.slice(1)],
            densityCorrection: modifier.density
          }
        };

        setCurrentResult(refinedResult);
        setIsAnalyzing(false);
        setMachineState('complete');
      }, 2800);
    }, 800);
  };

  const resetMachine = () => {
    setSelectedId(null);
    setCurrentResult(null);
    setMachineState('idle');
    setConsultationData({});
  };

  return (
    <div className="w-full max-w-6xl mx-auto rounded-[3rem] bg-slate-950 border border-white/10 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)] relative group">
      {/* Machine Header */}
      <div className="bg-clinic-navy/50 backdrop-blur-xl border-b border-white/10 px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-clinic-blue/20 border border-clinic-blue/30 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-clinic-cyan animate-pulse" />
          </div>
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest leading-none">VIRTUAL ORTHOTIC SPECIALIST</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-clinic-cyan animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logic Engine v4.2 · Online</span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Diagnostic Sync</span>
            <span className="text-white font-bold text-[10px] uppercase">Spain VOXELCARE Cloud</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-end">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">System Load</span>
             <span className="text-clinic-cyan font-bold text-[10px] uppercase">Optimal</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[600px]">
        {/* Left: Input Console */}
        <div className="lg:w-1/2 p-4 md:p-10 border-r border-white/10 space-y-8 bg-slate-950/20">
          <div className="space-y-2">
            <div className="text-[10px] font-black text-clinic-cyan uppercase tracking-[0.3em] flex items-center gap-2">
              <Scan className="w-3 h-3" /> Step 01: Condition Selection
            </div>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              Identify your primary pain zone to trigger the biomechanical analysis engine.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 pb-12">
            {Object.keys(CLINICAL_LOGIC).map((id) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={machineState !== 'idle'}
                onClick={() => selectCondition(id)}
                className={`p-5 rounded-2xl border transition-all flex flex-col gap-3 text-left group/btn ${
                  selectedId === id 
                    ? 'bg-clinic-blue/20 border-clinic-blue' 
                    : 'bg-white/5 border-white/5 hover:border-clinic-blue/30'
                } ${machineState !== 'idle' && selectedId !== id ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}
              >
                <div className="flex justify-between items-start">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${selectedId === id ? 'bg-clinic-blue text-white' : 'bg-slate-800 text-slate-400 group-hover/btn:bg-clinic-blue group-hover/btn:text-white'}`}>
                    <Activity className="w-4 h-4" />
                  </div>
                  {selectedId === id && <div className="w-1.5 h-1.5 rounded-full bg-clinic-cyan animate-ping" />}
                </div>
                <div className="space-y-1">
                  <span className={`text-[11px] font-black uppercase tracking-widest ${selectedId === id ? 'text-white' : 'text-slate-400'}`}>
                    {CLINICAL_LOGIC[id].condition.split('/')[0]}
                  </span>
                  <div className="h-0.5 w-1/4 bg-clinic-blue transition-all group-hover/btn:w-1/2" />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Machine Decoration - Optimized performance */}
          <div className="absolute bottom-10 left-10 hidden lg:block opacity-20 group-hover:opacity-40 transition-opacity">
            <div className="flex gap-1.5 h-24 items-end">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i}
                  className="w-1.5 bg-clinic-blue rounded-full animate-bar-pulse" 
                  style={{ animationDelay: `${i * 0.15}s`, height: '40%' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Output/Result Screen */}
        <div className="lg:w-1/2 relative bg-[radial-gradient(circle_at_bottom_right,rgba(0,98,255,0.05),transparent_50%)] overflow-hidden">
          <AnimatePresence mode="wait">
            {machineState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6"
              >
                <div className="w-32 h-32 rounded-full border border-white/5 flex items-center justify-center relative">
                   <div className="absolute inset-0 border border-clinic-blue/20 rounded-full animate-[ping_3s_linear_infinite]" />
                   <Fingerprint className="w-12 h-12 text-slate-700" />
                </div>
                <div className="space-y-2">
                  <p className="text-white font-black uppercase tracking-widest text-xs">Awaiting Biometric Trigger</p>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] max-w-[200px] mx-auto">Select a condition console on the left to begin analysis.</p>
                </div>
              </motion.div>
            )}

            {machineState === 'consulting' && (
              <motion.div
                key="consulting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="h-full p-8 md:p-12 overflow-y-auto custom-scrollbar"
              >
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-clinic-cyan" />
                        <span className="text-clinic-cyan font-black text-[10px] uppercase tracking-[0.3em]">Step 02: Clinical Consultation</span>
                      </div>
                      <h4 className="text-white font-display text-2xl font-black uppercase tracking-tight">Patient Lifestyle Sync</h4>
                    </div>
                    <button 
                      onClick={resetMachine}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-clinic-blue/5 border border-clinic-blue/10 p-6 rounded-3xl mb-8">
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">
                      Completing this profile allows the Logic Engine to calibrate your <span className="text-white">{CLINICAL_LOGIC[selectedId!].condition}</span> diagnosis with your specific daily demands.
                    </p>
                  </div>

                  <DynamicForm 
                    config={CONSULTATION_CONFIG}
                    onSubmit={handleConsultationSubmit}
                    submitLabel="Initialize Bio-Scan"
                    isLoading={isSubmitting}
                  />
                </div>
              </motion.div>
            )}

            {machineState === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="h-full flex flex-col items-center justify-center p-12 space-y-12"
              >
                <div className="w-full max-w-xs space-y-8">
                  <div className="relative">
                    {/* Visual Scan Area */}
                    <div className="h-48 rounded-3xl bg-clinic-blue/5 border border-clinic-blue/10 flex items-center justify-center overflow-hidden relative">
                       <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-clinic-cyan shadow-[0_0_20px_#00e5ff] z-10" 
                       />
                       <Search className="w-16 h-16 text-clinic-blue/20 animate-pulse" />
                       <div className="absolute inset-0 grid grid-cols-10 grid-rows-6 opacity-10">
                          {[...Array(60)].map((_, i) => <div key={i} className="border-[0.5px] border-white/50" />)}
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-clinic-cyan font-black text-[9px] uppercase tracking-widest">Biomechanical Analysis</span>
                      <span className="text-white font-mono text-xs">82% COMPLETE</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.8, ease: "easeInOut" }}
                        className="h-full bg-clinic-blue"
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                       <div className="text-[8px] text-slate-500 font-bold uppercase animate-pulse">Checking Voxel Map...</div>
                       <div className="text-[8px] text-slate-500 font-bold uppercase animate-pulse text-right">Mapping Arch Flex...</div>
                       <div className="text-[8px] text-slate-500 font-bold uppercase animate-pulse">Calculating Density...</div>
                       <div className="text-[8px] text-slate-500 font-bold uppercase animate-pulse text-right">Matching Profiles...</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {machineState === 'complete' && currentResult && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full p-8 md:p-12 space-y-8"
              >
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-clinic-cyan" />
                        <span className="text-clinic-cyan font-black text-[10px] uppercase tracking-[0.3em]">Specialist Verdict</span>
                      </div>
                      <h4 className="text-white font-display text-2xl font-black uppercase tracking-tight">{currentResult.condition}</h4>
                   </div>
                   <button 
                    onClick={resetMachine}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-colors"
                   >
                     <RefreshCw className="w-4 h-4" />
                   </button>
                </div>

                <div className="bg-clinic-blue/10 border border-clinic-blue/20 p-6 rounded-3xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-10"><Database className="w-12 h-12 text-white" /></div>
                   <div className="flex gap-4 mb-4">
                     <div className="px-3 py-1 rounded-full bg-clinic-cyan/10 border border-clinic-cyan/20 text-clinic-cyan text-[8px] font-black uppercase tracking-widest">
                       Activity: {consultationData.activity_level}
                     </div>
                     <div className="px-3 py-1 rounded-full bg-clinic-cyan/10 border border-clinic-cyan/20 text-clinic-cyan text-[8px] font-black uppercase tracking-widest">
                       Pain: {consultationData.pain_intensity}
                     </div>
                     <div className="px-3 py-1 rounded-full bg-clinic-cyan/20 border border-clinic-cyan/40 text-clinic-cyan text-[8px] font-black uppercase tracking-widest">
                       Footwear: {consultationData.footwear}
                     </div>
                   </div>
                   <p className="text-slate-200 text-sm md:text-base leading-relaxed font-serif italic relative z-10 mb-4">
                     "{currentResult.verdict}"
                   </p>
                   {consultationData.pain_description && (
                     <div className="pt-4 border-t border-white/5 space-y-1">
                       <span className="text-[8px] text-clinic-cyan font-black uppercase tracking-widest">User Case Ref:</span>
                       <p className="text-slate-400 text-[11px] font-medium leading-relaxed">
                         "{consultationData.pain_description}"
                       </p>
                     </div>
                   )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Left Side: Specs & Material */}
                   <div className="space-y-8">
                      <div className="space-y-4">
                         <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Diagnostic Data</div>
                         <div className="space-y-3">
                            <div className="flex items-start gap-4">
                               <div className="w-8 h-8 rounded-xl bg-clinic-cyan/10 flex items-center justify-center shrink-0 border border-clinic-cyan/20">
                                  <Zap className="w-4 h-4 text-clinic-cyan" />
                               </div>
                               <div>
                                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Arch Support Model</div>
                                  <div className="text-white text-xs font-bold">{currentResult.specifications.arch}</div>
                               </div>
                            </div>
                            <div className="flex items-start gap-4">
                               <div className="w-8 h-8 rounded-xl bg-clinic-cyan/10 flex items-center justify-center shrink-0 border border-clinic-cyan/20">
                                  <Dna className="w-4 h-4 text-clinic-cyan" />
                               </div>
                               <div>
                                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Heel Stabilization</div>
                                  <div className="text-white text-xs font-bold">{currentResult.specifications.heel}</div>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Manufacturing Profile</div>
                         <div className="flex flex-wrap gap-2">
                            {currentResult.specifications.materials.map(m => (
                              <span key={m} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-[9px] font-bold uppercase tracking-wider">{m}</span>
                            ))}
                            <div className="w-full mt-2 p-3 rounded-xl bg-clinic-cyan/5 border border-clinic-cyan/10 flex items-center gap-3">
                               <Box className="w-4 h-4 text-clinic-cyan" />
                               <span className="text-clinic-cyan text-[10px] font-black uppercase tracking-widest">
                                 {currentResult.specifications.densityCorrection} Correction Applied
                               </span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Right Side: Virtual Simulation */}
                   <div className="flex flex-col">
                      <GaitPressureSimulation conditionId={selectedId || 'heel'} />
                   </div>
                </div>

                {/* High-Conversion Treatment Plan Card */}
                <div className="pt-8 border-t border-white/10">
                   <div className="relative group/card bg-gradient-to-br from-slate-900 to-clinic-navy/40 rounded-[2rem] border border-white/10 p-6 md:p-8 overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-clinic-blue/10 blur-[80px] -mr-20 -mt-20 group-hover/card:bg-clinic-cyan/20 transition-all duration-700" />
                      
                      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                         <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
                            <div className="absolute inset-0 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10 transform rotate-3" />
                            <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 transform -rotate-3 group-hover/card:rotate-0 transition-transform duration-500" />
                            <div className="relative w-full h-full bg-white rounded-3xl p-4 flex items-center justify-center shadow-2xl">
                               <img 
                                 src={currentResult.recommendedProduct === 'ORTHO RELIEF' ? 'https://files.cdn-files-a.com/uploads/10385685/800_67cfa3eaef14a.png' : 'https://files.cdn-files-a.com/uploads/10385685/800_67cfabb3d097a.png'} 
                                 className="w-full h-full object-contain transform group-hover/card:scale-110 transition-transform duration-500"
                                 alt="Prescribed Orthotic"
                               />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-clinic-cyan text-white p-1.5 rounded-lg shadow-lg">
                               <ShieldCheck className="w-4 h-4" />
                            </div>
                         </div>

                         <div className="flex-1 space-y-6 text-center md:text-left">
                            <div className="space-y-1">
                               <div className="flex items-center justify-center md:justify-start gap-2">
                                  <span className="text-clinic-cyan font-black text-[9px] uppercase tracking-[0.3em]">Official Prescription</span>
                                  <div className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[8px] font-black uppercase">Instock</div>
                               </div>
                               <h5 className="text-white font-display text-3xl font-black uppercase tracking-tight leading-none">
                                  {currentResult.recommendedProduct}
                               </h5>
                               <p className="text-slate-400 text-xs font-medium max-w-sm">
                                 Calibrated precision device for permanent <span className="text-white">{currentResult.condition.split('/')[0]}</span> correction.
                               </p>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                               <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                                  <div className="w-1.5 h-1.5 rounded-full bg-clinic-cyan" />
                                  <span className="text-[9px] font-bold text-slate-300 uppercase">3D Printed Base</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                                  <div className="w-1.5 h-1.5 rounded-full bg-clinic-cyan" />
                                  <span className="text-[9px] font-bold text-slate-300 uppercase">Life-Time Warranty</span>
                                </div>
                            </div>
                         </div>

                         <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-3 shrink-0">
                            <div className="text-right">
                               <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest line-through block opacity-50">Clinic Value: $495</span>
                               <span className="text-white font-black text-3xl tracking-tighter leading-none mt-1">INCLUDED</span>
                               <span className="text-[8px] text-clinic-cyan font-black uppercase tracking-widest block text-center md:text-right">with treatment plan</span>
                            </div>

                            <a href="#branches" className="w-full">
                               <motion.button 
                                 whileHover={{ scale: 1.05, backgroundColor: '#00e5ff', color: '#000' }}
                                 whileTap={{ scale: 0.95 }}
                                 className="w-full bg-clinic-blue text-white font-black px-10 py-5 rounded-2xl text-[11px] uppercase tracking-widest transition-all shadow-2xl shadow-clinic-blue/40 flex items-center justify-center gap-3"
                               >
                                 Claim My Fit <ChevronRight className="w-5 h-5" />
                               </motion.button>
                            </a>
                            <p className="text-[7px] text-slate-600 font-bold uppercase tracking-widest">Reserve at your nearest clinic</p>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Machine Grid Background Overlay */}
          <div className="absolute inset-0 pointer-events-none border-[12px] border-slate-950 pointer-events-none" />
          <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-[2rem]" />
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-slate-900 px-10 py-3 flex items-center justify-between border-t border-white/5">
        <div className="flex gap-6">
           <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-clinic-cyan" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Medical Accuracy Guarantee</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-clinic-cyan" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">FDA Compliant Design</span>
           </div>
        </div>
        <div className="text-[8px] font-mono text-clinic-cyan/40">
           ANALYSIS_ENG_RE_ID: {Math.random().toString(36).substring(7).toUpperCase()}
        </div>
      </div>
    </div>
  );
};
