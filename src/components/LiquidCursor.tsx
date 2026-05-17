import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Shock {
  id: number;
  x: number;
  y: number;
  bolts: { path: string; id: number }[];
}

export const LiquidCursor: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [shocks, setShocks] = useState<Shock[]>([]);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A'
      );
    };

    const generateBolt = (startX: number, startY: number) => {
      const segments = 4;
      const length = 40 + Math.random() * 40;
      const angle = Math.random() * Math.PI * 2;
      let currentX = 0;
      let currentY = 0;
      let path = `M 0 0`;

      for (let i = 1; i <= segments; i++) {
        const step = length / segments;
        const jitter = 15;
        const tx = Math.cos(angle) * step * i + (Math.random() - 0.5) * jitter;
        const ty = Math.sin(angle) * step * i + (Math.random() - 0.5) * jitter;
        path += ` L ${tx} ${ty}`;
      }
      return path;
    };

    const handleClick = (e: MouseEvent) => {
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 150);

      const boltCount = 6;
      const bolts = Array.from({ length: boltCount }).map((_, i) => ({
        id: i,
        path: generateBolt(e.clientX, e.clientY)
      }));

      const newShock = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        bolts
      };

      setShocks((prev) => [...prev, newShock]);
      setTimeout(() => {
        setShocks((prev) => prev.filter(s => s.id !== newShock.id));
      }, 400);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1000] overflow-hidden select-none">
      {/* High-Precision Core Spark */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full z-20 shadow-[0_0_15px_#fff,0_0_30px_#00e5ff]"
        animate={{
          x: mousePos.x - 0.75,
          y: mousePos.y - 0.75,
          scale: isClicking ? 2 : 1,
        }}
        transition={{ type: "spring", damping: 45, stiffness: 600, mass: 0.1 }}
      />

      {/* Electrical Aura (Turbulence Filtered) */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-clinic-cyan/40"
        style={{ filter: 'url(#electric-flicker)' }}
        animate={{
          x: mousePos.x - 20,
          y: mousePos.y - 20,
          scale: isPointer ? 1.8 : 1,
          rotate: isPointer ? 180 : 0,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.5 }}
      >
        <div className="absolute inset-0 bg-clinic-cyan/10 rounded-full animate-pulse" />
      </motion.div>

      {/* Discharge Arcs */}
      <AnimatePresence>
        {shocks.map((shock) => (
          <div 
            key={shock.id} 
            className="absolute" 
            style={{ left: shock.x, top: shock.y }}
          >
            {shock.bolts.map((bolt) => (
              <svg key={bolt.id} className="absolute overflow-visible">
                <motion.path
                  initial={{ pathLength: 0, opacity: 1 }}
                  animate={{ pathLength: 1, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  d={bolt.path}
                  fill="none"
                  stroke="#00e5ff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_5px_#00e5ff]"
                />
              </svg>
            ))}
            
            {/* Shock Point Flash */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              className="absolute -left-2 -top-2 w-4 h-4 bg-clinic-cyan rounded-full blur-md"
            />
          </div>
        ))}
      </AnimatePresence>

      {/* SVG Filters for Electrical Effect */}
      <svg className="absolute invisible w-0 h-0">
        <defs>
          <filter id="electric-flicker">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="1">
              <animate attributeName="seed" values="1;100;1" dur="0.2s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="10" />
          </filter>
        </defs>
      </svg>

      {/* Static Trail */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-clinic-cyan/20 blur-xl"
        animate={{
          x: mousePos.x - 8,
          y: mousePos.y - 8,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 100, mass: 1.5 }}
      />
    </div>
  );
};

