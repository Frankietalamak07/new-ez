import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Star, ExternalLink, Plus, Edit2, Trash2, X, Loader2, Save } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

interface Testimonial {
  id?: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  initials: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: "Dr. Arvin Santos",
    role: "Physiotherapist",
    content: "The level of precision in these insoles is unprecedented. My patients with chronic plantar fasciitis have seen significant improvement within weeks.",
    rating: 5,
    initials: "AS",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250&h=250"
  },
  {
    name: "Maria Clara",
    role: "Marathon Runner",
    content: "EZStep changed my gait analysis forever. The Voxel Scan caught a pronation issue that my previous doctors missed. Truly a game-changer.",
    rating: 5,
    initials: "MC",
    image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=250&h=250"
  },
  {
    name: "James Yap",
    role: "Professional Athlete",
    content: "Customization is key at this level. The carbon-fiber support gives me the stability I need for high-impact movements.",
    rating: 5,
    initials: "JY",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250&h=250"
  },
  {
    name: "Liza Soberano",
    role: "Flight Attendant",
    content: "Standing for 12 hours a day used to be a nightmare. Now, I feel like I'm walking on clouds. The TENS M2 platform is also amazing for recovery.",
    rating: 5,
    initials: "LS",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250&h=250"
  },
  {
    name: "Engr. Robert Lim",
    role: "Civil Engineer",
    content: "As someone who works on-site, foot fatigue is real. These insoles fits perfectly in my safety boots. The engineering behind this is solid.",
    rating: 5,
    initials: "RL",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250&h=250"
  }
];

