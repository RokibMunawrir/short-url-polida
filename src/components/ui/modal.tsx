import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    type?: 'form' | 'confirm' | 'info';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    footer?: React.ReactNode;
    showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    type = 'form',
    size = 'md',
    footer,
    showCloseButton = true
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setMounted(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!mounted && !isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-xl',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl'
    };

    const modalContent = (
        <div 
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div 
                className={`relative w-full bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 transform ${
                    sizeClasses[size]
                } ${
                    isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
                }`}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                        {title && (
                            <h2 className={`text-2xl font-black tracking-tight text-gray-900 dark:text-white ${
                                type === 'confirm' ? 'text-center w-full' : ''
                            }`}>
                                {title}
                            </h2>
                        )}
                        {showCloseButton && type !== 'confirm' && (
                            <button 
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all active:scale-90"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className={`px-8 py-4 ${type === 'confirm' ? 'text-center' : ''}`}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-8 py-6 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    // Render using Portal to ensure fixed positioning works correctly even inside transformed parents (like sidebars)
    return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default Modal;
