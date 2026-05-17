import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, ShieldCheck, Zap } from 'lucide-react';

export const MissionVisionSection: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-clinic-navy relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(0,180,216,0.1),transparent_50%)]" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(0,98,255,0.05),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group p-8 md:p-12 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-clinic-blue/40 transition-all duration-500 flex flex-col items-start gap-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-clinic-blue/20 flex items-center justify-center text-clinic-cyan group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-clinic-blue/20">
              <Target className="w-8 h-8" />
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-clinic-cyan text-[10px] font-black uppercase tracking-[0.3em]">Core Purpose</span>
                <h3 className="font-display text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Our Mission</h3>
              </div>
              <p className="text-slate-400 text-lg md:text-xl font-serif italic leading-relaxed">
                "To empower Filipinos with accessible, clinical-grade biomechanical solutions through advanced Spanish engineering and personalized data-driven diagnostics."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <ShieldCheck className="w-5 h-5 text-clinic-blue" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Medical Accuracy Guaranteed</span>
              </div>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group p-8 md:p-12 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-clinic-cyan/40 transition-all duration-500 flex flex-col items-start gap-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-clinic-cyan/20 flex items-center justify-center text-clinic-cyan group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-clinic-cyan/20">
              <Eye className="w-8 h-8" />
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-clinic-cyan text-[10px] font-black uppercase tracking-[0.3em]">Future Trajectory</span>
                <h3 className="font-display text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Our Vision</h3>
              </div>
              <p className="text-slate-400 text-lg md:text-xl font-serif italic leading-relaxed">
                "To be the Philippines' premier destination for non-invasive musculoskeletal alignment, transforming every step through the marriage of clinical expertise and breakthrough technology."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <Zap className="w-5 h-5 text-clinic-cyan" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Innovation-First Philosophy</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
