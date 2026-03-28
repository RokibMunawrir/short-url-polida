import { useState } from 'react';
import Panel from '../ui/Panel';
import Modal from '../ui/modal';
import { actions } from 'astro:actions';
import Alert from '../ui/alert';

const UserPage = ({ initialMinimized = false, initialUsers = [], userRole = "Admin" }: { initialMinimized?: boolean, initialUsers?: any[], userRole?: string }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Database Data
    const [users, setUsers] = useState(initialUsers);
    const [alert, setAlert] = useState<{ type: 'success' | 'warning' | 'error', message: string, isVisible: boolean }>({
        type: 'success',
        message: '',
        isVisible: false
    });

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        const { error } = await actions.user.toggleStatus({ id, status: newStatus as any });
        if (error) {
            setAlert({ type: 'error', message: 'Gagal mengubah status: ' + error.message, isVisible: true });
            return;
        }
        setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
        setAlert({ type: 'success', message: 'Status user berhasil diperbarui!', isVisible: true });
        setTimeout(() => setAlert(a => ({ ...a, isVisible: false })), 3000);
    };

    const handleDelete = async (id: string) => {
        if(confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            const { error } = await actions.user.delete({ id });
            if (error) {
                setAlert({ type: 'error', message: 'Gagal menghapus user: ' + error.message, isVisible: true });
                return;
            }
            setUsers(users.filter(u => u.id !== id));
            setAlert({ type: 'success', message: 'User berhasil dihapus!', isVisible: true });
            setTimeout(() => setAlert(a => ({ ...a, isVisible: false })), 3000);
        }
    };

    return (
        <Panel title="Manajemen User" initialMinimized={initialMinimized} role={userRole}>
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
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative group min-w-[300px]">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Cari Nama, Email, atau Username..." 
                                className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-semibold"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <select 
                                className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-[11px] font-black uppercase tracking-widest rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="all">Semua Role</option>
                                <option value="Admin">Admin</option>
                                <option value="Editor">Editor</option>
                                <option value="User">User</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        <svg className="transition-transform group-hover:rotate-90" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        Tambah User Baru
                    </button>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Identitas User</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Username</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Akses Role</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {users.filter(u => 
                                    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()) || u.username.toLowerCase().includes(searchTerm.toLowerCase())) &&
                                    (roleFilter === 'all' || u.role === roleFilter)
                                ).map((user) => (
                                    <tr key={user.id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-sm border-2 border-white dark:border-gray-700 transition-transform group-hover:scale-110 bg-gray-100 flex items-center justify-center">
                                                    {user.image ? (
                                                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`} alt={user.name} className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">{user.name}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-0.5">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-mono font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 px-2.5 py-1 rounded-lg">
                                                @{user.username}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                                user.role === 'Admin' ? 'text-indigo-600' : 'text-gray-500'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button 
                                                onClick={() => handleToggleStatus(user.id, user.status)}
                                                className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all transform active:scale-95 ${
                                                    user.status === 'Active' 
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                                                {user.status === 'Active' ? 'Aktif' : 'Nonaktif'}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                <button 
                                                    onClick={() => { setSelectedUser(user); setIsResetModalOpen(true); }}
                                                    title="Reset Password" 
                                                    className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                                </button>
                                                <button 
                                                    onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }}
                                                    title="Edit Profile" 
                                                    className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(user.id)}
                                                    title="Hapus User" 
                                                    className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Reusable Modals */}
                <Modal 
                    isOpen={isAddModalOpen || isEditModalOpen} 
                    onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                    title={isAddModalOpen ? 'Tambah User Baru' : 'Edit Profil User'}
                    size="md"
                    footer={(
                        <>
                            <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="flex-1 py-4 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Batal</button>
                            <button form="user-form" type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all">Simpan User</button>
                        </>
                    )}
                >
                    <form id="user-form" className="space-y-4" onSubmit={async (e: any) => { 
                        e.preventDefault(); 
                        const formData = new FormData(e.target);
                        const data = Object.fromEntries(formData.entries()) as any;
                        
                        if (isAddModalOpen) {
                            const { data: res, error } = await actions.user.create(data);
                            if (error) {
                                setAlert({ type: 'error', message: 'Gagal menambah user: ' + error.message, isVisible: true });
                                return;
                            }
                            // Refresh list (or just add to state)
                            setAlert({ type: 'success', message: 'User baru berhasil ditambahkan! Merefresh halaman...', isVisible: true });
                            setTimeout(() => window.location.reload(), 1500);
                            return;
                        } else {
                            const { error } = await actions.user.update({ id: selectedUser.id, ...data });
                            if (error) {
                                setAlert({ type: 'error', message: 'Gagal update user: ' + error.message, isVisible: true });
                                return;
                            }
                            setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...data } : u));
                            setAlert({ type: 'success', message: 'Data user berhasil diperbarui!', isVisible: true });
                        }
                        setIsAddModalOpen(false); 
                        setIsEditModalOpen(false); 
                        setTimeout(() => setAlert(a => ({ ...a, isVisible: false })), 3000);
                    }}>
                        <div className="space-y-1.5 group">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-indigo-500">Nama Lengkap</label>
                            <input name="name" type="text" defaultValue={isEditModalOpen ? selectedUser?.name : ''} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-transparent outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-2xl text-sm font-semibold transition-all shadow-sm" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                                <input name="username" type="text" defaultValue={isEditModalOpen ? selectedUser?.username : ''} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-transparent outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-2xl text-sm font-semibold transition-all shadow-sm" required />
                            </div>
                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role</label>
                                <select name="role" className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-transparent outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-2xl text-sm font-semibold transition-all shadow-sm" defaultValue={isEditModalOpen ? selectedUser?.role : 'User'}>
                                    <option value="Admin">Admin</option>
                                    <option value="Editor">Editor</option>
                                    <option value="User">User</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5 group">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                            <input name="email" type="email" defaultValue={isEditModalOpen ? selectedUser?.email : ''} className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-transparent outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-2xl text-sm font-semibold transition-all shadow-sm" required />
                        </div>
                        {isAddModalOpen && (
                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kata Sandi Awal</label>
                                <input name="password" type="password" placeholder="••••••••" className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-transparent outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 rounded-2xl text-sm font-semibold transition-all shadow-sm" required />
                            </div>
                        )}
                    </form>
                </Modal>

                <Modal
                    isOpen={isResetModalOpen}
                    onClose={() => setIsResetModalOpen(false)}
                    title="Reset Kata Sandi"
                    size="sm"
                    type="confirm"
                    footer={(
                        <>
                            <button type="button" onClick={() => setIsResetModalOpen(false)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Batal</button>
                            <button form="reset-form" type="submit" className="flex-1 py-4 bg-amber-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-amber-500/20 hover:bg-amber-700 transition-all">Update Sandi</button>
                        </>
                    )}
                >
                    <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 mb-6 mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-8 font-semibold">Anda akan mengatur ulang kata sandi untuk <span className="text-indigo-600">@{selectedUser?.username}</span></p>
                    <form id="reset-form" className="space-y-4" onSubmit={async (e: any) => { 
                        e.preventDefault(); 
                        const formData = new FormData(e.target);
                        const { password } = Object.fromEntries(formData.entries()) as any;
                        const { error } = await actions.user.resetPassword({ id: selectedUser.id, password });
                        if (error) {
                            setAlert({ type: 'error', message: 'Gagal reset password: ' + error.message, isVisible: true });
                            return;
                        }
                        setAlert({ type: 'success', message: 'Password berhasil diperbarui!', isVisible: true });
                        setIsResetModalOpen(false); 
                        setTimeout(() => setAlert(a => ({ ...a, isVisible: false })), 3000);
                    }}>
                        <div className="space-y-1.5 group">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-left block">Kata Sandi Baru</label>
                            <input name="password" type="password" placeholder="••••••••" className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-transparent outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 rounded-2xl text-sm font-semibold transition-all shadow-sm" required />
                        </div>
                    </form>
                </Modal>
            </div>
        </Panel>
    );
};

export default UserPage;
