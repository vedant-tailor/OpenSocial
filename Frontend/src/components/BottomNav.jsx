import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusSquare, User, LogIn } from "lucide-react";

const BottomNav = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));
    const isAuthenticated = !!user;

    const navItems = [
        { icon: <Home size={24} />, path: "/" },
        { icon: <Search size={24} />, path: "/search" },
        { icon: <PlusSquare size={24} />, path: "/compose" },
        { icon: <User size={24} />, path: `/profile/${user?.username || "me"}` },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="md:hidden fixed bottom-6 left-6 right-6 h-16 glass-panel rounded-full flex justify-between items-center px-8 z-50 shadow-2xl">
            {navItems.map((item, index) => (
                <Link 
                    key={index} 
                    to={item.path} 
                    className={`relative p-2 transition-all duration-300
                    ${isActive(item.path) ? "text-violet-400 -translate-y-1" : "text-slate-400 hover:text-white"}`}
                >
                    {item.icon}
                    {isActive(item.path) && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-violet-400 rounded-full box-shadow-[0_0_8px_rgba(139,92,246,0.8)]"></span>
                    )}
                </Link>
            ))}
             {!isAuthenticated && (
                <Link to="/auth" className="text-slate-400 hover:text-violet-400 transition-colors">
                    <LogIn size={24} />
                </Link>
             )}
        </div>
    );
};

export default BottomNav;
