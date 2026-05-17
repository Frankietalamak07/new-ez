import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

export type FormFieldType = 'text' | 'select' | 'radio' | 'number' | 'textarea';

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string | string[];
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: any;
}

export interface FormConfig {
  sections: {
    id: string;
    title: string;
    fields: FormField[];
  }[];
}

interface DynamicFormProps {
  config: FormConfig;
  onSubmit: (data: Record<string, any>) => void;
  submitLabel?: string;
  isLoading?: boolean;
}

const RotatingInput: React.FC<{
  field: FormField;
  value: any;
  onChange: (val: any) => void;
}> = ({ field, value, onChange }) => {
  const [index, setIndex] = React.useState(0);
  const placeholders = Array.isArray(field.placeholder) ? field.placeholder : [field.placeholder || ''];

  React.useEffect(() => {
    if (placeholders.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders]);

  const currentPlaceholder = placeholders[index];

  if (field.type === 'textarea') {
    return (
      <textarea
        placeholder={currentPlaceholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-clinic-cyan/50 transition-all resize-none"
      />
    );
  }

  return (
    <input
      type={field.type === 'number' ? 'number' : 'text'}
      placeholder={currentPlaceholder}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-clinic-cyan/50 transition-all"
    />
  );
};

export const DynamicForm: React.FC<DynamicFormProps> = ({ config, onSubmit, submitLabel = "Execute Process", isLoading = false }) => {
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (id: string, value: any) => {
    if (isLoading) return;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    const newErrors: Record<string, string> = {};
    
    config.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.required && !formData[field.id]) {
          newErrors[field.id] = `${field.label} is required`;
        }
      });
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {config.sections.map((section) => (
        <div key={section.id} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] whitespace-nowrap">
              {section.title}
            </h4>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.fields.map((field) => (
              <div key={field.id} className="space-y-2 opacity-100 transition-opacity" style={{ opacity: isLoading ? 0.6 : 1 }}>
                <label className="block text-[10px] font-black text-white uppercase tracking-widest pl-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {(field.type === 'text' || field.type === 'number' || field.type === 'textarea') && (
                  <RotatingInput 
                    field={field} 
                    value={formData[field.id]} 
                    onChange={(val) => handleChange(field.id, val)} 
                  />
                )}

                {field.type === 'select' && (
                  <select
                    disabled={isLoading}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-clinic-cyan/50 transition-colors appearance-none disabled:cursor-not-allowed"
                  >
                    <option value="" disabled className="bg-slate-900 text-slate-500">{field.placeholder || 'Select option'}</option>
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">{opt.label}</option>
                    ))}
                  </select>
                )}

                {field.type === 'radio' && (
                  <div className="flex flex-wrap gap-3">
                    {field.options?.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleChange(field.id, opt.value)}
                        className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                          formData[field.id] === opt.value
                            ? 'bg-clinic-cyan/20 border-clinic-cyan text-clinic-cyan'
                            : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {errors[field.id] && (
                  <div className="flex items-center gap-1.5 text-red-400 text-[8px] font-bold uppercase tracking-wider mt-1 pl-1">
                    <AlertCircle className="w-3 h-3" /> {errors[field.id]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="pt-6">
        <motion.button
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          type="submit"
          disabled={isLoading}
          className={`w-full bg-clinic-blue hover:bg-clinic-cyan text-white font-black px-8 py-5 rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-clinic-blue/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-clinic-blue`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Initializing Bio-Scan...
            </>
          ) : (
            <>
              {submitLabel} <ChevronRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
};
