import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, XCircle, Zap, Microscope, LayoutGrid, Layers } from 'lucide-react';

export const TheDifferenceSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 px-6 bg-slate-900 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/src/assets/images/ezstep_payday_sale_bg_1778996585229.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-50 grayscale-[20%]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-900/50" />
      </div>

      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-clinic-blue/5 blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-clinic-cyan/5 blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-clinic-cyan text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <Microscope className="w-3 h-3" /> The EZStep Difference
          </motion.div>
          <motion.h2 
             initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
             whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
             viewport={{ once: true }}
             className="font-display text-4xl sm:text-5xl md:text-7xl font-black text-white uppercase leading-none"
          >
            CLINICAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-clinic-blue to-clinic-cyan">ENGINEERING</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 font-medium max-w-2xl mx-auto text-base md:text-lg pt-4 leading-relaxed"
          >
            "Standard insoles are mass-produced. EZStep is clinical data transformed into therapeutic comfort. Our Spain-engineered ecosystem delivers precise biomechanical corrections for your unique gait."
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-12 lg:items-stretch">
          {/* Column: Retail Standard */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-16 rounded-[2.5rem] md:rounded-[3rem] bg-white/5 border border-white/5 space-y-10 md:space-y-12 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <XCircle className="w-12 h-12 text-slate-700" />
              </motion.div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-slate-500 font-display text-3xl font-black uppercase">Standard Insoles</h3>
              <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">Mass-Market Production</p>
            </div>

            <div className="space-y-8">
              {[
                "Fixed Generic Arch Profiles",
                "Compressible Foam Materials",
                "Limited Life-Cycle (1-3 Mo)",
                "No Clinical Data Analysis",
                "Retail Shop Availability"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 opacity-40">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Material Grade</div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-1/4 bg-slate-600" />
              </div>
            </div>
          </motion.div>

          {/* Column: EZStep Clinical */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-16 rounded-[2.5rem] md:rounded-[3rem] bg-clinic-navy border border-clinic-blue/20 space-y-10 md:space-y-12 relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute top-0 right-0 p-8">
              <motion.div
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ShieldCheck className="w-12 h-12 text-clinic-cyan" />
              </motion.div>
            </div>

            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-clinic-blue/10 rounded-full blur-[100px]" />
            
            <div className="space-y-2 relative z-10">
              <h3 className="text-white font-display text-3xl font-black uppercase">EZStep Clinical</h3>
              <p className="text-clinic-cyan font-black uppercase tracking-widest text-[10px]">Biomechanical Correction</p>
            </div>

            <div className="space-y-8 relative z-10">
              {[
                "Exact Gait Fingerprint Mapping",
                "Aerospace Carbon Fiber Shells",
                "Clinical Lifetime Guarantee",
                "Proprietary España-Voxel Engine",
                "Specialist Clinical Protocol"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-white">
                  <Zap className="w-4 h-4 text-clinic-cyan" />
                  <span className="text-sm font-bold tracking-tight">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 relative z-10">
              <div className="text-[10px] font-black text-clinic-cyan uppercase tracking-[0.3em] mb-4">Structural Integrity Grade</div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '98%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-clinic-blue to-clinic-cyan" 
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[8px] font-bold text-slate-500 uppercase">Industrial</span>
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Medical Absolute</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-0">
           {[
             { icon: <LayoutGrid className="w-5 h-5" />, label: "3D VOXEL MAPPING", value: "0.1mm Accuracy" },
             { icon: <Layers className="w-5 h-5" />, label: "MULTI-LAYER FUSION", value: "Carbon Fiber" },
             { icon: <Zap className="w-5 h-5" />, label: "KINETIC RETURN", value: "98% Efficiency" },
             { icon: <ShieldCheck className="w-5 h-5" />, label: "MED-CERTIFIED", value: "Level 1 Grade" }
           ].map((tech, i) => (
             <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 text-center group/item hover:bg-clinic-blue/10 hover:border-clinic-blue/20 transition-all">
                <motion.div 
                  className="text-clinic-cyan"
                  whileHover={{ 
                    scale: [1, 1.15, 1],
                    transition: { 
                      duration: 1, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    } 
                  }}
                >
                  {tech.icon}
                </motion.div>
                <div className="space-y-1">
                  <div className="text-[8px] font-black text-white uppercase tracking-[0.2em]">{tech.label}</div>
                  <div className="text-[10px] font-bold text-clinic-cyan/70 uppercase tracking-widest">{tech.value}</div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};
