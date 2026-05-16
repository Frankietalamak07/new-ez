import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Activity, Zap } from 'lucide-react';

export const InsoleShowcase: React.FC = () => {
  return (
    <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] lg:w-[550px] lg:h-[550px] xl:w-[600px] xl:h-[600px] flex items-center justify-center">
      {/* Background Glows */}
      <div className="absolute inset-20 bg-clinic-blue/10 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute inset-40 bg-clinic-cyan/10 blur-[100px] rounded-full" />

      {/* Rotating Digital Rings */}
      <div className="absolute inset-4 rounded-full border border-clinic-blue/10 animate-[spin_20s_linear_infinite]" />
      <div className="absolute inset-10 rounded-full border border-clinic-cyan/5 animate-[spin_35s_linear_infinite_reverse]" />
      <div className="absolute inset-20 rounded-full border border-clinic-blue/5 animate-[spin_50s_linear_infinite]" />

      {/* Centerpiece Image - High Fidelity */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotateY: [-5, 5, -5]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-10 w-full h-full flex items-center justify-center p-6 md:p-12"
      >
        <img 
          src="https://files.cdn-files-a.com/uploads/10385685/800_67cfaac119561.png" 
          alt="EZStep Active Sport Custom Orthotic Insole - 3D Engineered" 
          className="w-full h-auto object-contain drop-shadow-[0_45px_100px_rgba(0,98,255,0.4)]"
          referrerPolicy="no-referrer"
          loading="eager"
        />
        
        {/* Floating Data Points - Repositioned to the right */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="absolute top-0 right-4 bg-white/80 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-clinic-blue/10 shadow-2xl space-y-2 hidden xl:block"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-clinic-blue" />
            <span className="text-[8px] font-black tracking-widest uppercase">Arch.Align_V4</span>
          </div>
          <div className="h-1 w-20 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              transition={{ duration: 2, delay: 1 }}
              className="h-full bg-clinic-blue"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 right-4 bg-white/80 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-clinic-blue/10 shadow-2xl space-y-2 hidden xl:block"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-clinic-cyan" />
            <span className="text-[8px] font-black tracking-widest uppercase">Load.Distribution</span>
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ height: [4, i * 4 + 4, 4] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-1.5 bg-clinic-cyan rounded-full"
              />
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, type: 'spring' }}
          className="absolute top-1/2 right-10 w-12 h-12 bg-clinic-blue rounded-full flex items-center justify-center shadow-lg shadow-clinic-blue/30 hidden lg:flex"
        >
          <Zap className="w-6 h-6 text-white" />
        </motion.div>
      </motion.div>

      {/* Ground Projection */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-10 bg-clinic-blue/10 blur-3xl rounded-full" />
    </div>
  );
};
