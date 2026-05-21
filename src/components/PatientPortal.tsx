import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Loader2, 
  AlertCircle, 
  Activity,
  User,
  Database,
  ArrowLeft,
  ExternalLink,
  ClipboardCheck,
  Package,
  CheckCircle2,
  Shield,
  Edit2,
  Trash2,
  Settings,
  Check,
  X,
  Mail,
  Phone
} from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { 
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
  isToday,
  isSameDay,
  parse
} from 'date-fns';
import { generateGoogleCalendarUrl } from '../lib/calendar';

interface Booking {
  id: string;
  clinicId?: string;
  clinicName: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  userId?: string | null;
  createdAt: Timestamp;
}

interface Prescription {
  id: string;
  bookingId: string;
  materials: string[];
  modifications: string[];
  maintenance: string;
  wearSchedule: string;
}

interface PatientPortalProps {
  onBack: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({ onBack }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  
  // Admin & Edit capabilities
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMode, setAdminMode] = useState(false); // viewing 'All Bookings' as Admin
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Authenticate admin check
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (auth.currentUser) {
          if (auth.currentUser.email === 'frankjoven1991@gmail.com') {
            setIsAdmin(true);
            setAdminMode(true); // default to Admin View for easy administration
            return;
          }
          const adminDoc = await getDoc(doc(db, 'admins', auth.currentUser.uid));
          if (adminDoc.exists()) {
            setIsAdmin(true);
            setAdminMode(true);
          }
        }
      } catch (err) {
        console.warn("Error verifying admin role status:", err);
      }
    };
    checkAdmin();
  }, [auth.currentUser]);

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  // Fetch bookings in real-time
  useEffect(() => {
    if (!auth.currentUser) return;

    setIsLoading(true);
    let q;
    if (isAdmin && adminMode) {
      q = query(
        collection(db, 'bookings'),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'bookings'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBookings(bookingsData);
      setIsLoading(false);
      setError(null);
    }, (err) => {
      console.error("Portal fetch error:", err);
      // Fallback in case of index/security-rule issues
      const fallbackQuery = query(
        collection(db, 'bookings'),
        where('userId', '==', auth.currentUser?.uid || ''),
        orderBy('createdAt', 'desc')
      );
      onSnapshot(fallbackQuery, (fallSnap) => {
        const bookingsData = fallSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Booking[];
        setBookings(bookingsData);
        setIsLoading(false);
      }, (fallbackErr) => {
        setError("Synchronization Error: Insufficient permissions to stream clinic appointments list.");
        setIsLoading(false);
      });
    });

    return () => unsubscribe();
  }, [auth.currentUser, isAdmin, adminMode]);

  // Edit status handler
  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failsafe: Error updating status. Ensure write permissions are initialized.");
    }
  };

  // Saved edited appointment details
  const handleSaveBookingEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    setIsUpdating(true);
    try {
      const bookingRef = doc(db, 'bookings', editingBooking.id);
      await updateDoc(bookingRef, {
        customerName: editingBooking.customerName || '',
        customerEmail: editingBooking.customerEmail || '',
        customerPhone: editingBooking.customerPhone || '',
        clinicName: editingBooking.clinicName || '',
        date: editingBooking.date || '',
        timeSlot: editingBooking.timeSlot || '',
        status: editingBooking.status
      });
      setEditingBooking(null);
    } catch (err) {
      console.error("Error editing booking details:", err);
      alert("Failed to edit booking details in Firestore.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete appointment handler
  const handleDeleteAppointment = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to permanently cancel and remove this scheduled slots reservation?")) return;
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
    } catch (err) {
      console.error("Failed to delete booking:", err);
      alert("Failed to remove booking registration from clinical node.");
    }
  };

  const handleViewPrescription = async (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailLoading(true);
    setPrescription(null);

    const q = query(
      collection(db, 'prescriptions'),
      where('bookingId', '==', booking.id)
    );

    try {
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setPrescription({ id: doc.id, ...doc.data() } as Prescription);
      }
    } catch (err) {
      console.error("Prescription fetch error:", err);
    } finally {
      setIsDetailLoading(false);
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

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'completed': return 'bg-clinic-blue/5 text-clinic-blue border-clinic-blue/10';
      case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white"
    >
      <AnimatePresence>
        {/* Prescription protocol Modal */}
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 shadow-sm"
          >
            <div 
              className="absolute inset-0 bg-clinic-navy/60 backdrop-blur-md"
              onClick={() => setSelectedBooking(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                   <h2 className="text-xl font-black text-clinic-navy uppercase tracking-tight">Prescription Protocol</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Archive Ref: {selectedBooking.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-400 rotate-90" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {isDetailLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-8 h-8 text-clinic-blue animate-spin" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retrieving Bio-metric Scan...</p>
                  </div>
                ) : prescription ? (
                  <div className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <div className="flex items-center gap-2 text-[10px] font-black text-clinic-blue uppercase tracking-widest">
                              <Package className="w-3.5 h-3.5" /> FABRICATION MATERIALS
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {prescription.materials.map(m => (
                                <span key={m} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-clinic-navy uppercase tracking-tight">
                                  {m}
                                </span>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="flex items-center gap-2 text-[10px] font-black text-clinic-blue uppercase tracking-widest">
                              <Activity className="w-3.5 h-3.5" /> BIOMECHANICAL MODS
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {prescription.modifications.map(m => (
                                <span key={m} className="px-3 py-1 bg-clinic-navy/5 border border-clinic-navy/10 rounded-lg text-[10px] font-bold text-clinic-navy uppercase tracking-tight">
                                  {m}
                                </span>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="flex items-center gap-2 text-[10px] font-black text-clinic-blue uppercase tracking-widest">
                           <ClipboardCheck className="w-3.5 h-3.5" /> MAINTENANCE & HYGIENE
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed uppercase tracking-tight">
                           {prescription.maintenance}
                        </p>
                     </div>

                     <div className="space-y-4 p-6 bg-clinic-cyan/5 rounded-[2rem] border border-clinic-cyan/10">
                        <div className="flex items-center gap-2 text-[10px] font-black text-clinic-blue uppercase tracking-widest">
                           <Clock className="w-3.5 h-3.5" /> BREAK-IN SCHEDULE
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic">
                           {prescription.wearSchedule}
                        </p>
                     </div>
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300">
                       <Database className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-xs font-black text-clinic-navy uppercase tracking-tight">Analysis in Progress</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">
                          Your custom insoles are currently in fabrication. Check back soon for full technical specs.
                       </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  VOXELCARE ENGINEERING DEPT
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-6 py-2 bg-clinic-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-clinic-blue transition-all"
                >
                  Close Archive
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Appointment Details modal for Clinic Admins */}
        {editingBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-clinic-navy/60 backdrop-blur-md"
              onClick={() => setEditingBooking(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-clinic-navy text-white">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-clinic-cyan flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Edit Appointment Status
                  </h3>
                  <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">Ref ID: {editingBooking.id}</p>
                </div>
                <button 
                  onClick={() => setEditingBooking(null)}
                  className="p-1.5 hover:bg-white/10 rounded-full text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveBookingEdit} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-[9px] font-black text-clinic-navy uppercase tracking-widest mb-1.5">
                    Patient Name
                  </label>
                  <input 
                    type="text" 
                    required
                    value={editingBooking.customerName || ''}
                    onChange={(e) => setEditingBooking({ ...editingBooking, customerName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-clinic-navy bg-white focus:ring-2 focus:ring-clinic-blue outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black text-clinic-navy uppercase tracking-widest mb-1.5">
                      Patient Email
                    </label>
                    <input 
                      type="email" 
                      required
                      value={editingBooking.customerEmail || ''}
                      onChange={(e) => setEditingBooking({ ...editingBooking, customerEmail: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-clinic-navy bg-white focus:ring-2 focus:ring-clinic-blue outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-clinic-navy uppercase tracking-widest mb-1.5">
                      Patient Phone
                    </label>
                    <input 
                      type="text" 
                      required
                      value={editingBooking.customerPhone || ''}
                      onChange={(e) => setEditingBooking({ ...editingBooking, customerPhone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-clinic-navy bg-white focus:ring-2 focus:ring-clinic-blue outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-clinic-navy uppercase tracking-widest mb-1.5">
                    Target Clinic Branch
                  </label>
                  <select
                    value={editingBooking.clinicName}
                    onChange={(e) => setEditingBooking({ ...editingBooking, clinicName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-clinic-navy bg-white focus:ring-2 focus:ring-clinic-blue outline-none transition-all"
                  >
                    <option value="One Ayala (Makati)">One Ayala (Makati)</option>
                    <option value="SM Mall Of Asia">SM Mall Of Asia</option>
                    <option value="SM North Annex (QC)">SM North Annex (QC)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black text-clinic-navy uppercase tracking-widest mb-1.5">
                      Scheduled Date
                    </label>
                    <input 
                      type="date" 
                      required
                      value={editingBooking.date}
                      onChange={(e) => setEditingBooking({ ...editingBooking, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-clinic-navy bg-white focus:ring-2 focus:ring-clinic-blue outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-clinic-navy uppercase tracking-widest mb-1.5">
                      Time Slot
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 11:30 AM"
                      value={editingBooking.timeSlot}
                      onChange={(e) => setEditingBooking({ ...editingBooking, timeSlot: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-clinic-navy bg-white focus:ring-2 focus:ring-clinic-blue outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-clinic-navy uppercase tracking-widest mb-1.5">
                    Biometric Protocol Status
                  </label>
                  <select
                    value={editingBooking.status}
                    onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value as Booking['status'] })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-clinic-navy bg-white focus:ring-2 focus:ring-clinic-blue outline-none transition-all"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingBooking(null)}
                    className="flex-1 py-3 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 py-3 bg-clinic-blue hover:bg-clinic-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Info Area */}
      <div className="bg-clinic-navy text-white pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-clinic-blue/20 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-clinic-cyan mb-8 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Portal
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-clinic-blue/20 rounded-lg border border-clinic-blue/30">
                <Activity className="w-3 h-3 text-clinic-cyan" />
                <span className="text-[9px] font-black uppercase tracking-widest text-clinic-cyan">EZSTEP ARCHIVE ACTIVE</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none">
                {isAdmin && adminMode ? "Appointment " : "Patient "}
                <span className="text-clinic-cyan">{isAdmin && adminMode ? "Registry" : "Archive"}</span>
              </h1>
              <p className="text-lg text-slate-400 font-medium max-w-xl">
                {isAdmin && adminMode 
                  ? "Central administration database for editing statuses, patient profiles, and scheduled clincal appointments."
                  : "Access your clinical assessment history, upcoming appointments, and bio-metric scan data."}
              </p>
            </div>

            <div className="flex gap-4">
               <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-sm">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    {isAdmin && adminMode ? "Total Admin Bookings" : "My Protocols"}
                  </div>
                  <div className="text-3xl font-display font-black text-white">{bookings.length}</div>
               </div>
               <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-sm">
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Authorization Status</div>
                  <div className="text-clinic-cyan text-[10px] font-black uppercase tracking-widest">
                    {isAdmin ? "🛡️ Clinical-Director (Admin)" : "Patient-Level 3"}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 mb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-clinic-navy rounded-2xl flex items-center justify-center">
                        <ClipboardCheck className="w-5 h-5 text-clinic-cyan" />
                     </div>
                     <div>
                       <h2 className="text-sm font-black text-clinic-navy uppercase tracking-tight">
                         {isAdmin && adminMode ? "Bio-Scan Registry Master DB" : "Deployment Schedule"}
                       </h2>
                       {isAdmin && (
                         <div className="text-[10px] text-clinic-blue font-bold uppercase tracking-wider mt-0.5">
                           Authorized as Principal Clinician
                         </div>
                       )}
                     </div>
                  </div>

                  {/* Mode Tab bar for Admin vs Patient */}
                  <div className="flex items-center gap-4">
                     {isAdmin && (
                       <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                          <button
                            onClick={() => setAdminMode(true)}
                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                              adminMode 
                              ? 'bg-clinic-navy text-white shadow-sm' 
                              : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            🛡️ Client Registry
                          </button>
                          <button
                            onClick={() => setAdminMode(false)}
                            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                              !adminMode 
                              ? 'bg-clinic-navy text-white shadow-sm' 
                              : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            👤 My Bookings
                          </button>
                       </div>
                     )}

                     <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        <button
                          onClick={() => setViewMode('list')}
                          className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                            viewMode === 'list' 
                            ? 'bg-white text-clinic-navy shadow-sm' 
                            : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          List
                        </button>
                        <button
                          onClick={() => setViewMode('calendar')}
                          className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                            viewMode === 'calendar' 
                            ? 'bg-white text-clinic-navy shadow-sm' 
                            : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          Calendar
                        </button>
                     </div>
                  </div>
               </div>

               <div className="p-0 overflow-x-auto">
                 {isLoading ? (
                   <div className="p-20 flex flex-col items-center justify-center space-y-4">
                     <Loader2 className="w-8 h-8 text-clinic-blue animate-spin" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decrypting Archive Data...</p>
                   </div>
                 ) : error ? (
                   <div className="p-20 flex flex-col items-center justify-center space-y-4 text-center">
                     <AlertCircle className="w-8 h-8 text-red-500" />
                     <p className="text-red-500 font-bold max-w-xs text-xs">{error}</p>
                   </div>
                 ) : bookings.length === 0 ? (
                   <div className="p-20 flex flex-col items-center justify-center space-y-4 text-center">
                     <Calendar className="w-12 h-12 text-slate-100" />
                     <div className="space-y-1">
                       <p className="text-clinic-navy font-black uppercase text-sm">No Active Protocols</p>
                       <p className="text-slate-400 text-xs font-medium">You haven't scheduled any clinical assessments yet.</p>
                     </div>
                     <button onClick={onBack} className="text-clinic-blue text-[10px] font-black uppercase tracking-widest hover:underline pt-4">
                        Initialize First Booking
                     </button>
                   </div>
                 ) : viewMode === 'list' ? (
                   <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="bg-slate-50/50 border-b border-slate-100">
                         {isAdmin && adminMode && (
                           <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Patient / Client</th>
                         )}
                         <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Clinic</th>
                         <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Schedule</th>
                         <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status / Edit Status</th>
                         <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                       {bookings.map((booking) => (
                         <motion.tr 
                           key={booking.id}
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           onClick={() => handleViewPrescription(booking)}
                           className="group hover:bg-slate-50/30 transition-colors cursor-pointer"
                         >
                           {isAdmin && adminMode && (
                             <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
                               <div className="space-y-1">
                                 <div className="text-xs font-black text-clinic-navy uppercase tracking-tight">
                                   {booking.customerName || 'Anonymous User'}
                                 </div>
                                 <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex flex-col gap-0.5">
                                   <span className="flex items-center gap-1"><Mail className="w-2.5 h-2.5 text-slate-350" /> {booking.customerEmail || 'no email'}</span>
                                   <span className="flex items-center gap-1"><Phone className="w-2.5 h-2.5 text-slate-350" /> {booking.customerPhone || 'no phone'}</span>
                                 </div>
                               </div>
                             </td>
                           )}
                           <td className="px-8 py-6">
                             <div className="space-y-1">
                               <div className="text-xs font-black text-clinic-navy uppercase tracking-tight group-hover:text-clinic-blue transition-colors">
                                 {booking.clinicName}
                               </div>
                               <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                 <MapPin className="w-2.5 h-2.5" /> Philippines
                               </div>
                             </div>
                           </td>
                           <td className="px-8 py-6">
                             <div className="space-y-1">
                               <div className="text-xs font-black text-clinic-navy uppercase lining-nums">
                                 {booking.date.includes('-') ? format(parse(booking.date, 'yyyy-MM-dd', new Date()), 'MMM d, yyyy') : booking.date}
                               </div>
                               <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                 <Clock className="w-2.5 h-2.5" /> {booking.timeSlot}
                               </div>
                             </div>
                           </td>
                           <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
                             {/* Inline Interactive Status Dropdown for instant clinical updates if admin */}
                             {isAdmin && adminMode ? (
                               <select
                                 value={booking.status}
                                 onChange={(e) => handleStatusChange(booking.id, e.target.value as Booking['status'])}
                                 className="px-2 py-1 bg-white border border-slate-200 text-[10px] font-black text-clinic-navy uppercase tracking-widest rounded-lg focus:ring-1 focus:ring-clinic-blue outline-none transition-all cursor-pointer"
                               >
                                 <option value="pending">Pending</option>
                                 <option value="confirmed">Confirmed</option>
                                 <option value="completed">Completed</option>
                                 <option value="cancelled">Cancelled</option>
                               </select>
                             ) : (
                               <div className={`inline-flex px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                                 {booking.status}
                               </div>
                             )}
                           </td>
                           <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                             <div className="flex justify-end gap-2">
                               {/* Edit complete details button for Admin */}
                               {isAdmin && adminMode && (
                                 <button
                                   title="Edit details"
                                   onClick={() => setEditingBooking(booking)}
                                   className="p-2 bg-slate-50 text-clinic-blue hover:bg-clinic-blue hover:text-white rounded-xl border border-slate-100 transition-all"
                                 >
                                   <Edit2 className="w-4 h-4" />
                                 </button>
                               )}

                               <button 
                                 title="Add to Google Calendar"
                                 onClick={() => {
                                   const dateFmt = booking.date.includes('-') ? 'yyyy-MM-dd' : 'MMM d, yyyy';
                                   const start = parse(`${booking.date} ${booking.timeSlot}`, `${dateFmt} h:mm a`, new Date());
                                   const url = generateGoogleCalendarUrl({
                                     title: `EZStep Assessment: ${booking.clinicName}`,
                                     description: `Clinical bio-orthopedic assessment Archive Ref: ${booking.id}`,
                                     location: booking.clinicName,
                                     start,
                                     duration: 45
                                   });
                                   window.open(url, '_blank');
                                 }}
                                 className="p-2 bg-slate-50 text-slate-400 hover:bg-clinic-navy hover:text-white rounded-xl transition-all"
                               >
                                 <Calendar className="w-4 h-4" />
                               </button>

                               {/* Delete Appointment if Admin */}
                               {isAdmin && adminMode && (
                                 <button
                                   title="Delete clinical slot"
                                   onClick={() => handleDeleteAppointment(booking.id)}
                                   className="p-2 bg-slate-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl border border-slate-100 transition-all"
                                 >
                                   <Trash2 className="w-4 h-4" />
                                 </button>
                               )}

                               <button 
                                 onClick={() => handleViewPrescription(booking)}
                                 title="View prescription file"
                                 className="p-2 bg-slate-50 text-slate-400 hover:bg-clinic-blue hover:text-white rounded-xl transition-all"
                               >
                                 <ChevronRight className="w-4 h-4" />
                               </button>
                             </div>
                           </td>
                         </motion.tr>
                       ))}
                     </tbody>
                   </table>
                 ) : (
                   <div className="p-8">
                        <div className="flex items-center justify-between mb-8 px-4">
                           <div className="text-lg font-black text-clinic-navy uppercase tracking-tight">
                              {format(currentMonth, 'MMMM yyyy')}
                           </div>
                           <div className="flex gap-2">
                              <button 
                                onClick={prevMonth}
                                className="p-2 bg-slate-50 text-slate-400 hover:text-clinic-navy rounded-xl border border-slate-100 transition-all"
                              >
                                 <ChevronRight className="w-4 h-4 rotate-180" />
                              </button>
                              <button 
                                onClick={nextMonth}
                                className="p-2 bg-slate-50 text-slate-400 hover:text-clinic-navy rounded-xl border border-slate-100 transition-all"
                              >
                                 <ChevronRight className="w-4 h-4" />
                              </button>
                           </div>
                        </div>

                        <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-[2rem] overflow-hidden">
                           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                             <div key={day} className="bg-slate-50/80 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                {day}
                             </div>
                           ))}
                           {calendarDays.map((date, i) => {
                              const isCurrentMonth = isSameMonth(date, currentMonth);
                              const dayBookings = bookings.filter(b => {
                                return b.date === format(date, 'yyyy-MM-dd') || b.date === format(date, 'MMM d, yyyy');
                              });

                              return (
                                <div 
                                  key={i} 
                                  className={`min-h-[140px] p-2 bg-white flex flex-col gap-1 ${!isCurrentMonth ? 'bg-slate-50/30' : ''}`}
                                >
                                   <div className={`text-[10px] font-black mb-1 p-1 rounded-md inline-block w-6 h-6 text-center ${
                                     isToday(date) ? 'bg-clinic-blue text-white' : isCurrentMonth ? 'text-clinic-navy' : 'text-slate-300'
                                   }`}>
                                      {format(date, 'd')}
                                   </div>
                                   <div className="space-y-1 overflow-y-auto max-h-[100px]">
                                      {dayBookings.map(booking => (
                                        <div
                                          key={booking.id}
                                          className={`relative w-full text-left p-1.5 rounded-lg border text-[8px] font-black uppercase tracking-tight transition-all hover:scale-[1.02] ${getStatusColor(booking.status)}`}
                                        >
                                          <div className="truncate font-black">{booking.timeSlot}</div>
                                          {isAdmin && adminMode && (
                                            <div className="truncate text-[7px] text-slate-600 block leading-tight">{booking.customerName || 'Anonymous'}</div>
                                          )}
                                          <div className="truncate opacity-60 leading-tight">{booking.clinicName}</div>
                                          
                                          {/* Mini actions inside calendar blocks for admin */}
                                          {isAdmin && adminMode && (
                                            <div className="flex gap-1 mt-1 pt-1 border-t border-slate-100/30 justify-between items-center bg-white/40 p-0.5 rounded">
                                              <button 
                                                onClick={() => setEditingBooking(booking)}
                                                className="hover:text-clinic-blue font-bold px-1 py-0.5 whitespace-nowrap"
                                                title="Edit Appointment Details"
                                              >
                                                Edit
                                              </button>
                                              <button 
                                                onClick={() => handleViewPrescription(booking)}
                                                className="hover:text-clinic-cyan font-bold px-1 py-0.5 whitespace-nowrap"
                                                title="View Prescription"
                                              >
                                                Scan
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                   </div>
                                </div>
                              );
                           })}
                        </div>
                     </div>
                  )}
               </div>
            </div>
          </div>

          {/* Sidebar Modules */}
          <div className="space-y-6">
             {/* User Profile Hook */}
             <div className="bg-clinic-navy p-8 rounded-[3rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                   <User className="w-20 h-20" />
                </div>
                <div className="relative z-10 space-y-6">
                   <div className="space-y-4">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 border border-white/10 flex items-center justify-center text-clinic-cyan">
                         <User className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tight">{auth.currentUser?.displayName || 'Biometric Identity'}</h3>
                        <p className="text-[10px] text-clinic-cyan font-black uppercase tracking-widest">{auth.currentUser?.email}</p>
                      </div>
                   </div>
                   <div className="pt-6 border-t border-white/5 space-y-3">
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                         <span>Patient ID</span>
                         <span className="text-white">{auth.currentUser?.uid.slice(0, 10).toUpperCase()}</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Bio-metric Status */}
             <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 space-y-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-2xl border border-slate-200 flex items-center justify-center">
                      <Package className="w-5 h-5 text-clinic-blue" />
                   </div>
                   <h3 className="text-xs font-black text-clinic-navy uppercase tracking-tight">Active Prescriptions</h3>
                </div>
                <div className="space-y-4">
                   <div className="p-4 bg-white rounded-2xl border border-slate-100 opacity-60 text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans inline-block">No active prescription scan found</p>
                      <button onClick={onBack} className="text-clinic-blue text-[9px] font-black uppercase tracking-widest mt-2 hover:underline">
                         Book Initial Voxel Scan
                      </button>
                   </div>
                </div>
             </div>

             {/* Clinical Readiness Checklist */}
             <div className="bg-white p-8 rounded-[3rem] border border-slate-100 space-y-6 shadow-sm">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-clinic-blue/5 rounded-2xl flex items-center justify-center">
                      <ClipboardCheck className="w-5 h-5 text-clinic-blue" />
                   </div>
                   <h3 className="text-xs font-black text-clinic-navy uppercase tracking-tight">Clinical Readiness</h3>
                </div>
                <div className="space-y-1">
                   {[
                     { id: 't1', text: 'Wear comfortable loose pants' },
                     { id: 't2', text: 'Bring current daily footwear' },
                     { id: 't3', text: 'Avoid heavy meals 2hr before' }
                   ].map(task => (
                     <button 
                       key={task.id}
                       onClick={() => toggleTask(task.id)}
                       className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all text-left group"
                     >
                       <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                         completedTasks.includes(task.id) 
                           ? 'bg-clinic-blue border-clinic-blue' 
                           : 'border-slate-200 group-hover:border-clinic-blue/30'
                       }`}>
                         <AnimatePresence>
                           {completedTasks.includes(task.id) && (
                             <motion.div
                               initial={{ scale: 0, rotate: -45 }}
                               animate={{ scale: 1, rotate: 0 }}
                               exit={{ scale: 0, rotate: -45 }}
                               transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                             >
                               <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                             </motion.div>
                           )}
                         </AnimatePresence>
                       </div>
                       <span className={`text-[10px] font-bold uppercase tracking-tight transition-all ${
                         completedTasks.includes(task.id) ? 'text-slate-300 line-through' : 'text-slate-600'
                       }`}>
                         {task.text}
                       </span>
                     </button>
                   ))}
                </div>
                <div className="pt-2 px-2">
                   <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                      <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${(completedTasks.length / 3) * 100}%` }}
                       className="h-full bg-clinic-blue"
                      />
                   </div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">
                     Ready for assessment: {completedTasks.length}/3
                   </p>
                </div>
             </div>

             {/* Support Module */}
             <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-100 border-dashed space-y-6">
                <div className="space-y-2">
                   <h4 className="text-xs font-black text-clinic-navy uppercase tracking-tight">Clinical Support</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                      Facing sync issues or need to reschedule? Contact our central laboratory.
                   </p>
                </div>
                <div className="space-y-3">
                   <button className="w-full py-3 bg-slate-50 rounded-xl text-[9px] font-black text-clinic-navy uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition-all">
                      <Database className="w-3.5 h-3.5" /> Request Data Export
                   </button>
                   <button className="w-full py-3 border border-slate-100 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                      <ExternalLink className="w-3.5 h-3.5" /> Lab Documentation
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
