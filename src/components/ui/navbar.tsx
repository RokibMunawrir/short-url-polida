import { useState, useEffect } from "react";
import ThemeController from "./ThemeController";

interface NavbarProps {
  session?: any;
}

const Navbar = ({ session }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Use a consistent threshold for scroll effect
      setScrolled(window.scrollY > 40);
    };
    
    // Check initial scroll position
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "#" },
    { name: "Fitur", href: "#features" },
    { name: "Statistik", href: "#stats" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? "py-3 bg-white/60 dark:bg-gray-950/60 backdrop-blur-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.05)] border-b border-gray-100/50 dark:border-gray-800/30"
          : "py-6 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span className="text-xl font-black italic tracking-tighter text-gray-900 dark:text-white">
            Ringkas.
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors uppercase tracking-widest text-[11px]"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-6">
          <ThemeController />
          
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800"></div>

          {session ? (
            <a
              href="/dashboard"
              className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gray-200 dark:shadow-none"
            >
              Dashboard 🚀
            </a>
          ) : (
            <div className="flex items-center gap-4">
              <a
                href="/login"
                className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Masuk
              </a>
              <a
                href="/register"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all"
              >
                Mulai Gratis
              </a>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeController />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-600 dark:text-gray-300"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900 transition-all duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-[400px] opacity-100 py-6" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="px-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="h-px w-full bg-gray-100 dark:bg-gray-900 my-2"></div>
          {session ? (
            <a
              href="/dashboard"
              className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-center font-black uppercase tracking-widest rounded-xl text-xs"
            >
              Dashboard 🚀
            </a>
          ) : (
            <>
              <a
                href="/login"
                className="w-full py-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white text-center font-black uppercase tracking-widest rounded-xl text-xs"
              >
                Masuk
              </a>
              <a
                href="/register"
                className="w-full py-4 bg-blue-600 text-white text-center font-black uppercase tracking-widest rounded-xl text-xs shadow-lg shadow-blue-500/20"
              >
                Daftar Sekarang
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
