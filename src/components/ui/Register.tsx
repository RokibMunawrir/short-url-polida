import { useState } from 'react';
import ThemeController from './ThemeController';
import { authClient } from '../../lib/auth-client';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email,
        password,
        name,
        username,
      });

      if (authError) {
        setError(authError.message || 'Registrasi gagal. Silakan coba lagi.');
      } else {
        setRegistrationSuccess(true);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Terjadi kesalahan sistem. Silakan coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendMessage('');
    try {
      const { error: resendError } = await authClient.sendVerificationEmail({
        email,
        callbackURL: '/login',
      });
      if (resendError) {
        setResendMessage('Gagal mengirim ulang email. Silakan coba lagi.');
      } else {
        setResendMessage('Email verifikasi berhasil dikirim ulang! Periksa inbox Anda.');
      }
    } catch {
      setResendMessage('Terjadi kesalahan. Silakan coba lagi nanti.');
    }
    setResendLoading(false);
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-950 p-4 md:p-8 relative overflow-hidden transition-colors duration-500">
        {/* Background */}
        <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.06]" 
             style={{ backgroundImage: 'linear-gradient(#000 1.2px, transparent 1.2px), linear-gradient(90deg, #000 1.2px, transparent 1.2px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="absolute top-8 right-8 z-20">
          <ThemeController />
        </div>

        <div className="relative z-10 w-full max-w-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] p-10 md:p-14 text-center border border-white/50 dark:border-gray-800/50">
          
          {/* Email Icon */}
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-emerald-500/25 animate-bounce" style={{ animationDuration: '2s' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-3">
            Periksa Email Anda ✉️
          </h1>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">
            Kami telah mengirimkan email verifikasi ke
          </p>
          <p className="text-base font-black text-indigo-600 dark:text-indigo-400 mb-8">
            {email}
          </p>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-8 leading-relaxed">
            Klik tautan verifikasi di email tersebut untuk mengaktifkan akun Anda. Periksa juga folder <span className="font-black text-gray-600 dark:text-gray-300">Spam</span> jika tidak ditemukan di Inbox.
          </p>

          {/* Resend Section */}
          <div className="space-y-4">
            {resendMessage && (
              <div className={`p-4 rounded-2xl text-xs font-bold ${
                resendMessage.includes('berhasil') 
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400'
              }`}>
                {resendMessage}
              </div>
            )}
            <button
              onClick={handleResendVerification}
              disabled={resendLoading}
              className="w-full py-4 px-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-700 dark:text-gray-200 font-black text-xs uppercase tracking-widest rounded-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {resendLoading ? (
                <div className="w-4 h-4 border-2 border-gray-400/20 border-t-gray-600 rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
              )}
              Kirim Ulang Email Verifikasi
            </button>
            <a
              href="/login"
              className="block w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/25 transition-all transform active:scale-[0.98] text-center"
            >
              Masuk ke Akun Saya
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-950 p-4 md:p-8 relative overflow-hidden transition-colors duration-500">
      {/* Square Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.06]" 
           style={{ backgroundImage: 'linear-gradient(#000 1.2px, transparent 1.2px), linear-gradient(90deg, #000 1.2px, transparent 1.2px)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.04]" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '8px 8px' }}></div>
      
      {/* Floating Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-6xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row min-h-[650px] transition-all duration-500 border border-white/50 dark:border-gray-800/50">
        
        {/* Left Column - Branding (Hidden on Mobile) */}
        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-tr from-indigo-700 via-blue-600 to-violet-700 p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-3xl rotate-12 backdrop-blur-md border border-white/20"></div>
          <div className="absolute bottom-20 -left-10 w-48 h-48 bg-white/5 rounded-full backdrop-blur-xl border border-white/10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-16">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </div>
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter leading-none">Ringkas.</h2>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Politeknik Darussalam Blokagung</span>
              </div>
            </div>

            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
                Bergabung <br /> 
                <span className="text-white/40">Bersama Kami</span> <br />
                Mulai Sekarang.
              </h1>
              <p className="text-blue-100/80 text-lg font-medium leading-relaxed max-w-sm">
                Buat akun Anda dan mulai kelola link Anda dengan cerdas.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex gap-4">
            <div className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs font-bold transition-all hover:bg-white/20">
              ⚡ Statisik Real-time
            </div>
            <div className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs font-bold transition-all hover:bg-white/20">
              🔒 Keamanan Berlapis
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative bg-white/50 dark:bg-gray-900/50">
          <div className="absolute top-8 right-8">
            <ThemeController />
          </div>

          <div className="max-w-[420px] mx-auto w-full py-8">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg mb-4">
                Pendaftaran
              </span>
              <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-2">
                Buat Akun Baru ✨
              </h1>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Isi formulir di bawah untuk memulai perjalanan Anda.
              </p>
              {error && (
                <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-bold animate-shake">
                  ⚠️ {error}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 group">
                  <label htmlFor="name" className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-gray-100/50 dark:bg-gray-800/50 border border-transparent dark:border-transparent text-gray-900 dark:text-white text-sm rounded-xl block px-4 py-3 outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="John Doe"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2 group">
                  <label htmlFor="username" className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="w-full bg-gray-100/50 dark:bg-gray-800/50 border border-transparent dark:border-transparent text-gray-900 dark:text-white text-sm rounded-xl block px-4 py-3 outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="johndoe"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label htmlFor="email" className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-gray-100/50 dark:bg-gray-800/50 border border-transparent dark:border-transparent text-gray-900 dark:text-white text-sm rounded-xl block px-5 py-4 outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                  placeholder="name@campus.edu"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2 group">
                <label htmlFor="password" className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest transition-colors group-focus-within:text-blue-500">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Minimal 8 karakter"
                    className="w-full bg-gray-100/50 dark:bg-gray-800/50 border border-transparent dark:border-transparent text-gray-900 dark:text-white text-sm rounded-xl block px-5 py-4 outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-5 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-7-11-7a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-black text-sm rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-blue-600/35 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "Daftar Akun Baru 🚀"}
              </button>
            </form>

            <p className="mt-8 text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">
              Sudah punya akun? <a href="/login" className="text-blue-600 hover:text-blue-500 transition-colors">Masuk Di Sini</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
