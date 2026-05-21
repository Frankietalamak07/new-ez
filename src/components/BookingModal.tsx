import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  MapPin,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { 
  format, 
  addDays, 
  startOfToday, 
  isSameDay, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isBefore, 
  isAfter, 
  startOfDay,
  addMonths,
  subMonths,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  isToday,
  getDay,
  parse
} from 'date-fns';
import { db, auth } from '../lib/firebase';
import { collection, query, where, getDocs, setDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { generateGoogleCalendarUrl } from '../lib/calendar';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBranch?: any;
  branches: any[];
}

const TIME_SLOTS = [
  "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", 
  "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", 
  "07:00 PM", "08:00 PM"
];

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, initialBranch, branches }) => {
  const [step, setStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState(initialBranch || null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [upsellData, setUpsellData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthSyncing, setIsAuthSyncing] = useState(false);

  // Fetch booked slots when date or branch changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedBranch || !selectedDate) return;
      
      setIsLoadingSlots(true);
      try {
        const q = query(
          collection(db, 'bookings'),
          where('clinicId', '==', selectedBranch.id),
          where('date', '==', format(selectedDate, 'yyyy-MM-dd'))
        );
        const snapshot = await getDocs(q);
        const booked = snapshot.docs
          .map(doc => doc.data())
          .filter(data => data.status !== 'cancelled')
          .map(data => data.timeSlot);
        setBookedSlots(booked);
      } catch (err) {
        console.error("Error fetching slots:", err);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    if (step === 2) {
      fetchSlots();
    }
  }, [selectedDate, selectedBranch, step]);

  useEffect(() => {
    if (auth.currentUser && step === 3) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || auth.currentUser?.displayName || '',
        email: prev.email || auth.currentUser?.email || '',
      }));
    }
  }, [auth.currentUser, step]);

  useEffect(() => {
    if (initialBranch) {
      setSelectedBranch(initialBranch);
    }
  }, [initialBranch]);

  const handleNextStep = () => {
    if (step === 1 && !selectedBranch) return;
    if (step === 2 && (!selectedDate || !selectedTime)) return;
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleBooking = async () => {
    if (!selectedBranch || !selectedDate || !selectedTime) return;

    // Simple validation
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Please enter a valid clinical email address.");
      return;
    }
    if (formData.phone.length < 10) {
      setError("Contact number is too short for system registration.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Use a deterministic ID to prevent double bookings even with race conditions
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const bookingId = `${selectedBranch.id}_${dateStr}_${selectedTime.replace(/\s/g, '')}`.toLowerCase();
      const docRef = doc(db, 'bookings', bookingId);
      
      // Check if ID already exists (Final verification)
      const existingDoc = await getDoc(docRef);
      if (existingDoc.exists()) {
        setError("Synchronization Error: This bio-slot was just secured by another patient. Please select an alternative window.");
        setIsSubmitting(false);
        setStep(2); // Send back to schedule
        return;
      }

      // Save to Firebase
      await setDoc(docRef, {
        id: bookingId,
        clinicId: selectedBranch.id,
        clinicName: selectedBranch.name,
        date: dateStr,
        timeSlot: selectedTime,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        userId: auth.currentUser?.uid || null,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      setBookingRef(bookingId);
      setStep(4);

      // 2. Trigger Automation
      fetch('/api/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          branchName: selectedBranch.name,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime
        }),
      }).then(res => res.json()).then(data => {
        if (data.upsell) {
          setUpsellData(data.upsell);
        }
      }).catch(err => {
        console.error("Automation error:", err);
      });
      
    } catch (err: any) {
      setError("Failed to secure appointment. Please try again or call our hotline for priority sync.");
      handleFirestoreError(err, OperationType.WRITE, 'bookings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (isBefore(startOfDay(date), startOfToday())) return true;
    
    // Disable Sundays (example of clinic schedule)
    if (getDay(date) === 0) return true;

    // Limit to 3 months ahead
    if (isAfter(date, addMonths(startOfToday(), 3))) return true;

    return false;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-clinic-navy/80 backdrop-blur-xl pointer-events-auto"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] bg-white rounded-[40px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row pointer-events-auto"
        >
          {/* Sidebar: Progress & Info */}
          <div className="md:w-1/3 bg-clinic-navy p-6 md:p-12 text-white flex flex-col justify-between relative overflow-hidden flex-shrink-0">
             {/* Background Pattern */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-clinic-blue/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
             
             <div className="relative z-10 space-y-12">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                    <CalendarIcon className="w-4 h-4 text-clinic-cyan" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Clinical Assessment</span>
                  </div>
                  <h2 className="text-3xl font-display font-black uppercase leading-tight">
                    Secure Your <br />
                    <span className="text-clinic-cyan italic">Voxel Scan.</span>
                  </h2>
                </div>

                <div className="space-y-6">
                  {[
                    { s: 1, l: 'Location Selection', d: 'Choose your nearest clinic booth' },
                    { s: 2, l: 'Schedule Scan', d: 'Select date & 20-min bio-slot' },
                    { s: 3, l: 'Patient Info', d: 'Basic contact for confirmation' },
                  ].map((item) => (
                    <div key={item.s} className={`flex gap-6 items-start transition-opacity duration-500 ${step < item.s ? 'opacity-30' : 'opacity-100'}`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-colors duration-500 flex-shrink-0 ${step >= item.s ? 'bg-clinic-blue text-white shadow-lg shadow-clinic-blue/30' : 'bg-white/10 text-white/40'}`}>
                        {step > item.s ? (
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </motion.div>
                        ) : item.s}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black uppercase tracking-widest">{item.l}</p>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="relative z-10 pt-12 border-t border-white/5">
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em] leading-relaxed">
                  Real-time synchronization with clinical engineering schedules. Assessments are 100% free and non-binding.
                </p>
             </div>
          </div>

          {/* Main Content: Steps */}
          <div className="flex-1 flex flex-col min-h-0 bg-white relative">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-clinic-navy transition-colors z-[30]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-clinic-navy uppercase tracking-tight">Select Clinic Booth</h3>
                       <p className="text-slate-500 font-medium text-sm">Choose the location where you'll conduct your biomechanical assessment.</p>
                    </div>

                    <div className="grid gap-4">
                      {branches.map((branch) => (
                        <button
                          key={branch.name}
                          onClick={() => setSelectedBranch(branch)}
                          className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all text-left group ${
                            selectedBranch?.name === branch.name 
                            ? 'border-clinic-blue bg-clinic-blue/5' 
                            : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-colors ${selectedBranch?.name === branch.name ? 'bg-clinic-blue text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                            {branch.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-black uppercase tracking-tight transition-colors ${selectedBranch?.name === branch.name ? 'text-clinic-navy' : 'text-slate-600'}`}>
                              {branch.name}
                            </h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{branch.mall} • {branch.hours}</p>
                          </div>
                          {selectedBranch?.name === branch.name && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 bg-clinic-blue rounded-full flex items-center justify-center text-white">
                              <CheckCircle2 className="w-4 h-4" />
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-clinic-navy uppercase tracking-tight">Deployment Window</h3>
                       <p className="text-slate-500 font-medium text-sm">Select a date and time that fits your schedule.</p>
                    </div>
                    <div className="space-y-6">
                       {/* Date Calendar UI */}
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <CalendarIcon className="w-3 h-3" /> Select Assessment Date
                            </label>
                            
                            <div className="flex gap-2">
                              <button 
                                onClick={prevMonth}
                                disabled={isSameMonth(currentMonth, startOfToday())}
                                className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-clinic-navy disabled:opacity-30"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase text-clinic-navy min-w-[120px] text-center">
                                {format(currentMonth, 'MMMM yyyy')}
                              </div>
                              <button 
                                onClick={nextMonth}
                                className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-clinic-navy"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
                             <div className="grid grid-cols-7 gap-1 mb-4">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                  <div key={day} className="text-[9px] font-black text-slate-300 uppercase tracking-widest text-center py-2">
                                     {day}
                                  </div>
                                ))}
                             </div>
                             <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map((date, i) => {
                                   const disabled = isDateDisabled(date);
                                   const isSelected = isSameDay(date, selectedDate);
                                   const isCurrentMonth = isSameMonth(date, currentMonth);
                                   const isTodayDate = isToday(date);

                                   return (
                                     <button
                                       key={i}
                                       disabled={disabled}
                                       onClick={() => setSelectedDate(date)}
                                       className={`
                                         aspect-square flex flex-col items-center justify-center rounded-xl text-[11px] font-bold transition-all relative
                                         ${isSelected ? 'bg-clinic-navy text-white shadow-lg z-10 scale-105' : ''}
                                         ${!isSelected && !disabled && isCurrentMonth ? 'text-slate-600 hover:bg-slate-100' : ''}
                                         ${!isCurrentMonth ? 'text-slate-300' : ''}
                                         ${disabled ? 'text-slate-200 cursor-not-allowed' : ''}
                                       `}
                                     >
                                       {format(date, 'd')}
                                       {isTodayDate && !isSelected && (
                                         <div className="absolute bottom-1 w-1 h-1 bg-clinic-blue rounded-full" />
                                       )}
                                       {disabled && isCurrentMonth && (
                                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                                            <div className="w-full h-[1px] bg-red-500 rotate-45" />
                                         </div>
                                       )}
                                     </button>
                                   );
                                })}
                             </div>
                          </div>
                          
                          {getDay(selectedDate) === 0 && (
                             <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                               <AlertCircle className="w-3 h-3" /> Clinics are closed on Sundays for maintenance.
                             </p>
                          )}
                       </div>

                       {/* Time Slots Grid */}
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-3 h-3" /> Available Slots for {format(selectedDate, 'MMM d')}
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 relative min-h-[100px]">
                             {isLoadingSlots && (
                               <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl border border-slate-100">
                                 <div className="flex items-center gap-2">
                                   <Loader2 className="w-4 h-4 animate-spin text-clinic-blue" />
                                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Syncing Slots...</span>
                                 </div>
                               </div>
                             )}
                             {TIME_SLOTS.map((time) => {
                               const isBooked = bookedSlots.includes(time);
                               return (
                                 <button
                                   key={time}
                                   disabled={isBooked}
                                   onClick={() => setSelectedTime(time)}
                                   className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all relative overflow-hidden group ${
                                     selectedTime === time
                                     ? 'bg-clinic-blue border-clinic-blue text-white shadow-lg'
                                     : isBooked
                                     ? 'bg-slate-100 border-transparent text-slate-300 cursor-not-allowed'
                                     : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                   }`}
                                 >
                                   <span className="relative z-10">{time}</span>
                                   {isBooked && (
                                     <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                       <div className="w-12 h-[1px] bg-red-500 rotate-12" />
                                     </div>
                                   )}
                                   {selectedTime === time && (
                                     <motion.div 
                                       layoutId="timeGlow"
                                       className="absolute inset-0 bg-gradient-to-r from-clinic-cyan/20 to-transparent pointer-events-none" 
                                     />
                                   )}
                                 </button>
                               );
                             })}
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-clinic-navy uppercase tracking-tight">Patient Verification</h3>
                       <p className="text-slate-500 font-medium text-sm">Verify your clinical contact details to synchronize your archive.</p>
                    </div>

                    <div className="space-y-4">
                       <div className="bg-clinic-navy/5 p-6 rounded-[2rem] border border-clinic-navy/5">
                          <div className="flex gap-4 items-center">
                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100">
                               {selectedBranch.icon}
                             </div>
                             <div>
                                <h4 className="text-xs font-black text-clinic-navy uppercase tracking-tight">{selectedBranch.name}</h4>
                                <p className="text-[10px] font-black text-clinic-blue uppercase tracking-widest">{format(selectedDate, 'MMMM d, yyyy')} @ {selectedTime}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <User className="w-3 h-3" /> FULL NAME
                          </label>
                          <div className="relative">
                             <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                             <input 
                               type="text"
                               placeholder="Enter your full name"
                               value={formData.name}
                               onChange={(e) => setFormData({...formData, name: e.target.value})}
                               className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-8 py-5 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:border-clinic-blue/40 transition-all text-clinic-navy"
                             />
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                               <Phone className="w-3 h-3" /> PHONE NUMBER
                            </label>
                            <div className="relative">
                               <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                               <input 
                                 type="tel"
                                 placeholder="+63 9XX XXX XXXX"
                                 value={formData.phone}
                                 onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-8 py-5 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:border-clinic-blue/40 transition-all text-clinic-navy"
                               />
                            </div>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                               <Mail className="w-3 h-3" /> EMAIL ADDRESS
                            </label>
                            <div className="relative">
                               <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                               <input 
                                 type="email"
                                 placeholder="your@email.com"
                                 value={formData.email}
                                 onChange={(e) => setFormData({...formData, email: e.target.value})}
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-8 py-5 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:border-clinic-blue/40 transition-all text-clinic-navy"
                               />
                            </div>
                         </div>
                       </div>
                    </div>

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-3 items-center text-red-600 text-[10px] font-bold uppercase tracking-widest"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                      </motion.div>
                    )}

                    <div className="bg-clinic-blue/5 p-6 rounded-[2rem] border border-clinic-blue/10 flex items-start gap-4">
                        <Sparkles className="w-5 h-5 text-clinic-blue shrink-0 mt-1" />
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-clinic-navy uppercase tracking-tight">Real-time Biometric Slot Protection</p>
                           <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                             By confirming, you authorize EZStep to reserve this 20-minute clinical window and initialize your bio-archive.
                           </p>
                        </div>
                    </div>
                  </motion.div>
                )}                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center space-y-8 py-4"
                  >
                    <div className="w-20 h-20 bg-clinic-cyan/10 rounded-[2rem] flex items-center justify-center relative">
                       <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10, delay: 0.2 }}
                        className="w-full h-full bg-clinic-cyan/20 absolute inset-0 rounded-[2rem] animate-ping"
                       />
                       <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          type: 'spring', 
                          stiffness: 260, 
                          damping: 20,
                          delay: 0.3 
                        }}
                        className="relative z-10"
                       >
                        <CheckCircle2 className="w-10 h-10 text-clinic-blue" />
                       </motion.div>
                    </div>
                    
                    <div className="space-y-4">
                       <h3 className="text-3xl font-display font-black text-clinic-navy uppercase tracking-tighter">Bio-Archive Initialized</h3>
                       <p className="text-slate-500 max-w-sm mx-auto font-medium text-xs leading-relaxed uppercase tracking-widest">
                         Your assessment is reserved. Confirmation protocol dispatched to <span className="text-clinic-blue font-black">{formData.email}</span>.
                       </p>
                    </div>

                    <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 space-y-4 text-left">
                            <div className="flex items-center gap-2 mb-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                               <span className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.2em]">Live Reservation</span>
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clinic Hub</p>
                               <p className="text-lg font-black text-clinic-navy uppercase tracking-tight">{selectedBranch.name}</p>
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Neural Slot</p>
                               <div className="flex items-center gap-2">
                                  <CalendarIcon className="w-4 h-4 text-clinic-blue" />
                                  <p className="text-sm font-black text-clinic-navy uppercase">{format(selectedDate, 'MMM d, yyyy')} @ {selectedTime}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                           <button
                             onClick={() => {
                               const start = parse(`${format(selectedDate, 'yyyy-MM-dd')} ${selectedTime}`, 'yyyy-MM-dd h:mm a', new Date());
                               const url = generateGoogleCalendarUrl({
                                 title: `EZStep Assessment: ${selectedBranch.name}`,
                                 description: `Clinical bio-orthopedic assessment for ${formData.name}. Please bring your current daily footwear.`,
                                 location: selectedBranch.name,
                                 start,
                                 duration: 45
                               });
                               window.open(url, '_blank');
                             }}
                             className="flex-1 px-8 bg-clinic-blue text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-clinic-cyan transition-all flex items-center justify-center gap-3 shadow-xl shadow-clinic-blue/20 group"
                           >
                             <CalendarIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                             Add to Neural Calendar
                           </button>
                           <button
                             onClick={onClose}
                             className="flex-1 px-8 bg-clinic-navy text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-clinic-blue transition-all flex items-center justify-center gap-3"
                           >
                             Return to Archive
                           </button>
                        </div>
                    </div>

                    <div className="w-full max-w-2xl mt-4">
                       {/* Recommended Product / AI Upsell Card */}
                       {upsellData ? (
                         <motion.div 
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: 0.3 }}
                           className="bg-clinic-navy p-6 rounded-[2.5rem] border border-clinic-blue/30 text-left relative overflow-hidden group"
                         >
                            <div className="absolute top-0 right-0 p-4">
                               <Sparkles className="w-4 h-4 text-clinic-cyan animate-pulse" />
                            </div>
                            <div className="space-y-3 relative z-10">
                               <div className="text-[8px] font-black text-clinic-cyan uppercase tracking-[0.3em]">Recommended For You</div>
                               <h4 className="text-white font-black uppercase text-sm leading-tight tracking-tight group-hover:text-clinic-cyan transition-colors">
                                 {upsellData.suggestedProduct}
                               </h4>
                               <p className="text-[10px] text-white/60 leading-relaxed font-medium">
                                 {upsellData.upsellMessage}
                               </p>
                               <div className="pt-2">
                                  <div className="inline-block px-3 py-1 bg-white/10 rounded-lg border border-white/5 text-[9px] font-black text-white tracking-widest uppercase">
                                     Code: <span className="text-clinic-cyan">{upsellData.discountCode}</span>
                                  </div>
                               </div>
                            </div>
                         </motion.div>
                       ) : (
                         <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center space-y-3">
                            <Loader2 className="w-6 h-6 text-clinic-blue animate-spin" />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Generating personalized clinic recommendations...</p>
                         </div>
                       )}
                    </div>
 
                    <button 
                      onClick={onClose}
                      className="text-[9px] font-black text-clinic-blue uppercase tracking-[0.3em] hover:tracking-[0.4em] transition-all pt-4"
                    >
                      Return to Dashboard
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons - Sticky Footer */}
            {step < 4 && (
              <div className="p-6 md:p-8 border-t border-slate-100 flex justify-between items-center bg-white z-[25] flex-shrink-0">
                 <button
                   onClick={step === 1 ? onClose : handlePrevStep}
                   className="flex items-center gap-2 text-slate-400 hover:text-clinic-navy transition-colors text-[10px] font-black uppercase tracking-widest"
                 >
                   {step === 1 ? <X className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                   {step === 1 ? 'Cancel' : 'Prev'}
                 </button>

                 {step < 3 ? (
                   <motion.button
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     disabled={step === 1 ? !selectedBranch : !selectedTime}
                     onClick={handleNextStep}
                     className="bg-clinic-navy text-white px-6 md:px-10 py-4 md:py-5 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-clinic-navy/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-clinic-blue transition-colors"
                   >
                     Next <ChevronRight className="w-4 h-4" />
                   </motion.button>
                 ) : (
                   <motion.button
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     disabled={isSubmitting || !formData.name || !formData.phone || !formData.email}
                     onClick={handleBooking}
                     className="bg-clinic-blue text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-clinic-blue/30 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-clinic-cyan transition-colors"
                   >
                     {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                     {isSubmitting ? 'Securing...' : 'Confirm'}
                   </motion.button>
                 )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
