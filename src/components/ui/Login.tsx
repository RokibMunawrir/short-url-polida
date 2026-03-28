import { useState } from 'react';
import ThemeController from './ThemeController';
import { authClient } from '../../lib/auth-client';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setEmailNotVerified(false);
    setResendMessage('');

    try {
      const isEmail = email.includes('@');
      const signInOptions = {
        password: password,
        callbackURL: "/dashboard"
      };

      const result = await (isEmail 
        ? authClient.signIn.email({ email, ...signInOptions })
        : authClient.signIn.username({ username: email, ...signInOptions }));

      if (result.error) {
        const authError = result.error;
        const msg = authError.message || '';
        if (msg.toLowerCase().includes('email is not verified') || 
            msg.toLowerCase().includes('email not verified') || 
            msg.toLowerCase().includes('verify your email')) {
          setEmailNotVerified(true);
          setError('Email Anda belum diverifikasi. Silakan periksa inbox email Anda.');
        } else {
          setError(msg || 'Login gagal. Periksa kembali email/username dan kata sandi Anda.');
        }
      } else {
        // Force redirect to dashboard on success
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('Login error:', err);
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
        setResendMessage('Gagal mengirim ulang email verifikasi.');
      } else {
        setResendMessage('Email verifikasi berhasil dikirim ulang! Periksa inbox Anda.');
      }
    } catch {
      setResendMessage('Terjadi kesalahan. Silakan coba lagi nanti.');
    }
    setResendLoading(false);
  };

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
          {/* Abstract Glass Elements */}
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
                Satu Link <br /> 
                <span className="text-white/40">Untuk Semua</span> <br />
                Koneksi Anda.
              </h1>
              <p className="text-blue-100/80 text-lg font-medium leading-relaxed max-w-sm">
                Kelola ribuan link dengan satu dashboard cerdas yang terintegrasi dengan ekosistem kampus.
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

          <div className="max-w-[380px] mx-auto w-full">
            <div className="mb-12">
              <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg mb-4">
                Area Login
              </span>
              <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-3">
                Halo Lagi! 👋
              </h1>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Silakan masuk untuk melanjutkan akses ke portal internal kampus.
              </p>
              {error && (
                <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-bold animate-shake">
                  ⚠️ {error}
                </div>
              )}
              {emailNotVerified && (
                <div className="mt-4 space-y-3">
                  {resendMessage && (
                    <div className={`p-3 rounded-xl text-xs font-bold ${
                      resendMessage.includes('berhasil') 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400'
                    }`}>
                      {resendMessage}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resendLoading}
                    className="w-full py-3 px-4 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 disabled:opacity-50 text-amber-700 dark:text-amber-400 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    {resendLoading ? (
                      <div className="w-3.5 h-3.5 border-2 border-amber-400/20 border-t-amber-600 rounded-full animate-spin"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                    )}
                    Kirim Ulang Verifikasi
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 group">
                <label htmlFor="email" className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">
                  Email atau Username
                </label>
                <input
                  type="text"
                  id="email"
                  className="w-full bg-gray-100/50 dark:bg-gray-800/50 border border-transparent dark:border-transparent text-gray-900 dark:text-white text-sm rounded-2xl block px-5 py-4 outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                  placeholder="name@campus.edu"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2 group">
                <div className="flex items-center justify-between px-1">
                  <label htmlFor="password" className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest transition-colors group-focus-within:text-blue-500">
                    Kata Sandi
                  </label>
                  <a href="#" className="text-[10px] font-black text-blue-600 hover:text-blue-500 tracking-widest uppercase transition-colors">Lupa?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Masukkan sandi Anda"
                    className="w-full bg-gray-100/50 dark:bg-gray-800/50 border border-transparent dark:border-transparent text-gray-900 dark:text-white text-sm rounded-2xl block px-5 py-4 outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                    required
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
                className="w-full py-4.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-600/35 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "Masuk Sekarang 🚀"}
              </button>

              <div className="flex items-center gap-4 py-3">
                <div className="h-px w-full bg-gray-200 dark:bg-gray-800"></div>
                <span className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest whitespace-nowrap italic">Opsi Cepat</span>
                <div className="h-px w-full bg-gray-200 dark:bg-gray-800"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="group w-full py-3.5 px-5 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all flex items-center justify-center gap-2.5 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="group w-full py-3.5 px-5 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-[#1877F2]/30 dark:hover:border-[#1877F2]/30 transition-all flex items-center justify-center gap-2.5 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
              </div>
            </form>
          </div>

          <p className="mt-12 text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">
            Belum punya akun? <a href="/register" className="text-blue-600 hover:text-blue-500 transition-colors">Daftar Sekarang</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
