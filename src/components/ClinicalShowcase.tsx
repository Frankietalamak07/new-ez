import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { PremiumFootScan, PremiumPulse, PremiumInsole } from './MedicalIcons';

const IMAGES = [
  '/src/assets/images/regenerated_image_1778927747612.png', // Clinical Setup
  '/src/assets/images/regenerated_image_1778927751963.jpg', // Clinical Lab Technology
  '/src/assets/images/regenerated_image_1778927745981.jpg', // High Performance Gear
  '/src/assets/images/regenerated_image_1778927749717.jpg'  // Medical Imaging Aesthetic
];

export const ClinicalShowcase: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section 
      className="py-32 px-6 border-y border-white/5 relative overflow-hidden"
      style={{
        height: '1413.27px',
        width: '1497px',
        marginRight: '6px',
        paddingBottom: '296px',
        paddingTop: '119px',
        marginBottom: '4px',
        marginLeft: '0px',
        marginTop: '-15px',
        borderStyle: 'solid',
        backgroundColor: '#011249'
      }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-clinic-blue/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-clinic-cyan/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-clinic-cyan text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-sm shadow-xl"
          >
            <Sparkles className="w-3 h-3" /> Visual Precision
          </motion.div>
          <h2 className="font-display text-5xl md:text-7xl font-black text-white leading-tight uppercase">
            THE ART OF <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-clinic-blue to-clinic-cyan drop-shadow-2xl">BODY ALIGNMENT</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-4 md:gap-6 h-[400px] md:h-[600px] mb-12 lg:mb-0">
            <motion.div style={{ y: y1 }} className="space-y-4 md:space-y-6">
              <div className="h-2/3 rounded-3xl overflow-hidden group relative shadow-2xl">
                <img 
                  src={IMAGES[0]} 
                  alt="EZStep Bio-Orthopedic Clinical Scan and Assessment Process" 
                  loading="lazy"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                  <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest bg-clinic-blue px-2 py-0.5 md:px-3 md:py-1 rounded-sm shadow-lg">Methodology</span>
                </div>
              </div>
              <div className="h-1/3 rounded-3xl overflow-hidden group relative shadow-2xl border border-white/5">
                <img 
                  src={IMAGES[1]} 
                  alt="EZStep Active Sport Custom Insole Production Unit" 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-clinic-blue/20 mix-blend-overlay group-hover:opacity-0 transition-opacity" />
              </div>
            </motion.div>
            
            <motion.div style={{ y: y2 }} className="space-y-4 md:space-y-6 pt-8 md:pt-12">
              <div className="h-1/3 rounded-3xl overflow-hidden group relative shadow-2xl border border-white/5">
                <img 
                  src={IMAGES[2]} 
                  alt="EZStep Comfort Pro Daily Wear Orthotics Visualization" 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-clinic-cyan/20 mix-blend-overlay group-hover:opacity-0 transition-opacity" />
              </div>
              <div className="h-2/3 rounded-3xl overflow-hidden group relative shadow-2xl">
                <img 
                  src={IMAGES[3]} 
                  alt="EZStep Ortho Relief Medical Correction Orthotics" 
                  loading="lazy"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                  <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest bg-clinic-cyan px-2 py-0.5 md:px-3 md:py-1 rounded-sm shadow-lg">Medical Accuracy</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-8 md:space-y-12 lg:pl-12">
            {[
              { 
                icon: <PremiumFootScan className="w-8 h-8 md:w-10 md:h-10" />, 
                title: "Free Laser Scan", 
                desc: "We capture 1:1 digital topography of your foot, identifying millimetric variances through our complimentary assessment." 
              },
              { 
                icon: <PremiumPulse className="w-8 h-8 md:w-10 md:h-10" />, 
                title: "Advanced Bio-Thermals", 
                desc: "Our materials react to your body heat, maintaining structural integrity while providing dynamic flexibility." 
              },
              { 
                icon: <PremiumInsole className="w-8 h-8 md:w-10 md:h-10" />, 
                title: "Interactive Correction", 
                desc: "Review your alignment correction in real-time with our clinical specialists before final fabrication." 
              }
            ].map((f, i) => (

              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex gap-6 md:gap-8 group"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-clinic-cyan group-hover:bg-clinic-blue group-hover:text-white transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent group-hover:opacity-0" />
                  {f.icon}
                </div>
                <div className="space-y-1 md:space-y-2">
                  <h4 className="text-lg md:text-xl font-bold text-white uppercase tracking-tight group-hover:text-clinic-cyan transition-colors">{f.title}</h4>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium">{f.desc}</p>
                </div>
              </motion.div>
            ))}

            <motion.a 
              href="https://www.facebook.com/ezstephofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,98,255,0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-clinic-blue to-clinic-cyan text-white font-black py-5 md:py-6 rounded-2xl uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-2xl transition-all"
              >
                Book Your Physical Assessment
              </motion.button>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
};
