import React from 'react';

interface CyberButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '',
  disabled = false
}) => {
  const baseStyles = "relative px-6 py-3 font-bold uppercase tracking-widest transition-all duration-200 clip-corner group";
  
  const variants = {
    primary: "bg-lime-400 text-black hover:bg-white hover:shadow-[0_0_15px_#ccff00]",
    secondary: "bg-transparent border-2 border-lime-400 text-lime-400 hover:bg-lime-400/10",
    danger: "bg-red-600 text-white hover:bg-red-500"
  };

  const finalClass = `${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`;

  return (
    <button onClick={onClick} disabled={disabled} className={finalClass}>
      {/* Decorative corners */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-50"></span>
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-50"></span>
      
      {/* Glitch text effect wrapper */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};
