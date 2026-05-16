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
        {/* Featured Video Section - Moved to Top for Prominence */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 md:mb-32 relative rounded-[32px] md:rounded-[40px] overflow-hidden group shadow-2xl border border-slate-100"
        >
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
            <div className="absolute inset-0 bg-gradient-to-t from-clinic-navy/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 flex flex-col md:flex-row justify-between items-end gap-6 bg-[#05010e] pr-[6px] pb-[-18px] mb-[-16px] border-double border-4 border-white/10 rounded-[29px]">
              <div className="space-y-4 md:space-y-6 ml-[48px] mb-[-53px]">
                <div className="flex items-center gap-4 mr-[18px] pb-[-13px] pt-[-14px] ml-[-3px] mt-[5px]">
                  <span className="text-clinic-cyan text-[9px] md:text-[10px] items-center inline-flex font-black uppercase tracking-[0.3em] bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-clinic-cyan mr-2 animate-pulse" />
                    Featured Clinical Overview
                  </span>
                  
                  {/* Clinical Audio Controller */}
                  <motion.div 
                    onClick={toggleAudio}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 cursor-pointer group/audio shadow-xl"
                  >
                    <div className="w-6 h-6 rounded-full bg-clinic-cyan flex items-center justify-center">
                      <div className={`flex gap-0.5 items-end ${isMuted ? 'h-1' : 'h-2.5'}`}>
                        <motion.div animate={isMuted ? { height: 2 } : { height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-clinic-navy rounded-full" />
                        <motion.div animate={isMuted ? { height: 2 } : { height: [6, 8, 6] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.1 }} className="w-0.5 bg-clinic-navy rounded-full" />
                        <motion.div animate={isMuted ? { height: 2 } : { height: [3, 10, 3] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-0.5 bg-clinic-navy rounded-full" />
                      </div>
                    </div>
                    <span className="text-white text-[9px] font-bold uppercase tracking-widest hidden sm:inline">
                      {isMuted ? 'Enable Audio' : 'Audio Active'}
                    </span>
                  </motion.div>
                </div>
                <h3 className="text-white font-display text-2xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.05] tracking-tight mb-[18px]">
                  PRECISION MEDICAL <br />
                  <span className="text-clinic-cyan drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]">PRODUCTION</span>
                </h3>
                {/* SEO-Rich Description */}
                <p className="max-w-xl text-slate-300 text-[10px] md:text-xs font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block">
                  Discover how EZStep Clinical Orthotics utilizes advanced VOXELCARE Spain engineering and medical-grade EVA 3D fabrication to create 100% personalized custom insoles. Our state-of-the-art process ensures biomechanical alignment and chronic pain relief through precision foot scanning and rapid on-site prototyping.
                </p>
              </div>
              <div className="pt-[19px] bg-[#0c0521] mr-[14px] pr-[23px] pl-[34px] ml-[-2px] mt-[0px] mb-[11px] backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/50 shadow-xl max-w-sm">
                <p className="text-slate-300 text-[10px] md:text-xs font-bold leading-relaxed uppercase tracking-wider">
                  Watch our proprietary manufacturing process that combines Spanish biomechanical logic with clinical-grade materials for ultimate relief.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
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
      </div>
    </section>
  );
};
