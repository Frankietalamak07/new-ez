/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TechnologySection } from './components/TechnologySection';
import { ClinicalShowcase } from './components/ClinicalShowcase';
import { PremiumFootScan, PremiumPulse, PremiumAlignment } from './components/MedicalIcons';
import { 
  Zap,
  ShieldCheck, 
  MapPin, 
  Phone, 
  Facebook, 
  Instagram,
  Sparkles,
  ArrowRight,
  HeartPulse,
  Scan,
  CreditCard,
  Award
} from 'lucide-react';
import { ThreeHero } from './components/ThreeHero';
import { InsoleShowcase } from './components/InsoleShowcase';
import { PainSelector } from './components/PainSelector';
import { Logo } from './components/Logo';
import { SplashScreen } from './components/SplashScreen';

const PRODUCTS = [
  {
    title: 'EZACTIVE SPORT',
    type: 'High-Performance Series',
    desc: 'Engineered for heavy shock absorption and peak athletic output. Corrects alignment under load to reduce muscle fatigue and prevent sports injuries.',
    price: 'Custom Fit',
    image: 'https://files.cdn-files-a.com/uploads/10385685/800_67cfaac119561.png',
    badge: 'Athletes Choice',
    tags: ['Shock Absorption', 'Max Energy Return', 'Gait Correction', 'Pro-Grade']
  },
  {
    title: 'COMFORT PRO',
    type: 'Daily Wear Series',
    desc: 'Tailored for professionals who spend long hours on their feet. Medical-grade cushioning meets 1:1 custom arch mapping for all-day relief.',
    price: 'Custom Fit',
    image: 'https://files.cdn-files-a.com/uploads/10385685/800_67cfabb3d097a.png',
    badge: 'Everyday Hero',
    tags: ['Memory Support', 'Heel Stability', 'Breathable']
  },
  {
    title: 'ORTHO RELIEF',
    type: 'Medical Correction',
    desc: 'Specifically designed for Plantar Fasciitis and flat feet. Reconstructs your arch mechanics using precise 4D voxel data to eliminate chronic pain.',
    price: 'Custom Fit',
    image: 'https://files.cdn-files-a.com/uploads/10385685/800_67cfa3eaef14a.png',
    badge: 'Clinical Grade',
    tags: ['Plantar Relief', 'Arch Reconstruction', 'Correction Focus']
  }
];

const BRANCHES = [
  { 
    name: 'ONE AYALA', 
    mall: 'Ayala Malls',
    loc: '3/L, One Ayala Malls', 
    icon: '🏢', 
    phone: '+63 995 032 2139',
    hours: '11 AM - 9 PM',
    image: '/src/assets/images/regenerated_image_1778927218408.png'
  },
  { 
    name: 'SM MALL OF ASIA', 
    mall: 'North Entertainment Mall',
    loc: '2/L, North Entertainment Mall', 
    icon: '🌊', 
    phone: '+63 926 969 6758',
    hours: '11 AM - 9 PM',
    image: '/src/assets/images/regenerated_image_1778927223942.png'
  },
  { 
    name: 'SM NORTH ANNEX', 
    mall: 'SM City North EDSA',
    loc: '2/L, SM City North EDSA Annex 1', 
    icon: '⭐', 
    phone: '+63 995 032 2139',
    hours: '11 AM - 9 PM',
    image: '/src/assets/images/regenerated_image_1778927221217.png'
  }
];

