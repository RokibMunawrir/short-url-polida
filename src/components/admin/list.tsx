import { useState, useEffect } from 'react';
import Panel from '../ui/Panel';
import Modal from '../ui/modal';
import Alert from '../ui/alert';
import { QRCodeSVG } from 'qrcode.react';
import { actions } from 'astro:actions';

interface UrlItem {
    id: string;
    shortCode: string;
    originalUrl: string;
    title?: string | null;
    clicks: number;
    createdAt: Date | string;
    status: string;
}

const List = ({ 
    initialMinimized = false,
    initialUrls = [],
    userRole = "User"
}: { 
    initialMinimized?: boolean,
    initialUrls?: UrlItem[],
    userRole?: string
}) => {
    const baseUrl = import.meta.env.PUBLIC_BASE_URL || 'http://localhost:4321';
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [urls] = useState<UrlItem[]>(initialUrls);
    const [editingUrl, setEditingUrl] = useState<UrlItem | null>(null);
    const [urlIdToDelete, setUrlIdToDelete] = useState<string | null>(null);
    const [urlForQr, setUrlForQr] = useState<string | null>(null);
    
    const [urlData, setUrlData] = useState({
        originalUrl: '',
        title: '',
        shortCode: '',
        status: 'Active'
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

    const handleOpenModal = (url: UrlItem | null = null) => {
        if (url) {
            setEditingUrl(url);
            setUrlData({
                originalUrl: url.originalUrl,
                title: url.title || '',
                shortCode: url.shortCode,
                status: url.status || 'Active'
            });
        } else {
            setEditingUrl(null);
            setUrlData({ originalUrl: '', title: '', shortCode: '', status: 'Active' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        const action = editingUrl ? actions.url.update : actions.url.create;
        const input = editingUrl 
            ? { id: editingUrl.id, ...urlData } 
            : { ...urlData, userId: 'user_1' };

        const { error } = await action(input as any);

        if (!error) {
            setAlert({ 
                type: 'success', 
                message: editingUrl ? 'URL berhasil diperbarui!' : 'URL berhasil disingkatkan!', 
                isVisible: true 
            });
            setIsModalOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            setAlert({ type: 'error', message: "Gagal memproses URL: " + error.message, isVisible: true });
        }
    };

    const handleDelete = (id: string) => {
        setUrlIdToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!urlIdToDelete) return;
        
        const { error } = await actions.url.delete({ id: urlIdToDelete });
        if (!error) {
            setAlert({ type: 'success', message: 'URL berhasil dihapus!', isVisible: true });
            setIsDeleteModalOpen(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            setAlert({ type: 'error', message: "Gagal menghapus URL: " + error.message, isVisible: true });
        }
    };

    const filteredUrls = urls.filter(u => {
        const matchesSearch = u.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (u.title && u.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                             u.shortCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || u.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <Panel title="Daftar URL" initialMinimized={initialMinimized} role={userRole}>
            <div className="space-y-6">
                
                {alert.isVisible && (
                    <Alert 
                        type={alert.type} 
                        message={alert.message} 
                        onClose={() => setAlert({ ...alert, isVisible: false })}
                        className="mb-4"
                    />
                )}
                
                {/* Header Actions */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative group min-w-[300px]">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Cari URL, Link Asal..." 
                                className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <select 
                                className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-[11px] font-black uppercase tracking-widest rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Semua Status</option>
                                <option value="active">Aktif</option>
                                <option value="archived">Arsip</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        onClick={() => handleOpenModal()}
                        className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        <svg className="transition-transform group-hover:rotate-90" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        Singkatkan URL Baru
                    </button>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">URL Pendek</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Link Asal</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-center">Klik</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {filteredUrls.map((url) => (
                                    <tr key={url.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 transform group-hover:rotate-12 transition-transform shadow-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                                </div>
                                                <div>
                                                    <a 
                                                        href={`${baseUrl}/${url.shortCode}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-sm font-black text-gray-900 dark:text-white leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                    >
                                                        {baseUrl.replace(/^https?:\/\//, '')}/{url.shortCode}
                                                    </a>
                                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-0.5">{new Date(url.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 max-w-xs truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={url.originalUrl}>
                                                {url.originalUrl}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-100 dark:bg-gray-900 text-[11px] font-black text-gray-700 dark:text-gray-300 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {url.clicks.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                                url.status === 'Active' 
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${url.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`}></span>
                                                {url.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                <button 
                                                    onClick={() => handleOpenModal(url)}
                                                    title="Edit URL" 
                                                    className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                                </button>
                                                <button 
                                                    title="QR Code" 
                                                    onClick={() => {
                                                        setUrlForQr(`${baseUrl}/${url.shortCode}`);
                                                        setIsQrModalOpen(true);
                                                    }}
                                                    className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-.01"/></svg>
                                                </button>
                                                <button 
                                                    title="Salin Link" 
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(`${baseUrl}/${url.shortCode}`);
                                                        setAlert({ type: 'success', message: 'Link berhasil disalin!', isVisible: true });
                                                        setTimeout(() => setAlert(a => ({ ...a, isVisible: false })), 2000);
                                                    }}
                                                    className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(url.id)}
                                                    title="Hapus" 
                                                    className="p-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUrls.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-10 text-center text-gray-500 font-bold italic">
                                            Tidak ada URL ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-8 py-6 bg-gray-50/30 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            Menampilkan <span className="text-gray-900 dark:text-white">1 - {filteredUrls.length}</span> dari <span className="text-gray-900 dark:text-white">{filteredUrls.length}</span> URL
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal Tambah/Edit URL */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUrl ? "Edit URL" : "Singkatkan URL Baru"}
                footer={
                    <>
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 font-black text-xs rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={handleSubmit}
                            className="px-6 py-3 bg-blue-600 text-white font-black text-xs rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                        >
                            {editingUrl ? "Simpan Perubahan" : "Singkatkan Sekarang"}
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
                            value={urlData.originalUrl}
                            onChange={(e) => setUrlData({...urlData, originalUrl: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Nama/Judul (Opsional)</label>
                        <input 
                            type="text" 
                            placeholder="Contoh: Pendaftaran Mahasiswa Baru"
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold"
                            value={urlData.title}
                            onChange={(e) => setUrlData({...urlData, title: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Custom End (Opsional)</label>
                            <input 
                                type="text" 
                                placeholder="custom-link"
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold"
                                value={urlData.shortCode}
                                onChange={(e) => setUrlData({...urlData, shortCode: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1.5 ml-1">Status</label>
                            <select 
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-semibold"
                                value={urlData.status}
                                onChange={(e) => setUrlData({...urlData, status: e.target.value})}
                            >
                                <option value="Active">Aktif</option>
                                <option value="Archived">Arsip</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Hapus URL"
                type="confirm"
                footer={
                    <>
                        <button 
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 font-black text-xs rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={confirmDelete}
                            className="flex-1 px-6 py-3 bg-rose-600 text-white font-black text-xs rounded-2xl shadow-lg shadow-rose-500/20 hover:bg-rose-700 transition-all"
                        >
                            Hapus Sekarang
                        </button>
                    </>
                }
            >
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                    <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 leading-relaxed">
                            Apakah Anda yakin ingin menghapus URL ini? Tindakan ini tidak dapat dibatalkan secara langsung.
                        </p>
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

export default List;