const Inactive = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated Icon Container */}
        <div className="relative inline-block group">
          <div className="absolute inset-0 bg-rose-500/20 dark:bg-rose-500/10 blur-3xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-700"></div>
          <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-rose-500 to-orange-500 rounded-3xl shadow-xl shadow-rose-500/20 flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              <line x1="15" y1="9" x2="9" y2="15" />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            URL <span className="text-rose-600">Terarsipkan</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Maaf, link yang Anda tuju saat ini sudah tidak aktif atau sedang diarsipkan oleh pemiliknya.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-950/10 dark:shadow-white/5 group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="group-hover:-translate-x-1 transition-transform"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Kembali ke Dashboard
          </a>
        </div>

        {/* Footer Info */}
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] pt-8">
          Ringkas URL &copy; {new Date().getFullYear()} Politeknik Darussalam
        </p>
      </div>
    </div>
  );
};

export default Inactive;