const SOCIALS = {
  facebook: 'https://www.facebook.com/ezstephofficial',
  instagram: 'https://www.instagram.com/ezstep.ph/',
  phones: ['+63 995 032 2139', '+63 926 969 6758']
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="font-sans text-slate-900 bg-white min-h-screen relative">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <SplashScreen key="splash" onComplete={() => setIsLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <header>
              {/* Announcement Bar - Medical Alert Style */}
              <div className="fixed top-0 left-0 right-0 z-[60] bg-clinic-navy text-white py-2 px-6 text-center">
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                  <span className="flex items-center gap-1.5"><HeartPulse className="w-3 h-3 text-clinic-cyan" /> Specialized Clinical Assessment Available</span>
                  <span className="hidden md:inline text-slate-600">|</span>
                  <span className="hidden md:inline">Precision Customization Since 2018</span>
                </div>
              </div>

              {/* Navigation - Ultra Clean */}
              <nav className="fixed top-9 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <Logo />
                  
                  <div className="hidden md:flex items-center gap-10">
                    {[
                      { n: 'Clinical Tech', h: '#technology' },
                      { n: 'Pain Guide', h: '#pain-guide' },
                      { n: 'Devices', h: '#products' },
                      { n: 'Clinic Locations', h: '#branches' }
                    ].map((item) => (
                      <motion.a 
                        key={item.n} 
                        href={item.h} 
                        whileHover="hover"
                        initial="initial"
                        className="relative text-[11px] font-bold uppercase tracking-widest text-slate-500 transition-colors"
                      >
                        <motion.span
                          variants={{
                            hover: { color: "#0062FF", y: -1 }
                          }}
                        >
                          {item.n}
                        </motion.span>
                        <motion.div 
                          variants={{
                            initial: { scaleX: 0, opacity: 0 },
                            hover: { scaleX: 1, opacity: 1 }
                          }}
                          className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-clinic-cyan origin-left"
                          transition={{ duration: 0.3 }}
                        />
                      </motion.a>
                    ))}
                  </div>

                  <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer">
                    <motion.button 
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 25px 50px rgba(0, 98, 255, 0.3)",
                        y: -2
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-clinic-blue text-white font-bold text-[10px] uppercase tracking-widest px-7 py-3 rounded-full transition-all shadow-lg active:shadow-inner"
                    >
                      Book Assessment
                    </motion.button>
                  </a>
                </div>
              </nav>
            </header>

      <main>
        {/* Hero Section - Pure Clinical Precision */}
        <section id="hero" className="relative min-h-screen flex items-center pt-32 lg:pt-40 overflow-hidden bg-white">
        <ThreeHero />
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 xl:gap-24 2xl:gap-32 items-center relative z-10 py-20 lg:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-clinic-blue/5 border border-clinic-blue/10 px-4 py-2 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-clinic-blue" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-clinic-blue">Bio-Orthopedic Manufacturing Excellence</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[7.5rem] font-black leading-[0.9] text-clinic-navy tracking-tighter">
              PRECISION <br />
              <span className="text-clinic-blue italic">ALIGNMENT.</span><br />
              ZERO PAIN.
            </h1>

            <div className="space-y-4">
              <p className="text-slate-600 max-w-lg text-xl md:text-2xl leading-relaxed font-serif italic">
                EZStep Clinical Orthotics transforms bio-data into therapeutic relief.
              </p>
              <p className="text-slate-400 max-w-lg text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
                Experience our <span className="text-clinic-blue">Free Foot Scan & Consultation</span> available at all branches.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#branches">
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-clinic-navy text-white font-black px-12 py-5 uppercase tracking-widest text-xs rounded-2xl shadow-2xl hover:bg-clinic-blue transition-colors group"
                >
                  Free Clinical Scan <ArrowRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </a>
              <a href="#products">
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(248, 250, 252, 1)" }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-slate-100 text-slate-600 font-bold px-10 py-5 uppercase tracking-widest text-xs rounded-2xl transition-colors"
                >
                  Our Methodology
                </motion.button>
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center relative"
          >
            <div className="absolute -inset-10 bg-clinic-blue/5 blur-[100px] rounded-full" />
            <InsoleShowcase />
          </motion.div>
        </div>
      </section>

      {/* Trust & Comparison */}
      <section className="py-24 px-6 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            { t: 'Why Clinical?', d: 'Generic retail insoles are for comfort. Clinical orthotics are for corrections. We address the root cause of your foot, knee, and back pain.' },
            { t: 'VOXELCARE Platform', d: 'Automated 3D scanning from Spain ensures 100% accuracy — eliminating the human error found in manual gait analysis.' },
            { t: 'Same-Day Correction', d: 'Why wait weeks for shipping? Our on-site labs at SM Malls produce your medical-grade orthotics in under 60 minutes.' }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="space-y-4 p-8 medical-card"
            >
              <h3 className="font-display font-black text-xl text-clinic-navy uppercase tracking-tight">{item.t}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div id="technology" role="region" aria-label="Clinical Technology">
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true, margin: "-100px" }}
        >
          <TechnologySection />
        </motion.div>
      </div>

      <motion.div
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         viewport={{ once: true, margin: "-100px" }}
      >
        <ClinicalShowcase />
      </motion.div>

      {/* Pain Analysis - THE CLINICAL INTERFACE */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        id="pain-guide" 
        aria-label="Pain Condition Selector"
        className="py-32 px-6 bg-slate-950 overflow-hidden relative"
      >
        <div 
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" 
          style={{ color: '#254cae', borderColor: '#254ab9' }}
        />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-1.5 bg-clinic-blue/10 text-clinic-blue border border-clinic-blue/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                Biomechanical Analysis
              </div>
              <h2 className="font-display text-5xl md:text-6xl font-black text-white uppercase leading-[0.9] tracking-tight">
                SELECT YOUR <br />
                <span className="text-clinic-cyan italic font-serif lowercase">Condition</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl font-serif italic leading-relaxed">
                Click on the pain zones to understand how medical-grade customization targets specific musculoskeletal imbalances.
              </p>
              <PainSelector />
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-20 bg-clinic-blue/20 blur-[120px] rounded-full opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="medical-card p-12 lg:p-20 relative text-center space-y-8 bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden" style={{ backgroundColor: '#000005' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-clinic-blue/10 blur-3xl rounded-full -mr-16 -mt-16" />
                <div className="w-24 h-24 bg-clinic-blue/20 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10">
                  <CreditCard className="w-10 h-10 text-clinic-cyan" />
                </div>
                <h3 className="font-display text-3xl font-black text-white uppercase tracking-tight relative z-10" style={{ marginBottom: '19px', paddingRight: '6px' }}>100% PERSONALIZED</h3>
                <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-xs mx-auto font-serif italic relative z-10">
                  "We don't scale sizes. We calibrate density to your exact biomechanical profile."
                </p>
                <div className="pt-8 grid grid-cols-2 gap-4 relative z-10">
                  <div className="relative bg-gradient-to-br from-clinic-blue/20 to-slate-900/40 p-5 rounded-2xl border border-clinic-blue/20 flex flex-col items-center justify-center overflow-hidden group shadow-lg">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-clinic-blue to-transparent" />
                    <div className="text-lg font-black text-white tracking-tight relative z-10">Same Day</div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-clinic-cyan font-black relative z-10 opacity-80">On-Site Ready</div>
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-clinic-blue/20 blur-xl rounded-full group-hover:scale-150 transition-transform" />
                  </div>
                  <div className="relative bg-gradient-to-br from-clinic-cyan/10 to-slate-900/40 p-5 rounded-2xl border border-clinic-cyan/10 flex flex-col items-center justify-center overflow-hidden group shadow-lg">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-clinic-cyan to-transparent" />
                    <div className="text-lg font-black text-white tracking-tight relative z-10">Medical</div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-clinic-blue font-black relative z-10 opacity-80">Grade Quality</div>
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-clinic-cyan/20 blur-xl rounded-full group-hover:scale-150 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Advanced Devices - THE PRODUCT LINEUP */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        id="products" 
        aria-label="Clinical Devices" 
        className="py-32 px-6 bg-slate-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <h2 className="font-display text-4xl md:text-5xl font-black text-clinic-navy uppercase">CLINICAL DEVICE LINEUP</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">Precisely calibrated orthotic systems for various lifestyle and clinical requirements.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PRODUCTS.map((prod, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                whileHover={{ y: -10 }}
                className="medical-card p-0 flex flex-col group h-full overflow-hidden"
              >
                <div className="h-64 bg-slate-50 relative overflow-hidden flex items-center justify-center p-8">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,98,255,0.05),transparent_70%)]" />
                  <motion.img 
                    src={prod.image} 
                    alt={`EZStep ${prod.title} ${prod.type} - Custom Clinical Orthotic`}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    loading="lazy"
                    className="h-full w-auto object-contain drop-shadow-2xl relative z-10"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="p-10 space-y-6 flex-1 flex flex-col">
                  <div className="space-y-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="inline-block px-3 py-1 bg-clinic-blue/5 border border-clinic-blue/10 rounded-full text-[9px] font-bold text-clinic-blue tracking-[0.2em] uppercase">
                        {prod.badge}
                      </div>
                      <Award className="w-5 h-5 text-slate-300 group-hover:text-clinic-blue transition-colors" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-display text-2xl font-black text-clinic-navy group-hover:text-clinic-blue transition-colors uppercase tracking-tight">{prod.title}</h3>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{prod.type}</p>
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{prod.desc}</p>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      {prod.tags.map(t => <span key={t} className="text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-md text-slate-500 border border-slate-200/50">{t}</span>)}
                    </div>
                  </div>

                  <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between">
                    <div className="font-display font-black text-clinic-navy">{prod.price}</div>
                    <button className="bg-clinic-blue text-white w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-clinic-blue/20">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* TENS Massager - CLINICAL RECOVERY UNIT */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-24 px-6 bg-white overflow-hidden relative"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative medical-card !bg-clinic-navy p-12 lg:p-24 overflow-hidden border-none text-white flex flex-col lg:flex-row items-center gap-20 shadow-[0_50px_100px_rgba(0,0,0,0.3)]"
          >
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-clinic-blue/10 blur-[150px] -z-1 rounded-full" />
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex-1 space-y-8 z-10 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 text-clinic-cyan font-bold text-xs uppercase tracking-[0.3em]">
                <Zap className="w-4 h-4" /> Systemic Recovery Unit
              </div>
              <h2 className="font-display text-5xl md:text-7xl font-black leading-[1] uppercase">TENS M2<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-clinic-blue to-clinic-cyan">RELIEF PLATFORM</span></h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">The intersection of physiotherapy and at-home recovery. Our TENS platform delivers targeted therapeutic electrical stimulation for deep tissue fatigue.</p>
              <button className="bg-white text-clinic-navy font-black px-12 py-5 uppercase tracking-widest text-xs rounded-2xl hover:bg-clinic-cyan transition-all shadow-2xl active:scale-95">
                Clinical Trial →
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50, rotate: 5 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex-1 relative flex justify-center z-10"
            >
              <div className="w-64 h-64 md:w-[480px] md:h-[480px] rounded-full border border-white/5 flex items-center justify-center p-8 bg-white/5 relative group cursor-pointer">
                 <div className="absolute inset-0 bg-clinic-blue/20 blur-[100px] animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                 
                 <motion.img 
                  src="https://files.cdn-files-a.com/uploads/10385685/800_67cfa44eb4e24.png"
                  alt="EZStep TENS M2 Clinical Recovery Device"
                  loading="lazy"
                  whileHover={{ scale: 1.05, rotate: -3 }}
                  className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20"
                  referrerPolicy="no-referrer"
                 />

                 <div className="absolute inset-4 rounded-full border border-white/10 animate-[spin_20s_linear_infinite] opacity-50" />
                 <div className="absolute inset-10 rounded-full border border-white/5 animate-[spin_30s_linear_infinite_reverse] opacity-50" />
                 
                 {/* Floating UI Indicators */}
                 <div className="absolute top-10 right-0 bg-clinic-cyan/20 backdrop-blur-md px-4 py-2 rounded-lg border border-clinic-cyan/30 text-[9px] font-black tracking-widest">
                   PULSE: 85Hz
                 </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials - THE CLINICAL PROOF */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
             <div className="inline-flex items-center px-4 py-2 bg-clinic-blue/5 text-clinic-blue border border-clinic-blue/20 rounded-full text-[10px] font-bold uppercase tracking-widest mx-auto">Case Studies</div>
             <h2 className="font-display text-4xl font-black text-clinic-navy uppercase">CLINICALLY VERIFIED RESULTS</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { n: 'Jerome D.', r: 'Athlete', t: '"The clinical precision is unmatched. Reduced my PR fatigue instantly."', i: '👟' },
              { n: 'Vince G.', r: 'Field Specialist', t: '"Finally, a solution that doesn\'t just pad the foot but actually aligns the gait."', i: '🚶' },
              { n: 'Angel M.', r: 'Medical Prof.', t: '"Corrected my flat feet biomechanics where others failed. 5-star clinical care."', i: '🏥' }
            ].map((caseStudy, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="medical-card p-10 flex flex-col h-full bg-slate-50/30 border-none shadow-none hover:bg-white hover:shadow-2xl transition-all"
              >
                <div className="text-3xl mb-6">{caseStudy.i}</div>
                <p className="text-slate-600 font-medium italic leading-[1.8] flex-1">"{caseStudy.t}"</p>
                <div className="pt-8 mt-8 border-t border-slate-100 flex items-center gap-4">
                   <div className="w-10 h-10 bg-clinic-navy rounded-full flex items-center justify-center font-bold text-white text-[10px]">{caseStudy.n[0]}</div>
                   <div>
                     <div className="font-bold text-clinic-navy text-xs uppercase tracking-widest">{caseStudy.n}</div>
                     <div className="text-[10px] text-slate-400 font-bold uppercase">{caseStudy.r}</div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance & Transformation Journey */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-32 px-6 bg-slate-50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,98,255,0.05),transparent_50%)]" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <h2 className="font-display text-5xl font-black text-clinic-navy uppercase tracking-tighter">THE CLINICAL JOURNEY</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">From Diagnostic Scan to Permanent Relief</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 md:gap-12 relative px-4 md:px-0">
            <div className="hidden lg:block absolute top-[40%] left-0 w-full h-px bg-slate-200 -z-0" />
            
            {[
              { 
                step: "01", 
                title: "FREE VOXEL SCAN", 
                desc: "Complimentary digital analysis assessing your arch type, weight distribution, and 25,000 pressure points for total mechanical mapped precision.",
                img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800", // Diagnostic Scan
                icon: <PremiumFootScan className="w-6 h-6" />
              },
              { 
                step: "02", 
                title: "PRECISION MILLING", 
                desc: "Medical-grade EVA units are sculpted using CAD/CAM engineering to meet your prescribed therapeutic alignment requirements.",
                img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800", // Precision lab
                icon: <PremiumPulse className="w-6 h-6" />
              },
              { 
                step: "03", 
                title: "INSTANT COMFORT", 
                desc: "Experience immediate correction. Your gait is re-balanced, eliminating chronic pain in feet, knees, and lower back.",
                img: "https://images.unsplash.com/photo-1434493907317-a46b53b81844?auto=format&fit=crop&q=80&w=800", // Active relief/walking
                icon: <PremiumAlignment className="w-6 h-6" />
              }
            ].map((node, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 relative group z-10 hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="relative h-64 md:h-72 rounded-[2rem] overflow-hidden">
                   <img 
                    src={node.img} 
                    alt={node.title} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-clinic-navy/80 to-transparent opacity-60" />
                   <div className="absolute top-6 left-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center font-display font-black text-clinic-navy text-sm md:text-base shadow-lg">
                      {node.step}
                   </div>
                </div>
                <div className="p-6 md:p-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-clinic-bg flex items-center justify-center border border-slate-100 shadow-sm group-hover:bg-clinic-blue group-hover:text-white transition-all">
                      {node.icon}
                    </div>
                    <h3 className="font-display font-black text-lg md:text-xl text-clinic-navy uppercase leading-none tracking-tight">{node.title}</h3>
                  </div>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">{node.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Locations - THE CLINIC NETWORK */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        id="branches" 
        className="py-32 px-6 bg-white border-y border-slate-100"
      >
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-2 bg-clinic-blue/5 text-clinic-blue border border-clinic-blue/20 rounded-full text-[10px] font-bold uppercase tracking-widest mx-auto">Clinic Network</div>
            <h2 className="font-display text-5xl md:text-6xl font-black text-clinic-navy leading-[1.1] uppercase">OUR RETAIL BOOTHS</h2>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">Visit us at these premium locations for a complimentary digital gait analysis and personalized orthotic consultation.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {BRANCHES.map((b, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col justify-end p-8"
              >
                <img 
                  src={b.image} 
                  alt={`EZStep Clinic Location at ${b.name}`} 
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-clinic-navy via-clinic-navy/20 to-transparent group-hover:via-clinic-navy/40 transition-colors" />
                
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-xl">
                        {b.icon}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight group-hover:text-clinic-cyan transition-colors">{b.name}</h3>
                      <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{b.mall}</p>
                    </div>

                    <p className="text-white/80 text-xs font-medium leading-relaxed max-w-[200px]">
                      {b.loc}
                    </p>

                    <div className="pt-4 flex items-center justify-between border-t border-white/10">
                      <a href={`tel:${b.phone}`} className="text-clinic-cyan font-bold text-[11px] tracking-tighter hover:underline">
                        {b.phone}
                      </a>
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-clinic-navy shadow-lg">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="medical-card !bg-clinic-navy p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,180,216,0.1),transparent_50%)]" />
            <div className="relative z-10 space-y-4 text-center md:text-left">
              <h3 className="font-display text-3xl font-black uppercase">NO APPOINTMENT NECESSARY</h3>
              <p className="text-slate-400 font-medium max-w-lg">Walk into any of our booths for a 5-minute <span className="text-white font-bold italic">FREE VOXEL SCAN</span>. Our clinical specialists are ready to analyze your gait metrics on the spot.</p>
            </div>
            <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer" className="relative z-10">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(0,98,255,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-clinic-blue text-white font-black py-5 px-12 rounded-2xl uppercase tracking-[0.2em] text-xs hover:bg-clinic-cyan transition-all shadow-2xl whitespace-nowrap"
              >
                Find Nearest Booth
              </motion.button>
            </a>
          </motion.div>
        </div>
      </motion.section>
      </main>

      {/* Footer - Professional & Trusted */}
      <footer aria-label="Footer" className="py-24 px-6 bg-clinic-navy border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="space-y-10">
            <Logo />
            <p className="text-slate-400 text-[10px] leading-relaxed font-bold uppercase tracking-[0.2em]">
              The Philippines' leading expert in medical orthotics. Correcting biomechanics through Spain's VOXELCARE engineering since 2018.
            </p>
            <div className="space-y-2">
              {SOCIALS.phones.map(p => (
                <a key={p} href={`tel:${p}`} className="flex items-center gap-3 text-slate-500 hover:text-clinic-blue transition-colors group">
                  <Phone className="w-4 h-4 text-clinic-blue group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold font-mono">{p}</span>
                </a>
              ))}
            </div>
            <div className="flex gap-4">
               {[
                 {Icon: Facebook, url: SOCIALS.facebook},
                 {Icon: Instagram, url: SOCIALS.instagram}
               ].map(({Icon, url}, i) => (
                 <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 hover:text-clinic-blue hover:border-clinic-blue transition-all shadow-sm">
                   <Icon className="w-4 h-4" />
                 </a>
               ))}
            </div>
          </div>

          {[
            { t: 'The Methodology', l: ['3D Gait Scan', 'VOXELCARE Platform', 'Correction Theory', 'Same-Day Ready'] },
            { t: 'Product Range', l: ['EZActive Sport', 'Comfort Pro', 'Ortho Relief', 'TENS M2 Unit'] },
            { t: 'Clinic Network', l: ['One Ayala', 'SM Mall of Asia', 'SM North Annex'] }
          ].map((col, i) => (
            <div key={i} className="space-y-8">
              <h5 className="font-display font-black text-[11px] uppercase tracking-[0.2em] text-clinic-navy border-b border-slate-100 pb-4">
                {col.t}
              </h5>
              <ul className="space-y-4">
                {col.l.map(link => <li key={link}><a href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-clinic-blue transition-all">{link}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
          <span>© 2026 EZSTEP PHILIPPINES · BIO-ORTHOPEDIC DIVISION</span>
          <div className="flex gap-10">
            <a href="#" className="hover:text-clinic-blue">Privacy Assessment</a>
            <a href="#" className="hover:text-clinic-blue">Terms of Service</a>
          </div>
        </div>
      </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

