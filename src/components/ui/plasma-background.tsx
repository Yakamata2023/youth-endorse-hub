import React from 'react';
import { cn } from '@/lib/utils';

interface PlasmaBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

const PlasmaBackground: React.FC<PlasmaBackgroundProps> = ({ className, children }) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Green Flame Plasma Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="plasma-container w-full h-full relative">
          <div className="plasma-orb plasma-orb-1 absolute rounded-full blur-[60px] animate-[plasma-float_8s_ease-in-out_infinite] bg-gradient-radial from-green-500/80 via-emerald-500/60 to-transparent w-[200px] h-[200px] top-[10%] left-[20%]"></div>
          <div className="plasma-orb plasma-orb-2 absolute rounded-full blur-[60px] animate-[plasma-float_6s_ease-in-out_infinite] bg-gradient-radial from-green-500/80 via-emerald-500/60 to-transparent w-[150px] h-[150px] top-[60%] right-[20%] animation-delay-[-2s]"></div>
          <div className="plasma-orb plasma-orb-3 absolute rounded-full blur-[60px] animate-[plasma-float_7s_ease-in-out_infinite] bg-gradient-radial from-green-500/80 via-emerald-500/60 to-transparent w-[180px] h-[180px] bottom-[20%] left-[30%] animation-delay-[-4s]"></div>
          <div className="plasma-orb plasma-orb-4 absolute rounded-full blur-[60px] animate-[plasma-float_5s_ease-in-out_infinite] bg-gradient-radial from-green-500/80 via-emerald-500/60 to-transparent w-[120px] h-[120px] top-[30%] right-[40%] animation-delay-[-6s]"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PlasmaBackground;