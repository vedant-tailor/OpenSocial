import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, User, LogOut, LogIn, PenSquare } from "lucide-react";

const Sidebar = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isAuthenticated = !!user;
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/auth";
    };

    const navItems = [
        { icon: <Home size={24} />, text: "Home", path: "/" },
        { icon: <User size={24} />, text: "Profile", path: `/profile/${user?.username || "me"}` },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="hidden md:flex flex-col h-[90vh] fixed left-4 top-1/2 -translate-y-1/2 w-[80px] xl:w-[260px] glass-panel rounded-2xl items-center xl:items-start py-8 z-50">
            {/* Logo */}
            <div className="mb-10 xl:px-6 w-full flex justify-center xl:justify-start">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400">
                    <span className="xl:hidden">OS</span>
                    <span className="hidden xl:block">OpenSocial</span>
                </h1>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 flex flex-col gap-4 w-full px-4">
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={`flex items-center gap-4 px-3 xl:px-5 py-3 rounded-xl transition-all duration-300 group
                        ${isActive(item.path) 
                            ? "bg-violet-600/20 text-violet-400 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]" 
                            : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                        }`}
                    >
                        <span className={`transition-transform duration-300 ${isActive(item.path) ? "scale-110" : "group-hover:scale-110"}`}>
                            {item.icon}
                        </span>
                        <span className="hidden xl:block font-medium">{item.text}</span>
                    </Link>
                ))}

                {/* Post Button */}
                <button className="mt-6 mx-auto xl:mx-0 xl:w-full btn-primary p-3 xl:py-3 xl:px-6 rounded-xl shadow-lg flex justify-center items-center group">
                    <PenSquare size={24} className="xl:mr-2 group-hover:rotate-12 transition-transform" />
                    <span className="hidden xl:block font-semibold">New Post</span>
                </button>
            </nav>

            {/* Bottom Actions */}
            <div className="w-full px-4 mt-auto">
                {!isAuthenticated ? (
                    <Link
                        to="/auth"
                        className="flex items-center gap-4 px-3 xl:px-5 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all w-full"
                    >
                        <LogIn size={24} />
                        <span className="hidden xl:block font-medium">Sign In</span>
                    </Link>
                ) : (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-3 xl:px-5 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
                    >
                        <LogOut size={24} />
                        <span className="hidden xl:block font-medium">Logout</span>
                    </button>
                )}

                {/* Mini Profile */}
                {isAuthenticated && (
                    <div className="mt-6 pt-6 border-t border-slate-700/50 flex items-center justify-center xl:justify-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 p-[2px]">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                {user.profileImg ? (
                                    <img src={user.profileImg} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-bold text-white text-sm">{user.username[0].toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                        <div className="hidden xl:block overflow-hidden">
                            <p className="font-bold text-sm text-white truncate">{user.username}</p>
                            <p className="text-xs text-slate-500 truncate">@{user.username}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
