/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { OrthoticVisualizerMachine } from './components/OrthoticVisualizerMachine';
import { Logo } from './components/Logo';
import { SplashScreen } from './components/SplashScreen';
import { BlogSection } from './components/BlogSection';
import { TheDifferenceSection } from './components/TheDifferenceSection';

import { BranchModal } from './components/BranchModal';
import { LiquidCursor } from './components/LiquidCursor';
import { MissionVisionSection } from './components/MissionVisionSection';
import { BookingModal } from './components/BookingModal';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { Chatbot } from './components/Chatbot';
import { AuthModal } from './components/AuthModal';
import { PatientPortal } from './components/PatientPortal';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';

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
    id: 'one-ayala',
    name: 'ONE AYALA', 
    mall: 'Ayala Malls',
    loc: '3/L, One Ayala Malls', 
    fullAddress: '3rd Level, One Ayala Malls, Ayala Ave cor. EDSA, Makati City',
    icon: '🏢', 
    phone: '+63 995 032 2139',
    hours: '11 AM - 9 PM',
    image: '/src/assets/images/regenerated_image_1778927218408.png'
  },
  { 
    id: 'sm-mall-of-asia',
    name: 'SM MALL OF ASIA', 
    mall: 'North Entertainment Mall',
    loc: '2/L, North Entertainment Mall', 
    fullAddress: '2nd Level, North Entertainment Mall (Near IMAX), SM Mall of Asia, Pasay City',
    icon: '🌊', 
    phone: '+63 926 969 6758',
    hours: '11 AM - 9 PM',
    image: '/src/assets/images/regenerated_image_1778927223942.png'
  },
  { 
    id: 'sm-north-annex',
    name: 'SM NORTH ANNEX', 
    mall: 'SM City North EDSA',
    loc: '2/L, SM City North EDSA Annex 1', 
    fullAddress: '2nd Level, SM City North EDSA Annex 1 (Near Cyberzone), Quezon City',
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
  const [view, setView] = useState<'landing' | 'portal'>('landing');
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingBranch, setBookingBranch] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [pendingBookingAction, setPendingBookingAction] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && pendingBookingAction) {
        setIsBookingOpen(true);
        setPendingBookingAction(false);
      }
      if (!currentUser && view === 'portal') {
        setView('landing');
      }
    });
    return () => unsubscribe();
  }, [view, pendingBookingAction]);

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleOpenBooking = (branch: any = null) => {
    if (!user) {
      setBookingBranch(branch);
      setPendingBookingAction(true);
      openAuth('register');
      return;
    }
    setBookingBranch(branch);
    setIsBookingOpen(true);
    setSelectedBranch(null); // Close branch modal if open
  };

  return (
    <div className="font-sans text-slate-900 bg-white min-h-screen relative">
      <LiquidCursor />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <SplashScreen key="splash" onComplete={() => setIsLoading(false)} />
        ) : view === 'portal' ? (
          <PatientPortal key="portal" onBack={() => setView('landing')} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <BranchModal 
              branch={selectedBranch} 
              onClose={() => setSelectedBranch(null)} 
              onBook={handleOpenBooking}
            />
            <BookingModal 
              isOpen={isBookingOpen} 
              onClose={() => setIsBookingOpen(false)}
              initialBranch={bookingBranch}
              branches={BRANCHES}
            />
            <AuthModal 
              isOpen={isAuthOpen} 
              onClose={() => {
                setIsAuthOpen(false);
                setPendingBookingAction(false);
              }} 
              initialMode={authMode}
              message={pendingBookingAction ? "Initialize your clinical profile to secure your bio-slot and biometric archive." : undefined}
            />
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
                      { n: 'Blog', h: '#blog' },
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

                  <div className="flex items-center gap-4">
                    {user ? (
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-[9px] font-black text-clinic-navy uppercase tracking-tight">{user.displayName || 'Patient Account'}</p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">EZSTEP SYNC ACTIVE</p>
                        </div>
                        <div className="flex gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setView('portal')}
                            className="bg-clinic-navy text-white px-5 py-3 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-clinic-blue transition-all shadow-lg shadow-clinic-navy/20"
                          >
                            Archive
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => signOut(auth)}
                            className="px-4 py-2 border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all"
                          >
                            Sign Out
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openAuth('login')}
                        className="text-[10px] font-black text-clinic-navy uppercase tracking-widest px-6 py-3 border border-slate-100 rounded-full hover:bg-slate-50 transition-all"
                      >
                        Portal Access
                      </motion.button>
                    )}
                    <motion.button 
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 25px 50px rgba(0, 98, 255, 0.3)",
                        y: -2
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOpenBooking()}
                      className="bg-clinic-blue text-white font-bold text-[10px] uppercase tracking-widest px-7 py-3 rounded-full transition-all shadow-lg active:shadow-inner"
                    >
                      Book Assessment
                    </motion.button>
                  </div>
                </div>
              </nav>
            </header>

      <main className="relative">
        {/* Hero Section - Pure Clinical Precision */}
        <section id="hero" className="relative min-h-screen flex items-center pt-32 lg:pt-40 overflow-hidden bg-white">
        <ThreeHero />
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 xl:gap-24 2xl:gap-32 items-center relative z-10 py-20 lg:py-32">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-clinic-blue/5 border border-clinic-blue/10 px-4 py-2 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-clinic-blue" />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-clinic-blue">Bio-Orthopedic Manufacturing Excellence</span>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[7.5rem] font-black leading-[0.95] md:leading-[0.9] text-clinic-navy tracking-tighter"
            >
              PRECISION <br />
              <span className="text-clinic-blue italic">ALIGNMENT.</span><br />
              ZERO PAIN.
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="space-y-4"
            >
              <p className="text-slate-600 max-w-lg text-xl md:text-2xl leading-relaxed font-serif italic">
                EZStep Clinical Orthotics transforms bio-data into therapeutic relief.
              </p>
              <p className="text-slate-400 max-w-lg text-xs md:text-sm font-bold uppercase tracking-[0.3em]">
                Experience our <span className="text-clinic-blue">Free Foot Scan & Consultation</span> available at all branches.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOpenBooking()}
                className="bg-clinic-navy text-white font-black px-12 py-5 uppercase tracking-widest text-xs rounded-2xl shadow-2xl hover:bg-clinic-blue transition-colors group"
              >
                Free Clinical Scan <ArrowRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <a href="#products">
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(248, 250, 252, 1)" }}
                  whileTap={{ scale: 0.98 }}
                  className="border-2 border-slate-100 text-slate-600 font-bold px-10 py-5 uppercase tracking-widest text-xs rounded-2xl transition-colors"
                >
                  Our Methodology
                </motion.button>
              </a>
            </motion.div>
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

      <div id="technology" role="region" aria-label="Clinical Technology" className="relative">
        <motion.div
           initial={{ opacity: 0, y: 100 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-200px" }}
           transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <TechnologySection />
        </motion.div>
      </div>

      <ClinicalShowcase />
      <TheDifferenceSection />

      <MissionVisionSection />
      <TestimonialsSection />
      <FAQSection />

      <Chatbot />

      <BlogSection />

      {/* Pain Analysis - VIRTUAL SPECIALIST INTERFACE */}
          <motion.div 
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            id="pain-guide" 
            aria-label="Virtual Orthotic Specialist"
            className="py-32 px-6 bg-slate-950 overflow-hidden relative"
          >
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,255,0.05),transparent_70%)]" />
        </div>

        <div 
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" 
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-20 space-y-6"
          >
            <div className="inline-flex items-center px-4 py-1.5 bg-clinic-blue/10 text-clinic-blue border border-clinic-blue/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
              Proprietary Diagnostic Engine
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-black text-white uppercase leading-[0.9] tracking-tight">
              VIRTUAL ORTHOTIC <br />
              <span className="text-clinic-cyan italic font-serif lowercase">Specialist</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl font-serif italic leading-relaxed max-w-2xl mx-auto">
              "Your pain has a fingerprint. Standard solutions ignore the biometric data. Our Spain-engineered engine transforms your specific pain markers into clinical-grade therapeutic armor."
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <OrthoticVisualizerMachine />
          </motion.div>
        </div>
      </motion.div>

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

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            className="grid md:grid-cols-3 gap-8"
          >
            {PRODUCTS.map((prod, i) => (
              <motion.div 
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.95, filter: 'blur(10px)' },
                  show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
                
                <div className="p-6 sm:p-10 space-y-6 flex-1 flex flex-col">
                  <div className="space-y-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="inline-block px-3 py-1 bg-clinic-blue/5 border border-clinic-blue/10 rounded-full text-[9px] font-bold text-clinic-blue tracking-[0.2em] uppercase">
                        {prod.badge}
                      </div>
                      <Award className="w-5 h-5 text-slate-300 group-hover:text-clinic-blue transition-colors" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-display text-xl sm:text-2xl font-black text-clinic-navy group-hover:text-clinic-blue transition-colors uppercase tracking-tight">{prod.title}</h3>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{prod.type}</p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">{prod.desc}</p>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      {prod.tags.map(t => <span key={t} className="text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-md text-slate-500 border border-slate-200/50">{t}</span>)}
                    </div>
                  </div>

                  <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-slate-100 flex items-center justify-between">
                    <div className="font-display font-black text-clinic-navy">{prod.price}</div>
                    <button className="bg-clinic-blue text-white w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-clinic-blue/20">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* TENS Massager - CLINICAL RECOVERY UNIT */}
      <motion.section 
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="py-24 px-6 bg-white overflow-hidden relative"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative medical-card !bg-clinic-navy p-8 sm:p-12 lg:p-24 overflow-hidden border-none text-white flex flex-col lg:flex-row items-center gap-12 lg:gap-20 shadow-[0_50px_100px_rgba(0,0,0,0.3)]"
          >
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-clinic-blue/10 blur-[150px] -z-1 rounded-full" />
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex-1 space-y-6 md:space-y-8 z-10 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 text-clinic-cyan font-bold text-xs uppercase tracking-[0.3em]">
                <Zap className="w-4 h-4" /> Systemic Recovery Unit
              </div>
              <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-black leading-[1] uppercase">TENS M2<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-clinic-blue to-clinic-cyan">RELIEF PLATFORM</span></h2>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-md font-medium mx-auto lg:mx-0">The intersection of physiotherapy and at-home recovery. Our TENS platform delivers targeted therapeutic electrical stimulation for deep tissue fatigue.</p>
              <button 
                onClick={() => handleOpenBooking()}
                className="bg-white text-clinic-navy font-black px-10 py-4 md:px-12 md:py-5 uppercase tracking-widest text-xs rounded-2xl hover:bg-clinic-cyan transition-all shadow-2xl active:scale-95"
              >
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

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="grid md:grid-cols-3 gap-8"
          >
            {BRANCHES.map((b, i) => (
              <motion.div 
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 40, x: i % 2 === 0 ? -40 : 40, filter: 'blur(10px)' },
                  show: { opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }
                }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => setSelectedBranch(b)}
                className="group relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col justify-end p-8 cursor-pointer"
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
          </motion.div>

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
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(0,98,255,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenBooking()}
              className="bg-clinic-blue text-white font-black py-5 px-12 rounded-2xl uppercase tracking-[0.2em] text-xs hover:bg-clinic-cyan transition-all shadow-2xl whitespace-nowrap"
            >
              Find Nearest Booth
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
      </main>

      {/* Footer - Professional & Trusted */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        aria-label="Footer" 
        className="py-24 px-6 bg-clinic-navy border-t border-white/5"
      >
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
      </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

