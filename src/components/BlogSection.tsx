import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ArrowRight, BookOpen, ExternalLink, Loader2, Plus, Edit2, Trash2, X, Microscope, Zap, Heart, Sparkles } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { getDoc } from 'firebase/firestore';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content?: string;
  createdAt?: Timestamp;
}

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: "Understanding Foot Arch Bio-Mechanics",
    category: "Clinical Research",
    date: "May 12, 2026",
    readTime: "8 min",
    image: "/src/assets/images/regenerated_image_1778927749717.jpg",
    excerpt: "How millimeter-level variances in arch support can impact total body posture and long-term spinal health."
  },
  {
    id: '2',
    title: "Top 5 Benefits of Daily Orthotic Wear",
    category: "Wellness",
    date: "May 08, 2026",
    readTime: "6 min",
    image: "/src/assets/images/regenerated_image_1778927751963.jpg",
    excerpt: "From reduced lower back fatigue to improved athletic endurance, discover why clinical foot support is a life-long investment."
  },
  {
    id: '3',
    title: "Carbon Fiber vs. EVA: The Material Science",
    category: "Technology",
    date: "May 01, 2026",
    readTime: "12 min",
    image: "/src/assets/images/regenerated_image_1778927745981.jpg",
    excerpt: "A deep dive into our laboratory material selection process and why composite construction outperforms traditional plastics."
  }
];

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('clinical') || cat.includes('research') || cat.includes('biomedical') || cat.includes('science')) {
    return <Microscope className="w-3 h-3 text-clinic-blue" />;
  }
  if (cat.includes('wellness') || cat.includes('health') || cat.includes('lifestyle') || cat.includes('comfort')) {
    return <Heart className="w-3 h-3 text-rose-500 fill-rose-500/20" />;
  }
  if (cat.includes('tech') || cat.includes('material') || cat.includes('carbon') || cat.includes('equipment')) {
    return <Zap className="w-3 h-3 text-amber-500 fill-amber-500/20" />;
  }
  return <Sparkles className="w-3 h-3 text-clinic-cyan" />;
};


export const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'insights'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setPosts(FALLBACK_POSTS);
      } else {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
        setPosts(data);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkAdmin = async () => {
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
    };
    checkAdmin();
  }, [auth.currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost || !isAdmin) return;

    try {
      const postData = {
        title: editingPost.title || 'Untitled',
        category: editingPost.category || 'Clinical',
        excerpt: editingPost.excerpt || '',
        image: editingPost.image || 'https://images.unsplash.com/photo-1591944849610-c04e3835f79b',
        readTime: editingPost.readTime || '5 min',
        date: editingPost.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        updatedAt: serverTimestamp()
      };

      if (editingPost.id) {
        await updateDoc(doc(db, 'insights', editingPost.id), postData);
      } else {
        await addDoc(collection(db, 'insights'), {
          ...postData,
          createdAt: serverTimestamp()
        });
      }
      setIsEditing(false);
      setEditingPost(null);
    } catch (err) {
      console.error("Error saving insight:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this clinical insight?") || !isAdmin) return;
    try {
      await deleteDoc(doc(db, 'insights', id));
    } catch (err) {
      console.error("Error deleting insight:", err);
    }
  };

  return (
    <section id="blog" className="py-32 px-6 bg-white relative overflow-hidden">
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-clinic-navy/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-clinic-navy uppercase tracking-tight">
                  {editingPost?.id ? 'Edit Clinical Insight' : 'New Clinical Insight'}
                </h3>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                    <input 
                      required
                      value={editingPost?.category || ''}
                      onChange={e => setEditingPost(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-clinic-blue transition-all"
                      placeholder="e.g. Clinical Research"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Read Time</label>
                    <input 
                      required
                      value={editingPost?.readTime || ''}
                      onChange={e => setEditingPost(prev => ({ ...prev, readTime: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-clinic-blue transition-all"
                      placeholder="e.g. 5 min"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insight Title</label>
                  <input 
                    required
                    value={editingPost?.title || ''}
                    onChange={e => setEditingPost(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-clinic-blue transition-all"
                    placeholder="Scientific title..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image URL</label>
                  <input 
                    required
                    value={editingPost?.image || ''}
                    onChange={e => setEditingPost(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-clinic-blue transition-all"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Excerpt</label>
                  <textarea 
                    required
                    rows={3}
                    value={editingPost?.excerpt || ''}
                    onChange={e => setEditingPost(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-clinic-blue transition-all resize-none"
                    placeholder="Short summary of the research..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-clinic-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-clinic-blue transition-all shadow-xl shadow-clinic-navy/20"
                >
                  Publish to Archive
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-clinic-blue/5 border border-clinic-blue/10 rounded-full text-clinic-blue text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <BookOpen className="w-3 h-3" /> Clinical Insights
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-5xl md:text-6xl font-black text-clinic-navy uppercase leading-none"
            >
              The Clinical <br />
              <span className="text-clinic-blue">Knowledge Base</span>
            </motion.h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12">
          {isLoading ? (
            <div className="col-span-full py-40 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-clinic-blue animate-spin" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Clinical Repository...</p>
            </div>
          ) : (
            <>
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative h-[450px] bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-clinic-blue/20 transition-all duration-700"
                >
                  <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-50 group-hover:from-white transition-all duration-700" />
                  </div>

                  {isAdmin && (
                    <div className="absolute top-6 right-6 z-20 flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingPost(post);
                          setIsEditing(true);
                        }}
                        className="p-2.5 bg-white/90 backdrop-blur shadow-lg rounded-full text-clinic-navy hover:text-clinic-blue transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="p-2.5 bg-white/90 backdrop-blur shadow-lg rounded-full text-clinic-navy hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-10 pt-0 flex flex-col justify-end">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 px-3 py-1 bg-clinic-blue/10 text-clinic-blue text-[8px] font-black uppercase tracking-widest rounded-lg">
                          {getCategoryIcon(post.category)}
                          {post.category}
                        </span>
                        <div className="flex items-center gap-4 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
                          <span>•</span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-display font-black text-2xl md:text-3xl text-clinic-navy uppercase leading-tight group-hover:text-clinic-blue transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="pt-4">
                        <div className="inline-flex items-center gap-2 text-clinic-blue text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                          Read Full Clinical Paper <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center p-12 rounded-[3rem] bg-clinic-navy text-white text-center border border-white/5 relative overflow-hidden group/cta min-h-[450px]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,98,255,0.2),transparent_50%)]" />
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover/cta:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-clinic-cyan" />
              </div>
              <h4 className="font-display text-2xl font-black uppercase leading-tight">Access Full <br />Clinical Archives</h4>
              <p className="text-slate-400 text-xs font-medium">Explore over 200 technical papers, clinical assessments, and patient outcomes.</p>
              <button className="px-8 py-4 bg-white text-clinic-navy font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-clinic-cyan hover:text-white transition-all shadow-xl shadow-black/20 flex items-center gap-3 mx-auto">
                Browse Repository <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
