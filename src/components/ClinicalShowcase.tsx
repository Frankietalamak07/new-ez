import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sparkles, ShieldCheck, Microscope, Zap, Activity, Users } from 'lucide-react';

const IMAGES = [
  '/src/assets/images/regenerated_image_1778927747612.png', // Clinical Setup
  '/src/assets/images/regenerated_image_1778927751963.jpg', // Clinical Lab Technology
];

export const ClinicalShowcase: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0.3, 0.6], [5, 0]);
  const scale = useTransform(scrollYProgress, [0.3, 0.6], [0.95, 1]);

  const whyUsData = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Medical Cert",
      value: "Level 1",
      desc: "Clinical Grade Fabrication"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Precision",
      value: "99.8%",
      desc: "Gait Sync Accuracy"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Consults",
      value: "50k+",
      desc: "Success Case Files"
    }
  ];

  const features = [
    { 
      icon: <Zap className="w-5 h-5 text-clinic-cyan" />, 
      title: "100% Medical Customization", 
      desc: "Unlike retail 'trim-to-fit' insoles, EZStep is medically engineered to your unique bone structure using complex 3D gait analysis." 
    },
    { 
      icon: <Microscope className="w-5 h-5 text-clinic-cyan" />, 
      title: "Proprietary Fusion Materials", 
      desc: "We exclusively use aerospace-grade carbon fiber and high-rebound EVA composites that don't flatten after 3 months of use." 
    },
    { 
      icon: <ShieldCheck className="w-5 h-5 text-clinic-cyan" />, 
      title: "Clinical Support Lifecycle", 
      desc: "Your journey doesn't end at purchase. We provide periodic posture realignment checks and lifetime structural shell guarantees." 
    }
  ];

  return (
    <section 
      id="why-choose-us"
      className="py-32 px-6 border-y border-white/5 relative overflow-hidden bg-[#011249]"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-clinic-blue/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-clinic-cyan/10 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-20">
          <div className="space-y-6 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-clinic-cyan text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-sm"
            >
              <Sparkles className="w-3 h-3" /> Superior Orthotics
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: "-100px" }}
              className="font-display text-5xl md:text-7xl font-black text-white leading-[0.9] uppercase"
            >
              WHY CHOOSE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-clinic-blue to-clinic-cyan">EZSTEP CLINICAL</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-400 font-medium max-w-sm text-sm md:text-base border-l-2 border-clinic-blue pl-6 italic"
          >
            "Generic comfort is a retail myth. True alignment requires clinical data and aerospace structural engineering."
          </motion.p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Main Visual Block (Column 1-7) */}
          <motion.div 
            style={{ rotateX: rotate, scale }}
            className="lg:col-span-7 group relative rounded-[3rem] overflow-hidden bg-slate-900 border border-white/10 shadow-2xl h-[500px] md:h-[600px]"
          >
            <img 
              src={IMAGES[0]} 
              className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000 group-hover:scale-105"
              alt="EZStep Technology"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            
            <div className="absolute bottom-10 left-10 right-10 space-y-6">
              <div className="flex gap-4">
                {whyUsData.map((stat, i) => (
                  <div key={i} className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                     <motion.div 
                       className="text-clinic-cyan mb-1"
                       whileHover={{ 
                         scale: [1, 1.2, 1],
                         transition: { 
                           duration: 1, 
                           repeat: Infinity,
                           ease: "easeInOut"
                         } 
                       }}
                     >
                       {stat.icon}
                     </motion.div>
                     <div className="text-white font-black text-xl leading-none">{stat.value}</div>
                     <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">{stat.title}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-display text-3xl font-black uppercase">Aerospace Structural Integrity</h3>
                <p className="text-slate-400 text-sm max-w-md">Our lab-tested composite shells maintain architectural rigidity under 5G of athletic force while weighing 40% less than standard polymers.</p>
              </div>
            </div>
          </motion.div>

          {/* Features Block (Column 8-12) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40, filter: 'blur(12px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-clinic-blue/40 transition-all duration-500 flex flex-col justify-end min-h-[180px] relative overflow-hidden"
              >
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-clinic-blue/5 rounded-full blur-2xl group-hover:bg-clinic-blue/20 transition-all" />
                <motion.div 
                  className="w-12 h-12 rounded-2xl bg-clinic-blue/10 flex items-center justify-center mb-6"
                  whileHover={{ 
                    scale: [1, 1.1, 1],
                    transition: { 
                      duration: 1, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    } 
                  }}
                >
                  {f.icon}
                </motion.div>
                <h4 className="text-white font-display text-xl font-black uppercase mb-3 group-hover:text-clinic-cyan transition-colors">{f.title}</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}

            <motion.a 
              href="https://www.facebook.com/ezstephofficial"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              className="block"
            >
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: '#00e5ff', color: '#000' }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-clinic-blue text-white font-black py-6 rounded-[2rem] uppercase tracking-[0.2em] text-xs shadow-2xl transition-all flex items-center justify-center gap-3"
              >
                Start Clinical Transformation <Zap className="w-4 h-4" />
              </motion.button>
            </motion.a>
          </div>

        </div>
      </div>
    </section>
  );
};

