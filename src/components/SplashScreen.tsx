import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  // Generate random biometric data strings for visual interest
  const bioData = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      value: `0x${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}`,
      delay: Math.random() * 2
    }));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (Math.random() * 3 + 1);
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, 50);

    const exitTimer = setTimeout(() => {
      onComplete();
    }, 3200); // Slightly longer for the new effects

    return () => {
      clearInterval(timer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.1,
        filter: "blur(20px)"
      }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] bg-clinic-navy flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Tech Patterns */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,98,255,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Vertical Scanning Beam */}
      <motion.div
        animate={{ 
          top: ['-20%', '120%'],
          opacity: [0, 1, 1, 0]
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity, 
          ease: "linear",
          times: [0, 0.1, 0.9, 1]
        }}
        className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-clinic-cyan/20 to-transparent pointer-events-none z-0"
      >
        <div className="absolute bottom-0 left-0 right-0 h-px bg-clinic-cyan/50 shadow-[0_0_20px_rgba(0,229,255,0.8)]" />
      </motion.div>

      {/* Biometric Data Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bioData.map((data) => (
          <motion.div
            key={data.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: data.delay,
              ease: "easeInOut"
            }}
            style={{ left: data.left, top: data.top }}
            className="absolute font-mono text-[8px] text-clinic-cyan/40 tracking-widest"
          >
            {data.value}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-16"
        >
          <Logo />
        </motion.div>

        {/* Clinical Progress Interface */}
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Background Glow */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-clinic-cyan rounded-full blur-2xl"
            />

            {/* Circular Progress (Subtle) */}
            <motion.svg 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 -rotate-90 relative z-10"
            >
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="white"
                strokeWidth="1"
                className="opacity-10"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="var(--color-clinic-cyan)"
                strokeWidth="2"
                strokeDasharray="188.5"
                animate={{ 
                  strokeDashoffset: 188.5 - (188.5 * progress) / 100,
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  strokeDashoffset: { duration: 0.5, ease: "linear" },
                  opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
              />
            </motion.svg>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <motion.span 
                key={Math.floor(progress)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] font-mono text-clinic-cyan font-bold"
              >
                {Math.round(progress)}%
              </motion.span>
            </div>
          </motion.div>

          <div className="flex flex-col items-center gap-3">
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[10px] uppercase font-black tracking-[0.5em] text-clinic-cyan"
            >
              System Calibration
            </motion.div>
            <div className="flex items-center gap-4">
               <div className="h-px w-8 bg-gradient-to-r from-transparent to-clinic-cyan/30" />
               <div className="text-[8px] uppercase font-bold tracking-[0.3em] text-slate-500 whitespace-nowrap">
                 Bio-Gait Analysis Active
               </div>
               <div className="h-px w-8 bg-gradient-to-l from-transparent to-clinic-cyan/30" />
            </div>
          </div>
        </div>
      </div>

      {/* UI Elements - Corner Brackets */}
      {['top-12 left-12', 'top-12 right-12', 'bottom-12 left-12', 'bottom-12 right-12'].map((pos, i) => (
        <motion.div
          key={pos}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          className={`absolute ${pos} w-10 h-10 border-clinic-cyan/20 ${
            pos.includes('top') ? 'border-t-px' : 'border-b-px'
          } ${
            pos.includes('left') ? 'border-l-px' : 'border-r-px'
          }`}
        />
      ))}

      {/* Enhanced 3D Rotating Rings */}
      <div className="absolute inset-0 flex items-center justify-center perspective-[1000px] pointer-events-none">
        <motion.div
          animate={{ 
            rotateX: [45, 60, 45],
            rotateY: [0, 360],
            rotateZ: [0, 180]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[400px] h-[400px] border-2 border-clinic-cyan/10 rounded-full shadow-[0_0_50px_rgba(0,98,255,0.1)]"
        />
        <motion.div
          animate={{ 
            rotateX: [60, 45, 60],
            rotateY: [360, 0],
            rotateZ: [180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[500px] h-[500px] border border-white/5 rounded-full"
        />
        <motion.div
          animate={{ 
            rotateX: [-30, -50, -30],
            rotateY: [0, 360]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute w-[600px] h-[600px] border border-clinic-blue/5 rounded-full"
        />
        
        {/* Glowing Core Orbit */}
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
           className="absolute w-[300px] h-[300px]"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-clinic-cyan rounded-full shadow-[0_0_15px_rgba(0,229,255,1)]" />
        </motion.div>
      </div>
    </motion.div>
  );
};

