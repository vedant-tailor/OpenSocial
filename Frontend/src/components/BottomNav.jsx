import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Search, PlusSquare, User, LogIn, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const BottomNav = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));
    const isAuthenticated = !!user;
    const { theme, toggleTheme } = useTheme();

    const navigate = useNavigate();

    const handleNewPost = () => {
        if (location.pathname === "/") {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate("/");
        }
    };

    const navItems = [
        { icon: <Home size={24} />, path: "/" },
        { icon: <Search size={24} />, path: "/search" },
        { icon: <PlusSquare size={24} />, action: handleNewPost },
        { icon: theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />, action: toggleTheme },
        { icon: <User size={24} />, path: `/profile/${user?.username || "me"}` },
    ];

    const isActive = (path) => path && location.pathname === path;

    return (
        <div className="md:hidden fixed bottom-6 left-6 right-6 h-16 glass-panel rounded-full flex justify-between items-center px-8 z-50 shadow-2xl">
            {navItems.map((item, index) => {
                const active = item.path ? isActive(item.path) : false;
                
                if (item.action) {
                    return (
                        <button 
                            key={index} 
                            onClick={item.action}
                            className="relative p-2 transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        >
                            {item.icon}
                        </button>
                    );
                }

                return (
                    <Link 
                        key={index} 
                        to={item.path} 
                        className={`relative p-2 transition-all duration-300
                        ${active ? "text-violet-600 dark:text-violet-400 -translate-y-1" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                    >
                        {item.icon}
                        {active && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-violet-400 rounded-full box-shadow-[0_0_8px_rgba(139,92,246,0.8)]"></span>
                        )}
                    </Link>
                );
            })}
             {!isAuthenticated && (
                <Link to="/auth" className="text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                    <LogIn size={24} />
                </Link>
             )}
        </div>
    );
};

export default BottomNav;
