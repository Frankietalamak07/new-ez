import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: "How long does it take to get my custom insoles?",
    answer: "Our clinical process is designed for precision and speed. After your baseline 3D Voxel scan, our orthopedic engineers typically calibrate and manufacture your custom insoles within 3 to 5 business days, depending on the complexity of your biomechanical requirements."
  },
  {
    question: "Do I need a prescription for custom orthotics?",
    answer: "While we often work with referrals from orthopedic surgeons and physiotherapists, a prescription is not strictly required. Our in-house specialists perform a comprehensive clinical assessment and gait analysis using the VOXELCARE platform to determine the ideal correction for your specific bio-markers."
  },
  {
    question: "How often should I replace my custom insoles?",
    answer: "For optimal corrective performance, we recommend a clinical review every 12 to 18 months. While the medical-grade materials we use are engineered for extreme durability, your foot structure and gait mechanics can evolve over time, necessitating a recalibration of your support system."
  },
  {
    question: "Can I use one pair of insoles for all my shoes?",
    answer: "Our insoles are designed to be versatile and can be transferred between shoes with similar volume (e.g., most athletic and casual sneakers). However, for specialized footwear like tight dress shoes or high-impact safety boots, we recommend specific calibrations to ensure the bio-mechanical alignment remains precise within the constraints of the footwear."
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-32 bg-white relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-clinic-blue/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-clinic-cyan/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-20 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full"
          >
            <HelpCircle className="w-3 h-3 text-clinic-blue" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-clinic-navy">Support Center</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-black uppercase text-clinic-navy leading-tight"
          >
            FREQUENTLY ASKED <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-clinic-blue to-clinic-cyan italic">Questions.</span>
          </motion.h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-3xl border transition-all duration-300 ${
                  isOpen 
                    ? 'bg-white border-clinic-blue/20 shadow-xl shadow-clinic-blue/5' 
                    : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <span className={`text-sm md:text-base font-black uppercase tracking-tight transition-colors ${isOpen ? 'text-clinic-blue' : 'text-clinic-navy'}`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-clinic-blue text-white' : 'bg-white text-slate-400 border border-slate-100'}`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "circOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-400 text-sm font-medium">
            Still have questions? <a href="tel:+639950322139" className="text-clinic-blue font-black underline hover:text-clinic-navy transition-colors">Speak with a specialist.</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
