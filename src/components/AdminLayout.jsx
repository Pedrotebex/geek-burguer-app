import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    const navLinks = [
        { to: "/admin/dashboard", icon: "dashboard", text: "Dashboard" },
        { to: "/admin/add-product", icon: "add_box", text: "Adicionar" },
        { to: "/admin/media", icon: "photo_library", text: "Mídias" }
    ];

    return (
        <div className="flex flex-col md:flex-row h-screen bg-background text-text-primary">
            {/* Sidebar para Desktop */}
            <aside className="hidden lg:flex w-64 bg-surface flex-col p-4">
                <h1 className="text-2xl text-center font-bold mb-8">Geek Burguer Admin</h1>
                <nav className="flex flex-col space-y-2">
                    {navLinks.map(link => (
                         <NavLink 
                            key={link.to}
                            to={link.to} 
                            className={({ isActive }) => 
                                `flex items-center px-4 py-2 rounded transition-colors ${isActive ? 'bg-primary text-white' : 'hover:bg-background'}`
                            }
                        >
                             <span className="material-symbols-outlined mr-3">{link.icon}</span>
                             {link.text}
                         </NavLink>
                    ))}
                </nav>
                <button onClick={handleLogout} className="mt-auto flex items-center px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">
                    <span className="material-symbols-outlined mr-3">logout</span>
                    Sair
                </button>
            </aside>

            {/* Conteúdo Principal */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-20 md:pb-8">
                <Outlet />
            </main>

            {/* Navegação Inferior para Mobile */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-700 flex justify-around p-1">
                {navLinks.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center p-2 rounded-lg w-full transition-colors ${
                                isActive ? 'text-primary' : 'text-text-secondary'
                            }`
                        }
                    >
                        <span className="material-symbols-outlined">{link.icon}</span>
                        <span className="text-xs mt-1">{link.text}</span>
                    </NavLink>
                ))}
                <button onClick={handleLogout} className="flex flex-col items-center justify-center p-2 rounded-lg text-text-secondary w-full">
                    <span className="material-symbols-outlined">logout</span>
                    <span className="text-xs mt-1">Sair</span>
                </button>
            </nav>
        </div>
    );
}
