import React, { useState, useEffect } from 'react';
import SidebarMinimized from './SidebarMinimized';
import SidebarExpanded from './SidebarExpanded';
import ThemeController from './ThemeController';
import Logout from './logout';

interface PanelProps {
  children: React.ReactNode;
  title?: string;
  initialMinimized?: boolean;
  role?: string;
}

const Panel: React.FC<PanelProps> = ({ children, title = "Panel Dashboard", initialMinimized = false, role = "User" }) => {
  // Initialize state from prop (set by server) or document attribute
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== 'undefined') {
      const attr = document.documentElement.getAttribute('data-sidebar-minimized');
      if (attr !== null) return attr === 'true';
    }
    return initialMinimized;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Sync state with Cookie and data attribute
  useEffect(() => {
    if (isLoaded) {
      // Set cookie (expires in 1 year)
      document.cookie = `sidebar-minimized=${isMinimized}; path=/; max-age=31536000; SameSite=Lax`;
      
      if (isMinimized) {
        document.documentElement.setAttribute('data-sidebar-minimized', 'true');
      } else {
        document.documentElement.removeAttribute('data-sidebar-minimized');
      }
    }
  }, [isMinimized, isLoaded]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white ml-2">
                {title}
              </span>
              <button
                onClick={toggleMinimize}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition-colors duration-200 ml-2"
              >
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2 absolute right-4 top-2.5">
              <ThemeController />
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
              <Logout variant="header" />
            </div>
          </div>
        </div>
      </nav>

      {isMinimized ? <SidebarMinimized role={role} /> : <SidebarExpanded role={role} />}
      
      {/* Backdrop for mobile */}
      {isMinimized && (
        <div 
          className="fixed inset-0 z-30 bg-gray-900/50 dark:bg-gray-900/80 sm:hidden transition-opacity duration-300"
          onClick={() => setIsMinimized(false)}
        ></div>
      )}

      <div 
        className="panel-content-wrapper p-4 pt-20 transition-all duration-300"
        style={{ marginLeft: 'var(--content-margin)' }}
      >
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Panel;
