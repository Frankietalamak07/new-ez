import React from 'react';

export const Logo: React.FC<{ className?: string, hideText?: boolean }> = ({ className = '', hideText = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative h-12 flex items-center">
        <img 
          src="https://files.cdn-files-a.com/uploads/10385685/400_67bc00e4f1c30.png" 
          alt="EZStep Logo" 
          className="h-full w-auto object-contain"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-clinic-blue/5 blur-2xl rounded-full -z-1" />
      </div>
      
      {/* Show text branding next to the official logo image */}
      {!hideText && (
        <div className="flex flex-col -space-y-1">
          <span className="font-display font-black text-xl tracking-tighter text-clinic-navy italic">
            EZSTEP
          </span>
          <span className="text-[7px] font-black tracking-[0.3em] text-clinic-blue uppercase">
            ONE STEP AHEAD
          </span>
        </div>
      )}
    </div>
  );
};
