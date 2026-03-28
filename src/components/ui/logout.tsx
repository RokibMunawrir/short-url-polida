import { useState } from 'react';
import { authClient } from '../../lib/auth-client';
import Modal from './modal';

interface LogoutProps {
    minimized?: boolean;
    variant?: 'sidebar' | 'header';
}

const Logout: React.FC<LogoutProps> = ({ minimized = false, variant = 'sidebar' }) => {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/login";
                },
            },
        });
    };

    const triggerButton = variant === 'header' ? (
        <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="p-2 text-rose-500 hover:text-white rounded-xl hover:bg-rose-500 transition-all duration-200 active:scale-90 shadow-sm border border-transparent hover:border-rose-400"
            title="Keluar Sesi"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
    ) : minimized ? (
        <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center justify-center p-2 text-rose-500 hover:text-white rounded-lg hover:bg-rose-500 group transition-all duration-200 shadow-sm active:scale-90"
            title="Keluar Sesi"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
    ) : (
        <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center w-full p-2.5 text-rose-600 rounded-xl dark:text-rose-400 hover:bg-rose-500 hover:text-white group transition-all duration-200 shadow-sm active:scale-95"
        >
            <span className="text-rose-500 group-hover:text-white transition duration-75">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </span>
            <span className="ms-3 font-bold">Keluar Sesi</span>
        </button>
    );

    return (
        <>
            {triggerButton}

            <Modal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                title="Keluar dari Sesi?"
                type="confirm"
                size="sm"
                footer={(
                    <>
                        <button 
                            onClick={() => setIsLogoutModalOpen(false)}
                            className="flex-1 py-4 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="flex-1 py-4 bg-rose-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-rose-500/20 hover:bg-rose-700 transition-all"
                        >
                            Keluar
                        </button>
                    </>
                )}
            >
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-500 mb-6 mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                </div>
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-8 font-semibold">Anda harus login kembali untuk dapat mengelola link Polida serta data internal lainnya.</p>
            </Modal>
        </>
    );
};

export default Logout;
