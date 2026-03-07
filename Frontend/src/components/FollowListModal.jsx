import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const FollowListModal = ({ isOpen, onClose, username, type }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !username || !type) return;

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:8001/api/users/${username}/${type}`);
                setUsers(res.data);
            } catch (error) {
                console.error(error);
                toast.error(`Failed to load ${type}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [isOpen, username, type]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900/50 dark:bg-black/50 backdrop-blur-sm z-50 p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-xl flex flex-col max-h-[80vh]">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
                        {type}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 p-2">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                            No {type} yet.
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {users.map((user) => (
                                <Link 
                                    key={user._id} 
                                    to={`/profile/${user.username}`}
                                    onClick={onClose}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border flex-shrink-0 border-slate-300 dark:border-slate-700 overflow-hidden flex items-center justify-center shadow-sm">
                                        {user.profileImg ? (
                                            <img src={user.profileImg} alt={`${user.username}'s profile`} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="font-bold text-slate-500 dark:text-slate-400 text-sm">
                                                {user.username[0].toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="overflow-hidden flex-1">
                                        <p className="font-bold text-slate-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                                            {user.username}
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                            @{user.username}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default FollowListModal;