const PRESET_AVATARS = [
  { name: 'Dr. Male', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250&h=250' },
  { name: 'Dr. Female', url: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=250&h=250' },
  { name: 'Athlete Female', url: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=250&h=250' },
  { name: 'Athlete Male', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250&h=250' },
  { name: 'Casual Female', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250&h=250' },
  { name: 'Casual Male', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250&h=250' },
];

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync testimonials safely with error recovery
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(q, {
        next: (snapshot) => {
          if (snapshot.empty) {
            setTestimonials(DEFAULT_TESTIMONIALS);
          } else {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
            setTestimonials(data);
          }
          setIsLoading(false);
        },
        error: (err) => {
          console.warn("Firestore snapshot listener failed, falling back to static testimonials:", err);
          setTestimonials(DEFAULT_TESTIMONIALS);
          setIsLoading(false);
        }
      });
    } catch (err) {
      console.warn("Failed to set up Firestore testimonials subscription, falling back:", err);
      setTestimonials(DEFAULT_TESTIMONIALS);
      setIsLoading(false);
    }

    return () => unsubscribe();
  }, []);

  // Admin authentication check with try-catch safe guard
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        if (auth.currentUser) {
          if (auth.currentUser.email === 'frankjoven1991@gmail.com') {
            setIsAdmin(true);
            return;
          }
          const adminDoc = await getDoc(doc(db, 'admins', auth.currentUser.uid));
          setIsAdmin(adminDoc.exists());
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.warn("Error verifying admin role status:", err);
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [auth.currentUser]);

  // Handle auto-generator of initials
  const handleNameChange = (nameVal: string) => {
    const computedInitials = nameVal
      .split(' ')
      .filter(part => part.length > 0)
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    setEditingTestimonial(prev => ({
      ...prev,
      name: nameVal,
      initials: prev?.initials || computedInitials
    }));
  };

  // Save changes to Firestore
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !isAdmin) return;
    setIsSaving(true);

    const payload = {
      name: editingTestimonial.name || 'Anonymous Patient',
      role: editingTestimonial.role || 'Patient',
      content: editingTestimonial.content || '',
      rating: editingTestimonial.rating || 5,
      image: editingTestimonial.image || '',
      initials: editingTestimonial.initials || 'A',
      updatedAt: serverTimestamp()
    };

    try {
      if (editingTestimonial.id) {
        // Edit existing
        const testRef = doc(db, 'testimonials', editingTestimonial.id);
        await updateDoc(testRef, payload);
      } else {
        // Create new
        const testCol = collection(db, 'testimonials');
        await addDoc(testCol, {
          ...payload,
          createdAt: serverTimestamp()
        });
      }
      setIsEditing(false);
      setEditingTestimonial(null);
    } catch (err) {
      console.error("Failed saving testimonial:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete testimonial from Firestore
  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this patient story?")) return;
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
    }
  };

  return (
    <section 
      id="testimonials" 
      className="py-32 bg-slate-50 relative overflow-hidden flex flex-col items-center"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-clinic-blue/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-clinic-cyan/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full"
            >
              <Star className="w-3 h-3 text-clinic-cyan fill-clinic-cyan" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-clinic-navy">Patient Success Stories</span>
            </motion.div>

            {isAdmin && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                  setEditingTestimonial({
                    name: '',
                    role: '',
                    content: '',
                    rating: 5,
                    initials: '',
                    image: ''
                  });
                  setIsEditing(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-clinic-navy text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-clinic-blue transition-all shadow-md shadow-clinic-navy/10 cursor-pointer animate-pulse"
              >
                <Plus className="w-3 h-3" /> Add Testimonial
              </motion.button>
            )}
          </div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-black uppercase text-clinic-navy leading-[0.9]"
          >
            Trusted by Professionals, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-clinic-blue to-clinic-cyan">Built for Mobility.</span>
          </motion.h2>
        </div>

        {/* Responsive Staggered Grid of Testimonials */}
        <div className="w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24">
              <Loader2 className="w-8 h-8 text-clinic-blue animate-spin" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Medical Success Stories...</p>
            </div>
          ) : (
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
            >
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id || i}
                  variants={{
                    hidden: { opacity: 0, scale: 0.95, y: 20 },
                    show: { opacity: 1, scale: 1, y: 0 }
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] border border-slate-100 relative group hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between min-h-[280px]"
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {[...Array(t.rating)].map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 text-clinic-cyan fill-clinic-cyan" />
                        ))}
                      </div>
                      <Quote className="w-6 h-6 text-slate-100 group-hover:text-clinic-blue/10 transition-colors" />
                    </div>

                    <p className="text-slate-600 font-medium italic leading-relaxed text-base">
                      "{t.content}"
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {t.image ? (
                        <img 
                          src={t.image} 
                          alt={t.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover shadow-md border border-slate-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).onerror = null; 
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=0062FF&color=fff`;
                          }}
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-clinic-blue to-clinic-cyan flex items-center justify-center text-white font-black text-xs shadow-md">
                          {t.initials || 'A'}
                        </div>
                      )}
                      <div>
                        <h4 className="font-black text-clinic-navy uppercase tracking-tight text-[12px]">{t.name}</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.role}</p>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="flex gap-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTestimonial(t);
                            setIsEditing(true);
                          }}
                          className="p-2 bg-slate-50 hover:bg-clinic-blue/10 rounded-lg text-clinic-navy hover:text-clinic-blue border border-slate-100 transition-colors cursor-pointer"
                          title="Edit Success Story"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (t.id) handleDelete(t.id);
                          }}
                          className="p-2 bg-slate-50 hover:bg-red-50 rounded-lg text-clinic-navy hover:text-red-500 border border-slate-100 transition-colors cursor-pointer"
                          title="Delete Success Story"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* External Google Reviews Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 z-10"
      >
        <a 
          href="https://g.page/r/CSdKljI24PFXEAI/review" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-3 px-10 py-5 bg-clinic-navy text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-clinic-blue transition-all duration-300 shadow-2xl shadow-clinic-navy/20 active:scale-95"
        >
          See More Reviews
          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </a>
      </motion.div>

      {/* Testimonial Form Modal */}
      <AnimatePresence>
        {isEditing && editingTestimonial && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white border border-slate-100 rounded-[2.5rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-clinic-blue uppercase tracking-widest">Story Curator</span>
                  <h3 className="text-2xl font-display font-black text-clinic-navy uppercase">
                    {editingTestimonial.id ? 'Edit Success Story' : 'New Patient Success Story'}
                  </h3>
                </div>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setEditingTestimonial(null);
                  }}
                  className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Patient/Client Name</label>
                    <input 
                      type="text" 
                      required
                      value={editingTestimonial.name || ''}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. Maria Clara"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-clinic-navy placeholder:text-slate-400 focus:outline-none focus:border-clinic-blue transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Role/Vocation</label>
                    <input 
                      type="text" 
                      required
                      value={editingTestimonial.role || ''}
                      onChange={(e) => setEditingTestimonial(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g. Marathon Runner"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-clinic-navy placeholder:text-slate-400 focus:outline-none focus:border-clinic-blue transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Initials (For fallback avatar)</label>
                    <input 
                      type="text" 
                      maxLength={2}
                      value={editingTestimonial.initials || ''}
                      onChange={(e) => setEditingTestimonial(prev => ({ ...prev, initials: e.target.value.toUpperCase() }))}
                      placeholder="e.g. MC"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-clinic-navy placeholder:text-slate-400 focus:outline-none focus:border-clinic-blue transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Star Rating</label>
                    <div className="flex gap-2 h-11 items-center justify-start bg-slate-50 px-4 rounded-xl border border-slate-200">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setEditingTestimonial(prev => ({ ...prev, rating: stars }))}
                          className="focus:outline-none group"
                        >
                          <Star 
                            className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                              stars <= (editingTestimonial.rating || 5) 
                                ? 'text-clinic-cyan fill-clinic-cyan' 
                                : 'text-slate-200'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Picture Image URL</label>
                  <input 
                    type="url" 
                    value={editingTestimonial.image || ''}
                    onChange={(e) => setEditingTestimonial(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="e.g. https://images.unsplash.com/... or choose preset below"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-clinic-navy placeholder:text-slate-400 focus:outline-none focus:border-clinic-blue transition-all font-medium"
                  />
                  
                  {/* Preset Avatar Gallery selector */}
                  <div className="space-y-1.5 pt-1">
                    <span className="block text-[8px] font-black text-clinic-blue uppercase tracking-widest">Quick Preset Clinical & Professional Portraits:</span>
                    <div className="grid grid-cols-6 gap-2">
                      {PRESET_AVATARS.map((preset, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setEditingTestimonial(prev => ({ ...prev, image: preset.url }))}
                          className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all hover:scale-105 ${
                            editingTestimonial.image === preset.url 
                              ? 'border-clinic-blue ring-2 ring-clinic-blue/20' 
                              : 'border-slate-100 hover:border-slate-300'
                          }`}
                          title={`Select ${preset.name}`}
                        >
                          <img 
                            src={preset.url} 
                            alt={preset.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Testimonial Quote</label>
                  <textarea 
                    required
                    rows={4}
                    value={editingTestimonial.content || ''}
                    onChange={(e) => setEditingTestimonial(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="We saw incredible improvement..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-clinic-navy placeholder:text-slate-400 focus:outline-none focus:border-clinic-blue transition-all font-medium resize-none leading-relaxed"
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-clinic-navy text-white hover:bg-clinic-blue rounded-xl font-black uppercase text-[10px] tracking-widest transition-all cursor-pointer shadow-lg shadow-clinic-navy/10 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Success Story
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditingTestimonial(null);
                    }}
                    className="px-6 py-4 border border-slate-200 hover:border-slate-300 text-slate-500 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
