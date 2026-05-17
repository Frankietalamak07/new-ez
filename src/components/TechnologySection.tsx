import React from 'react';
import { motion } from 'motion/react';
import { OrthoticViewer3D } from './OrthoticViewer3D';
import { PremiumFootScan, PremiumPulse, PremiumAlignment, PremiumHeatmap } from './MedicalIcons';

export const TechnologySection: React.FC = () => {
  const [isMuted, setIsMuted] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const features = [
    {
      icon: <PremiumFootScan className="w-8 h-8" />,
      title: "VOXELCARE Scan",
      desc: "Spanish biomechanical mapping provides a microscopic view of your lower limb alignment."
    },
    {
      icon: <PremiumPulse className="w-8 h-8" />,
      title: "Rapid Assembly",
      desc: "Clinical-grade manufacturing on-site. Your precision orthotics ready in under 60 minutes."
    },
    {
      icon: <PremiumAlignment className="w-8 h-8" />,
      title: "Kinetic Flow",
      desc: "Medical-grade EVA materials calibrated to your unique gait, weight, and activity level."
    },
    {
      icon: <PremiumHeatmap className="w-8 h-8" />,
      title: "FDA Standards",
      desc: "Materials and processes compliant with international quality standards for medical orthotics."
    }
  ];

  return (
    <section 
      id="technology"
      className="py-24 px-6 bg-white border-y border-slate-100 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-clinic-blue/5 blur-[140px] rounded-full" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-20 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h2 className="font-display text-4xl md:text-6xl font-black text-clinic-navy leading-[1.1] uppercase">
                CLINICAL<br />
                <span className="text-clinic-blue">ENGINEERING</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed max-w-lg font-medium">
                Standard insoles are mass-produced. EZStep is <span className="text-clinic-blue font-bold">clinical data</span> transformed into therapeutic comfort. 
                Our Spain-engineered ecosystem delivers precise biomechanical corrections for your unique gait.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((f, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="space-y-4 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-clinic-bg flex items-center justify-center border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.05)] group-hover:bg-clinic-blue group-hover:text-white transition-all duration-500 relative overflow-hidden backdrop-blur-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent group-hover:opacity-0" />
                    <div className="group-hover:scale-110 group-hover:brightness-0 group-hover:invert transition-all">
                      {f.icon}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-clinic-navy uppercase tracking-widest text-xs group-hover:text-clinic-blue transition-colors">{f.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] lg:h-[600px] w-full"
          >
            <OrthoticViewer3D />
          </motion.div>
        </div>

        {/* Featured Video Section - Moved below features */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          {/* Header for Video */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4">
            <div className="space-y-4">
              <span className="text-clinic-cyan text-[10px] items-center inline-flex font-black uppercase tracking-[0.3em] bg-clinic-blue/10 px-4 py-2 rounded-full border border-clinic-blue/20">
                <div className="w-1.5 h-1.5 rounded-full bg-clinic-cyan mr-2 animate-pulse" />
                Featured Clinical Overview
              </span>
              <h3 className="text-clinic-navy font-display text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-tight tracking-tight">
                PRECISION MEDICAL <br />
                <span className="text-clinic-blue">PRODUCTION</span>
              </h3>
              <p className="max-w-xl text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                Watch our proprietary manufacturing process that combines Spanish biomechanical logic with clinical-grade materials for ultimate relief.
              </p>
            </div>
            
            <div 
              onClick={toggleAudio}
              className="flex items-center gap-3 bg-clinic-bg px-5 py-3 rounded-2xl border border-slate-100 cursor-pointer group/audio hover:bg-clinic-blue transition-all shadow-md group"
            >
              <div className="w-6 h-6 rounded-full bg-clinic-cyan flex items-center justify-center">
                <div className={`flex gap-0.5 items-end ${isMuted ? 'h-1' : 'h-2.5'}`}>
                  <motion.div animate={isMuted ? { height: 2 } : { height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-clinic-navy rounded-full" />
                  <motion.div animate={isMuted ? { height: 2 } : { height: [6, 8, 6] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.1 }} className="w-0.5 bg-clinic-navy rounded-full" />
                </div>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors ${isMuted ? 'text-slate-400' : 'text-clinic-navy'}`}>
                {isMuted ? 'Audio Off' : 'Audio On'}
              </span>
            </div>
          </div>

          <div className="relative rounded-[32px] md:rounded-[40px] overflow-hidden group shadow-2xl border border-slate-100 bg-black">
            <div className="aspect-video relative">
              <video 
                ref={videoRef}
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="https://cdn-media.f-static.net/uploads/10385685/normal_67ce9f6ad5184.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
