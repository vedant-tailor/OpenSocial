import React from "react";
import { Link } from "react-router-dom";
import { Home, User, LogOut, LogIn, PenSquare } from "lucide-react";

const Sidebar = () => {
  // TODO: Get auth state
  const isAuthenticated = false; 

  const navItems = [
    { icon: <Home size={28} />, text: "Home", path: "/" },
    { icon: <User size={28} />, text: "Profile", path: "/profile" },
  ];

  return (
    <div className="hidden md:flex flex-col h-screen fixed px-2 xl:px-4 py-4 border-r border-twitter-border w-[68px] xl:w-[275px]">
      {/* Logo */}
      <div className="mb-6 xl:pl-2 flex justify-center xl:justify-start">
        <h1 className="text-3xl font-bold text-white">X</h1>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-4 items-center xl:items-start">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center gap-4 px-3 xl:px-4 py-3 rounded-full hover:bg-twitter-dark-gray transition-colors w-fit"
          >
            {item.icon}
            <span className="hidden xl:block text-xl font-medium">{item.text}</span>
          </Link>
        ))}

        {!isAuthenticated ? (
          <Link
            to="/auth"
            className="flex items-center gap-4 px-3 xl:px-4 py-3 rounded-full hover:bg-twitter-dark-gray transition-colors w-fit"
          >
            <LogIn size={28} />
            <span className="hidden xl:block text-xl font-medium">Sign In</span>
          </Link>
        ) : (
          <button className="flex items-center gap-4 px-3 xl:px-4 py-3 rounded-full hover:bg-twitter-dark-gray transition-colors w-fit text-left">
            <LogOut size={28} />
            <span className="hidden xl:block text-xl font-medium">Logout</span>
          </button>
        )}

        <button className="mt-8 bg-twitter-blue hover:bg-opacity-90 text-white font-bold p-3 xl:py-3 xl:px-8 rounded-full shadow-lg transition-all w-fit xl:w-[90%] flex justify-center items-center">
           <span className="xl:hidden"><PenSquare size={24} /></span>
           <span className="hidden xl:block">Post</span>
        </button>
      </nav>

      {/* User Profile (Bottom) */}
      {isAuthenticated && (
        <div className="mt-auto flex items-center justify-center xl:justify-start gap-3 p-3 rounded-full hover:bg-twitter-dark-gray cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-full bg-gray-600"></div>
            <div className="hidden xl:block">
                <p className="font-bold">Username</p>
                <p className="text-twitter-gray text-sm">@handle</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
