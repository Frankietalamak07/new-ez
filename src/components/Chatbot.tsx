import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2, User, Sparkles, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Welcome to EZStep Clinical. I am your Bio-Orthopedic Assistant. How can I help you optimize your alignment today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const QUICK_QUESTIONS = [
    { label: "Clinic Locations", query: "Where are your clinics located and what are their hours?" },
    { label: "Manufacturing Time", query: "How long does it take to make custom insoles?" },
    { label: "Treatment Cost", query: "How much does a consultation and scan cost?" },
    { label: "Arch Support", query: "Can you help with flat feet or high arches?" }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customQuery?: string) => {
    const queryToSend = (customQuery || input).trim();
    if (!queryToSend || isLoading) return;

    if (!customQuery) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: queryToSend }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', text: queryToSend }] 
        }),
      });

      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.text }]);
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "I apologize, but I'm having trouble connecting to the clinical network. Please try again or call one of our branches directly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            className="mb-4 w-[380px] h-[600px] bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-clinic-navy text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-clinic-blue/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-clinic-cyan" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight">Clinical Assistant</h3>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">AI Agent Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-slate-50/50"
            >
              <div className="text-center pb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Common Procedures</p>
                <div className="flex flex-wrap gap-2 justify-center">
                   {QUICK_QUESTIONS.map((q) => (
                     <button
                       key={q.label}
                       onClick={() => handleSend(q.query)}
                       className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-wider text-clinic-navy hover:border-clinic-blue hover:text-clinic-blue transition-all shadow-sm"
                     >
                       {q.label}
                     </button>
                   ))}
                </div>
              </div>

              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    m.role === 'user' ? 'bg-clinic-blue text-white' : 'bg-clinic-navy text-white'
                  }`}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-[13px] leading-relaxed relative ${
                    m.role === 'user' 
                      ? 'bg-clinic-blue text-white rounded-tr-none' 
                      : 'bg-white text-slate-600 shadow-sm border border-slate-100 rounded-tl-none'
                  }`}>
                    {m.role === 'assistant' ? (
                      <div className="markdown-body chat-markdown">
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                      </div>
                    ) : (
                      m.text
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-clinic-navy text-white flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-clinic-cyan" />
                  </div>
                  <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                    <span className="text-[11px] font-black text-clinic-blue uppercase tracking-widest animate-pulse">Consulting engine...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 group focus-within:border-clinic-blue transition-colors">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about insoles or clinics..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 text-slate-800 placeholder:text-slate-400 font-medium"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-clinic-navy text-white flex items-center justify-center hover:bg-clinic-blue active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-clinic-navy/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[8px] text-center text-slate-400 mt-2 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" /> AI suggestions for general guidance only.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-[2rem] bg-clinic-navy text-white flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 border-clinic-blue/20 relative group hover:bg-clinic-blue transition-colors"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-7 h-7 text-clinic-cyan" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative"
            >
              <MessageCircle className="w-7 h-7" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-clinic-cyan rounded-full border-2 border-clinic-navy animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Floating Label */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-20 bg-clinic-navy text-white px-4 py-2 rounded-xl border border-clinic-blue/30 whitespace-nowrap hidden lg:block"
            >
              <div className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-clinic-cyan" /> Clinical AI Support
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
