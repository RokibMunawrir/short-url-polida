import { useState, useEffect } from 'react';
import Panel from '../ui/Panel';
import Modal from '../ui/modal';
import Alert from '../ui/alert';
import { QRCodeSVG } from 'qrcode.react';
import { actions } from 'astro:actions';

const Dashboard = ({ 
    initialMinimized = false,
    serverStats = { totalUrls: 0, totalClicks: 0, userAktif: 0, clickRate: 0 },
    recentUrls: serverUrls = [],
    topUsers: serverTopUsers = [],
    userRole = "User"
}: { 
    initialMinimized?: boolean,
    serverStats?: { totalUrls: number, totalClicks: number, userAktif: number, clickRate: number },
    recentUrls?: any[],
    topUsers?: any[],
    userRole?: string
}) => {
    const baseUrl = import.meta.env.PUBLIC_BASE_URL || 'http://localhost:4321';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [urlForQr, setUrlForQr] = useState<string | null>(null);
    const [newUrlData, setNewUrlData] = useState({
        originalUrl: '',
        title: '',
        shortCode: ''
    });

    const [alert, setAlert] = useState<{ type: 'success' | 'warning' | 'error', message: string, isVisible: boolean }>({
        type: 'success',
        message: '',
        isVisible: false
    });

    const [logoBase64, setLogoBase64] = useState<string>("");

    useEffect(() => {
        fetch('/logo.png')
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => setLogoBase64(reader.result as string);
                reader.readAsDataURL(blob);
            });
    }, []);

    const stats = [
        { name: 'Total URL', value: serverStats.totalUrls.toLocaleString(), icon: '🔗', change: 'Live', color: 'blue' },
        { name: 'Total Klik', value: serverStats.totalClicks.toLocaleString(), icon: '🖱️', change: 'Live', color: 'indigo' },
        { name: 'User Aktif', value: serverStats.userAktif.toLocaleString(), icon: '👥', change: 'Live', color: 'emerald' },
        { name: 'Click Rate', value: `${serverStats.clickRate}%`, icon: '📈', change: 'Live', color: 'amber' },
    ];

    const monthlyStats = [
        { month: 'Jan', value: 45 },
        { month: 'Feb', value: 52 },
        { month: 'Mar', value: 38 },
        { month: 'Apr', value: 65 },
        { month: 'Mei', value: 48 },
        { month: 'Jun', value: 72 },
    ];

    const topUsers = serverTopUsers.length > 0 
        ? serverTopUsers.map(u => ({
            name: u.name || 'Anonymous',
            urls: u.urlsCount,
            clicks: Number(u.totalClicks || 0)
        }))
        : [
            { name: 'Belum ada data', urls: 0, clicks: 0 },
        ];

    const recentUrls = serverUrls.map(u => ({
        short: `${baseUrl}/${u.shortCode}`,
        long: u.originalUrl,
        clicks: u.clicks,
        createdAt: u.createdAt
    }));

    const handleCreateUrl = async () => {
        const { data, error } = await actions.url.create({
            ...newUrlData,
            userId: 'user_1'
        });

        if (!error) {
            setAlert({ type: 'success', message: 'URL berhasil disingkatkan!', isVisible: true });
            setIsModalOpen(false);
            setNewUrlData({ originalUrl: '', title: '', shortCode: '' });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            setAlert({ type: 'error', message: "Gagal membuat URL: " + error.message, isVisible: true });
        }
    };

    return (
        <Panel title="Dashboard" initialMinimized={initialMinimized} role={userRole}>
            <div className="space-y-6">
                
                {alert.isVisible && (
                    <Alert 
                        type={alert.type} 
                        message={alert.message} 
                        onClose={() => setAlert({ ...alert, isVisible: false })}
                        className="mb-4"
                    />
                )}
                
                {/* Search & Quick Action Header */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex-1 w-full max-w-xl relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Cari URL atau statistik user..." 
                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full md:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        Buat URL Baru
                    </button>
                </div>

                {/* Stats Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                    <span className="text-2xl">{s.icon}</span>
                                </div>
                                <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${s.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                                    {s.change}
                                </span>
                            </div>
                            <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{s.name}</h3>
                            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Charts & Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Monthly Chart (Left/Main) */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white">Statistik Perbulan</h3>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Ikhtisar pembuatan link 6 bulan terakhir</p>
                            </div>
                            <select className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-[11px] font-black uppercase rounded-xl px-3 py-2 outline-none">
                                <option>Tahun 2026</option>
                                <option>Tahun 2025</option>
                            </select>
                        </div>
                        
                        <div className="h-64 flex items-end justify-between gap-2 px-2 relative">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between py-1 opacity-10">
                                {[1,2,3,4].map(l => <div key={l} className="w-full border-t border-gray-400"></div>)}
                            </div>
                            
                            {monthlyStats.map((m, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative z-10">
                                    <div 
                                        className="w-full max-w-[40px] bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-xl transition-all duration-500 group-hover:from-blue-500 group-hover:to-indigo-400 relative"
                                        style={{ height: `${m.value}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {m.value}%
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-tight">{m.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Info (Right) */}
                    <div className="space-y-6">
                        
                        {/* User Stats Card */}
                        <div className="bg-gradient-to-br from-indigo-700 to-purple-800 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-indigo-100 mb-6">Top User Bulan Ini</h3>
                            <div className="space-y-4">
                                {topUsers.map((u, i) => (
                                    <div key={i} className="flex items-center justify-between pb-3 border-b border-white/10 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black border border-white/20">
                                                {u.name.charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold">{u.name}</span>
                                        </div>
                                        <span className="text-xs font-black bg-white/10 px-2 py-1 rounded-lg">{u.urls} URL</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Insight Card */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 px-1">Ringkasan Sistem</h3>
                            <div className="space-y-3">
                                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">Lonjakan Trafik</p>
                                    <h4 className="text-xl font-black text-gray-900 dark:text-white leading-tight mt-1">+2.4k Klik</h4>
                                    <p className="text-[10px] font-semibold text-gray-400 mt-1 italic">Dalam 24 jam terakhir</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent URLs & Detailed Stats Table */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">Statistik URL Terbaru</h3>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Monitoring performa link yang baru dibuat</p>
                        </div>
                        <a href="/daftar" className="px-4 py-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 text-[10px] font-black uppercase rounded-xl transition-colors border border-gray-100 dark:border-gray-700 text-center">
                            Lihat Semua Link
                        </a>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest rounded-l-2xl">URL Pendek</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">URL Asal</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">Total Klik</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right rounded-r-2xl">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {recentUrls.map((url, idx) => (
                                    <tr key={idx} className="group hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 transform group-hover:rotate-6 transition-transform shadow-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                                </div>
                                                <div>
                                                    <a 
                                                        href={url.short} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-sm font-black text-gray-900 dark:text-white leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                    >
                                                        {url.short.replace(/^https?:\/\//, '')}
                                                    </a>
                                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-0.5">{new Date(url.createdAt).toLocaleDateString()} • Aktif</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 max-w-xs truncate" title={url.long}>
                                                {url.long}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 dark:bg-gray-900 text-[11px] font-black text-gray-700 dark:text-gray-300 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {url.clicks.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                <button 
                                                    title="QR Code" 
                                                    onClick={() => {
                                                        setUrlForQr(url.short);
                                                        setIsQrModalOpen(true);
                                                    }}
                                                    className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-.01"/></svg>
                                                </button>
                                                <button 
                                                    title="Salin Link" 
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(url.short);
                                                        setAlert({ type: 'success', message: 'Link berhasil disalin!', isVisible: true });
                                                        setTimeout(() => setAlert(a => ({ ...a, isVisible: false })), 2000);
                                                    }}
                                                    className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Tambah URL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Singkatkan URL Baru"
                footer={
                    <>
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 font-black text-xs rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={handleCreateUrl}
                            className="px-6 py-3 bg-blue-600 text-white font-black text-xs rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                        >
                            Singkatkan Sekarang
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">URL Asal</label>
                        <input 
                            type="url" 
                            placeholder="https://example.com/very-long-url"
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold"
                            value={newUrlData.originalUrl}
                            onChange={(e) => setNewUrlData({...newUrlData, originalUrl: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Nama/Judul (Opsional)</label>
                        <input 
                            type="text" 
                            placeholder="Contoh: Pendaftaran Mahasiswa Baru"
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold"
                            value={newUrlData.title}
                            onChange={(e) => setNewUrlData({...newUrlData, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Custom End (Opsional)</label>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 font-bold text-sm">{baseUrl.replace(/^https?:\/\//, '')}/</span>
                            <input 
                                type="text" 
                                placeholder="custom-link"
                                className="flex-1 px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold"
                                value={newUrlData.shortCode}
                                onChange={(e) => setNewUrlData({...newUrlData, shortCode: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Modal QR Code */}
            <Modal
                isOpen={isQrModalOpen}
                onClose={() => setIsQrModalOpen(false)}
                title="Bagikan QR Code"
                size="md"
                footer={
                    <button 
                        onClick={() => setIsQrModalOpen(false)}
                        className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 font-black text-xs rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                        Tutup
                    </button>
                }
            >
                <div className="flex flex-col sm:flex-row items-center gap-8 py-4">
                    {/* Brand/Logo/Decor section (Left or Top) */}
                    <div className="flex-shrink-0">
                        <div className="p-4 bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 transition-all hover:scale-[1.02] duration-500 group">
                            {urlForQr && (
                                <QRCodeSVG 
                                    id="qr-code-canvas"
                                    value={urlForQr} 
                                    size={200}
                                    level="H"
                                    marginSize={0}
                                    imageSettings={{
                                        src: logoBase64 || "/logo.png",
                                        x: undefined,
                                        y: undefined,
                                        height: 50,
                                        width: 50,
                                        excavate: true,
                                    }}
                                    className="dark:bg-white p-2 rounded-xl"
                                />
                            )}
                        </div>
                    </div>

                    {/* Info and Actions (Right or Bottom) */}
                    <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left space-y-6">
                        <div className="space-y-3 w-full">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100/50 dark:border-indigo-800/50">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/></svg>
                                <span className="text-[10px] font-black uppercase tracking-widest">URL Pendek Aktif</span>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">Siap Bagikan URL Anda</h3>
                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 w-full group">
                                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase mb-1">Target Link</p>
                                <p className="text-xs font-bold text-blue-500 break-all leading-relaxed">{urlForQr}</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                const svg = document.getElementById('qr-code-canvas');
                                if (svg) {
                                    const svgData = new XMLSerializer().serializeToString(svg);
                                    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
                                    const svgUrl = URL.createObjectURL(svgBlob);
                                    const downloadLink = document.createElement('a');
                                    downloadLink.href = svgUrl;
                                    downloadLink.download = `qrcode-${Math.random().toString(36).substring(7)}.svg`;
                                    document.body.appendChild(downloadLink);
                                    downloadLink.click();
                                    document.body.removeChild(downloadLink);
                                }
                            }}
                            className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-[1.25rem] hover:bg-indigo-700 hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/20 group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-0.5 transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                            Download QR (.svg)
                        </button>
                    </div>
                </div>
            </Modal>
        </Panel>
    );
};

export default Dashboard;