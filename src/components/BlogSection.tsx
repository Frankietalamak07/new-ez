import React from 'react';
import { motion } from 'motion/react';
import { Clock, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 1,
    title: "Understanding Foot Arch Bio-Mechanics",
    category: "Clinical Research",
    date: "May 12, 2026",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1597455198465-824d6753c13b?q=80&w=2074&auto=format&fit=crop",
    excerpt: "How millimeter-level variances in arch support can impact total body posture and long-term spinal health."
  },
  {
    id: 2,
    title: "Top 5 Benefits of Daily Orthotic Wear",
    category: "Wellness",
    date: "May 08, 2026",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1623151813735-d250c6061329?q=80&w=2072&auto=format&fit=crop",
    excerpt: "From reduced lower back fatigue to improved athletic endurance, discover why clinical foot support is a life-long investment."
  },
  {
    id: 3,
    title: "Carbon Fiber vs. EVA: The Material Science",
    category: "Technology",
    date: "May 01, 2026",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    excerpt: "A deep dive into our laboratory material selection process and why composite construction outperforms traditional plastics."
  },
  {
    id: 4,
    title: "Diabetes and Foot Health: A Critical Guide",
    category: "Medical",
    date: "April 25, 2026",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1576091160550-217359f4bd08?q=80&w=2070&auto=format&fit=crop",
    excerpt: "Specialized orthotic solutions for diabetic neuropathy and pressure point redistribution."
  },
  {
    id: 5,
    title: "Post-Surgical Recovery with Orthotics",
    category: "Rehabilitation",
    date: "April 18, 2026",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop",
    excerpt: "Accelerating patient mobility after knee and hip replacements through precision gait alignment."
  }
];

export const BlogSection: React.FC = () => {
  return (
    <section id="blog" className="py-32 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-clinic-blue/5 border border-clinic-blue/10 rounded-full text-clinic-blue text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <BookOpen className="w-3 h-3" /> Clinical Insights
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              className="font-display text-5xl md:text-6xl font-black text-clinic-navy uppercase leading-none"
            >
              The Clinical <br />
              <span className="text-clinic-blue">Knowledge Base</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-slate-500 font-medium max-w-sm text-sm border-l-2 border-slate-200 pl-6">
              Expert research and technical guides curated by our laboratory specialists and clinical advisors.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {BLOG_POSTS.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`group flex flex-col h-full bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-clinic-blue/20 transition-all duration-500 ${
                i === 0 ? 'lg:col-span-2 lg:flex-row' : ''
              }`}
            >
              <div className={`relative overflow-hidden ${i === 0 ? 'lg:w-3/5 h-[300px] lg:h-auto' : 'h-64'}`}>
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-clinic-navy border border-white/20">
                  {post.category}
                </div>
              </div>

              <div className={`p-8 md:p-10 flex flex-col justify-between ${i === 0 ? 'lg:w-2/5' : 'flex-1'}`}>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className={`font-display font-black text-clinic-navy uppercase leading-tight group-hover:text-clinic-blue transition-colors ${i === 0 ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-8 flex items-center gap-2 text-clinic-blue text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                  Read Case Study <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.article>
          ))}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-1 flex flex-col items-center justify-center p-10 rounded-[2.5rem] bg-clinic-navy text-white text-center border border-white/5 relative overflow-hidden group/cta"
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
