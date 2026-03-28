import { useState, useRef } from 'react';
import { actions } from 'astro:actions';
import Panel from '../ui/Panel';
import Alert from '../ui/alert';

const SettingPage = ({ 
    initialMinimized = false, 
    userRole = "User", 
    currentUser = null,
    initialSessions = []
}: { 
    initialMinimized?: boolean, 
    userRole?: string, 
    currentUser?: any,
    initialSessions?: any[]
}) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [user, setUser] = useState(currentUser || {
        name: 'Administrator Polida',
        email: 'admin@polida.ac.id',
        username: 'admin_utama',
        role: userRole,
        image: null
    });
    const [alert, setAlert] = useState<{ type: 'success' | 'warning' | 'error', message: string, isVisible: boolean }>({
        type: 'success',
        message: '',
        isVisible: false
    });
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 2 * 1024 * 1024) {
            setAlert({ type: 'error', message: 'Ukuran file maksimal 2MB', isVisible: true });
            return;
        }

        setIsUploading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            const { error } = await actions.user.updateProfile({ image: base64String });
            
            if (error) {
                setAlert({ type: 'error', message: 'Gagal mengunggah gambar: ' + error.message, isVisible: true });
            } else {
                setUser({ ...user, image: base64String });
                setAlert({ type: 'success', message: 'Foto profil berhasil diperbarui!', isVisible: true });
                setTimeout(() => setAlert(a => ({ ...a, isVisible: false })), 3000);
            }
            setIsUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const sessions = initialSessions.map(s => ({
        id: s.id,
        device: s.userAgent || 'Unknown Device',
        browser: '', // We can parse this if we want, but userAgent is already there
        ip: s.ipAddress || '0.0.0.0',
        location: 'Unknown',
        time: new Date(s.createdAt).toLocaleString(),
        status: 'Success'
    }));

    const tabs = [
        { id: 'profile', name: 'Profil Saya', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        )},
        { id: 'password', name: 'Kata Sandi', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        )},
        { id: 'history', name: 'Riwayat Login', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
        )},
    ];

    return (
        <Panel title="Pengaturan Akun" initialMinimized={initialMinimized} role={userRole}>
            <div className="max-w-6xl mx-auto space-y-8 pb-12">
                
                {alert.isVisible && (
                    <Alert 
                        type={alert.type} 
                        message={alert.message} 
                        onClose={() => setAlert({ ...alert, isVisible: false })}
                        className="mb-4"
                    />
                )}
                
                {/* Header Information */}
                <div className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[2rem] overflow-hidden ring-4 ring-blue-500/10 dark:ring-blue-500/20 shadow-2xl transition-transform group-hover:scale-105 bg-gray-100 flex items-center justify-center">
                            {user.image ? (
                                <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff&size=128`} alt="Profile" className="w-full h-full object-cover" />
                            )}
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className={`absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isUploading ? (
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                            )}
                        </button>
                    </div>
                    <div className="text-center md:text-left">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg mb-2 inline-block">
                            {user.role}
                        </span>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">{user.name}</h1>
                        <p className="text-sm font-semibold text-gray-400 dark:text-gray-500 italic">Dikelola sejak 12 Januari 2024</p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 p-2 bg-gray-100/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl backdrop-blur-sm self-start">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                activeTab === tab.id 
                                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-xl shadow-blue-500/5 border border-white dark:border-gray-700' 
                                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                            }`}
                        >
                            {tab.icon}
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="transition-all duration-300 transform">
                    {activeTab === 'profile' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        </div>
                                        Informasi Personal
                                    </h3>
                                    <form className="space-y-6" onSubmit={async (e: any) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.target);
                                        const data = Object.fromEntries(formData.entries()) as any;
                                        const { error } = await actions.user.updateProfile(data);
                                        if (error) {
                                            setAlert({ type: 'error', message: 'Gagal memperbarui profil: ' + error.message, isVisible: true });
                                            return;
                                        }
                                        setUser({ ...user, ...data });
                                        setAlert({ type: 'success', message: 'Profil berhasil diperbarui!', isVisible: true });
                                        setTimeout(() => setAlert(a => ({ ...a, isVisible: false })), 3000);
                                    }}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2 group">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">Nama Lengkap</label>
                                                <input name="name" type="text" defaultValue={user.name} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-2xl text-sm font-semibold transition-all shadow-sm" required />
                                            </div>
                                            <div className="space-y-2 group">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">Username</label>
                                                <input name="username" type="text" defaultValue={user.username} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-2xl text-sm font-semibold transition-all shadow-sm" required />
                                            </div>
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">Alamat Email</label>
                                            <input name="email" type="email" defaultValue={user.email} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-2xl text-sm font-semibold transition-all shadow-sm" required />
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <button type="submit" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 flex items-center gap-2">
                                                Simpan Perubahan
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-500/20">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-indigo-100 mb-6">Peran & Akses Akun</h3>
                                    <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 mb-6">
                                        <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-1">Peran Saat Ini</p>
                                        <h4 className="text-2xl font-black mb-4">{user.role}</h4>
                                        <p className="text-xs font-semibold text-indigo-100/80 leading-relaxed mb-4">
                                            Anda memiliki akses sebagai <span className="font-black text-white">{user.role}</span> di sistem ini. Hubungi Admin IT jika Anda membutuhkan perubahan hak akses.
                                        </p>
                                    </div>
                                    <a href="mailto:it@polida.ac.id" className="block text-center w-full py-4 bg-white text-indigo-700 font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                                        Hubungi Admin IT
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                    </div>
                                    Ubah Kata Sandi
                                </h3>
                                <form className="space-y-6" onSubmit={async (e: any) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    const { oldPassword, newPassword, confirmPassword } = Object.fromEntries(formData.entries()) as any;
                                    
                                    if (newPassword !== confirmPassword) {
                                        setAlert({ type: 'warning', message: 'Konfirmasi kata sandi tidak cocok!', isVisible: true });
                                        return;
                                    }

                                    const { error } = await actions.user.changePassword({ oldPassword, newPassword });
                                    if (error) {
                                        setAlert({ type: 'error', message: 'Gagal mengubah kata sandi: ' + error.message, isVisible: true });
                                        return;
                                    }
                                    
                                    setAlert({ type: 'success', message: 'Kata sandi berhasil diperbarui!', isVisible: true });
                                    setTimeout(() => setAlert(a => ({ ...a, isVisible: false })), 3000);
                                    e.target.reset();
                                }}>
                                    <div className="space-y-2 group">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kata Sandi Saat Ini</label>
                                        <input name="oldPassword" type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 rounded-2xl text-sm font-semibold transition-all shadow-sm" required />
                                    </div>
                                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-4 w-full"></div>
                                    <div className="space-y-2 group">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kata Sandi Baru</label>
                                        <input name="newPassword" type="password" placeholder="Minimal 8 karakter" className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-2xl text-sm font-semibold transition-all shadow-sm" required />
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Konfirmasi Kata Sandi Baru</label>
                                        <input name="confirmPassword" type="password" placeholder="Ulangi kata sandi baru" className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-transparent outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-2xl text-sm font-semibold transition-all shadow-sm" required />
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button type="submit" className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-sm rounded-2xl shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                                            Perbarui Kata Sandi
                                        </button>
                                    </div>
                                </form>
                             </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 dark:text-white">Aktivitas Sesi</h3>
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Daftar login terakhir dari akun Anda</p>
                                    </div>
                                    <button className="px-5 py-2.5 bg-rose-500/10 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                                        Log Out dari Semua Sesi
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                                            <tr>
                                                <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Perangkat & Browser</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Alamat IP</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest font-black uppercase tracking-widest">Lokasi</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Waktu</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                            {sessions.map((history) => (
                                                <tr key={history.id} className="group hover:bg-blue-50/20 dark:hover:bg-blue-900/5 transition-colors">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`p-2.5 rounded-xl ${history.device.includes('iPhone') || history.device.includes('Android') ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'} dark:opacity-80`}>
                                                                {history.device.includes('iPhone') || history.device.includes('Android') ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="12" height="20" x="6" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                                                                ) : (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 12.2V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v6.2"/><path d="M14 18v-1a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1"/><path d="M18 12.2V15a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2.8"/></svg>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">{history.device}</p>
                                                                <p className="text-[10px] font-bold text-gray-400 mt-1">{history.browser}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded-lg">
                                                            {history.ip}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-xs font-semibold text-gray-600 dark:text-gray-400">
                                                        {history.location}
                                                    </td>
                                                    <td className="px-8 py-6 text-xs font-bold text-gray-400 italic">
                                                        {history.time}
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                                            history.status === 'Success' 
                                                            ? 'bg-emerald-500/10 text-emerald-600' 
                                                            : 'bg-rose-500/10 text-rose-600'
                                                        }`}>
                                                            {history.status === 'Success' ? 'Berhasil' : 'Gagal'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </Panel>
    );
};

export default SettingPage;
