import React, { useState, useEffect } from "react";
import { Search as SearchIcon, User } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Search = () => {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim()) {
                handleSearch();
            } else {
                setUsers([]);
                setSearched(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:8001/api/users/search?query=${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
            setSearched(true);
        } catch (error) {
            console.error(error);
            toast.error("Failed to search users");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full pb-20">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                <SearchIcon className="text-violet-600 dark:text-violet-400" size={28} />
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">Search Users</h2>
            </div>

            {/* Search Bar */}
            <div className="glass-panel p-4 rounded-3xl mb-8 relative">
                <div className="flex items-center gap-4 relative z-10 px-2">
                    <SearchIcon className="text-slate-400" size={24} />
                    <input
                        type="text"
                        placeholder="Search by username..."
                        className="w-full bg-transparent text-lg outline-none placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>

            {/* Search Results */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
                    </div>
                ) : searched && users.length === 0 ? (
                    <div className="text-center py-10 text-slate-500">
                        No users found matching "{query}"
                    </div>
                ) : (
                    users.map((user, index) => (
                        <Link 
                            to={`/profile/${user.username}`} 
                            key={user._id} 
                            className="glass-panel p-4 rounded-2xl flex items-center justify-between hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-violet-500 to-cyan-500 shrink-0">
                                    <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                                        {user.profileImg ? (
                                            <img src={user.profileImg} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-bold text-slate-900 dark:text-white uppercase">{user.username[0]}</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{user.username}</h3>
                                    <p className="text-sm text-slate-500">@{user.username}</p>
                                </div>
                            </div>
                            <div className="text-violet-600 dark:text-violet-400 bg-violet-500/10 px-4 py-2 rounded-xl text-sm font-semibold">
                                View Profile
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Search;
