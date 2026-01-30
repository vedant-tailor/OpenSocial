import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? "/login" : "/register";
        const payload = isLogin ? { email, password } : { username, email, password };

        try {
            const res = await axios.post(`http://localhost:8001/api/auth${endpoint}`, payload);
            
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data));
            
            toast.success(isLogin ? "Welcome back!" : "Account created!");
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl min-h-[600px]">
                
                {/* Left Side - Decorative */}
                <div className="hidden md:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-violet-600/20 to-cyan-500/20 relative">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                    <div className="relative z-10 text-center">
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400 mb-6 drop-shadow-lg">
                            OpenSocial
                        </h1>
                        <p className="text-lg text-slate-300">
                            Connect, share, and inspire in a beautiful new dimension.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8 md:p-12 flex flex-col justify-center bg-slate-900/40 backdrop-blur-md">
                    <div className="max-w-md mx-auto w-full">
                        <h2 className="text-3xl font-bold mb-2 text-white">
                            {isLogin ? "Welcome Back" : "Join the Community"}
                        </h2>
                        <p className="text-slate-400 mb-8">
                            {isLogin ? "Enter your details to access your account" : "Start your journey with us today"}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
                                    <input
                                        type="text"
                                        placeholder="johndoe"
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-primary py-3.5 rounded-lg shadow-lg shadow-violet-500/20 text-lg mt-4"
                            >
                                {isLogin ? "Sign In" : "Create Account"}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-400">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    className="ml-2 text-violet-400 hover:text-violet-300 font-medium transition-colors"
                                    onClick={() => setIsLogin(!isLogin)}
                                >
                                    {isLogin ? "Sign up" : "Log in"}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
