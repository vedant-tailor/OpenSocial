import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusSquare, User, LogIn } from "lucide-react";

const BottomNav = () => {
    const location = useLocation();
    const isAuthenticated = false; // TODO: Get from auth context

    const navItems = [
        { icon: <Home size={28} />, path: "/" },
        { icon: <Search size={28} />, path: "/search" },
        { icon: <PlusSquare size={28} />, path: "/compose/tweet" }, // Placeholder
        { icon: <User size={28} />, path: "/profile" },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-twitter-border flex justify-between items-center px-6 py-4 z-50">
            {navItems.map((item, index) => (
                <Link key={index} to={item.path} className="text-white hover:text-twitter-blue transition-colors">
                    {item.icon}
                </Link>
            ))}
             {!isAuthenticated && (
                <Link to="/auth">
                    <LogIn size={28} className="text-white hover:text-twitter-blue transition-colors" />
                </Link>
             )}
        </div>
    );
};

export default BottomNav;
