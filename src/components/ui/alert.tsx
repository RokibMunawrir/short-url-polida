import React from 'react';

type AlertType = 'success' | 'warning' | 'error';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose, className = "" }) => {
  const configs = {
    success: {
      bg: 'bg-emerald-50/80 dark:bg-emerald-500/10',
      border: 'border-emerald-200/50 dark:border-emerald-500/20',
      text: 'text-emerald-800 dark:text-emerald-400',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      )
    },
    warning: {
      bg: 'bg-amber-50/80 dark:bg-amber-500/10',
      border: 'border-amber-200/50 dark:border-amber-500/20',
      text: 'text-amber-800 dark:text-amber-400',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
      )
    },
    error: {
      bg: 'bg-rose-50/80 dark:bg-rose-500/10',
      border: 'border-rose-200/50 dark:border-rose-500/20',
      text: 'text-rose-800 dark:text-rose-400',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
      )
    }
  };

  const config = configs[type];

  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-md shadow-lg transition-all animate-in fade-in slide-in-from-top-4 duration-500 ${config.bg} ${config.border} ${config.text} ${className}`}>
      <div className="flex-shrink-0">
        {config.icon}
      </div>
      <div className="flex-1 text-sm font-bold leading-relaxed">
        {message}
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors group"
          aria-label="Tutup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 group-hover:opacity-100"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      )}
    </div>
  );
};

export default Alert;
