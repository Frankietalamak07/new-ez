import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Clock, Phone, Navigation, ExternalLink, Loader2 } from 'lucide-react';

interface Branch {
  name: string;
  mall: string;
  loc: string;
  fullAddress: string;
  icon: string;
  phone: string;
  hours: string;
  image: string;
  mapUrl?: string;
}

interface BranchModalProps {
  branch: Branch | null;
  onClose: () => void;
  onBook: (branch: Branch) => void;
}

export const BranchModal: React.FC<BranchModalProps> = ({ branch, onClose, onBook }) => {
  const [isBooking, setIsBooking] = useState(false);

  if (!branch) return null;

  const handleBook = async () => {
    setIsBooking(true);
    // Simulate a brief analysis/sync before opening the booking modal
    await new Promise(resolve => setTimeout(resolve, 800));
    onBook(branch);
    setIsBooking(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-clinic-navy/60 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-full"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Image & Branding */}
          <div className="md:w-1/2 relative h-64 md:h-auto">
            <img 
              src={branch.image} 
              alt={branch.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-clinic-navy/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-clinic-cyan bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">Official Clinic</span>
              <h2 className="text-white font-display text-3xl md:text-4xl font-black uppercase mt-4 leading-tight">
                {branch.name}
              </h2>
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="md:w-1/2 p-8 md:p-12 space-y-10 overflow-y-auto">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-clinic-blue">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Location Details</span>
                </div>
                <p className="text-slate-600 font-serif italic text-lg leading-relaxed">
                  {branch.fullAddress}
                </p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest pt-1">
                  {branch.loc}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-clinic-blue">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Operating Hours</span>
                  </div>
                  <p className="text-slate-600 font-bold text-sm tracking-tight">{branch.hours}</p>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Mon - Sun (Inc. Holidays)</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-clinic-blue">
                    <Phone className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Clinic Hotline</span>
                  </div>
                  <a href={`tel:${branch.phone}`} className="inline-block text-slate-800 font-black text-sm tracking-tight hover:text-clinic-blue transition-colors">
                    {branch.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-100">
               <div className="flex flex-col gap-4">
                 <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isBooking}
                  onClick={handleBook}
                  className="w-full bg-clinic-navy text-white text-[11px] font-black uppercase tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:bg-clinic-blue transition-colors disabled:opacity-50"
                 >
                   {isBooking ? (
                     <Loader2 className="w-4 h-4 animate-spin text-clinic-cyan" />
                   ) : (
                     <Navigation className="w-4 h-4" />
                   )}
                   {isBooking ? 'Analyzing Availability...' : 'Book Assessment Now'}
                 </motion.button>
                 <div className="flex gap-4">
                    <button 
                      className="flex-1 border-2 border-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.fullAddress)}`, '_blank')}
                    >
                      <MapPin className="w-3.5 h-3.5" /> View On Map
                    </button>
                    <button className="flex-1 border-2 border-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> Site Info
                    </button>
                 </div>
               </div>
            </div>

            <div className="pt-4">
              <p className="text-slate-300 text-[8px] font-black uppercase tracking-[0.3em] text-center leading-relaxed">
                clinical screening, digital gait analysis, and handcrafted custom orthotics production all available on-site.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const SOCIALS_FALLBACK = {
  facebook: 'https://www.facebook.com/ezstephofficial',
};
