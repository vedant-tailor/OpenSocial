import React, { useState } from "react";
import { Link } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: ""
  });

  const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Submitting:", formData);
      // TODO: Connect to backend
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="w-full max-w-md p-8 rounded-2xl bg-black border border-twitter-border">
        <h2 className="text-3xl font-bold mb-8 text-center">
            {isLogin ? "Sign in to X" : "Create your account"}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
                <input 
                    type="text" 
                    name="username"
                    placeholder="Username" 
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-black border border-twitter-border rounded p-4 outline-none focus:border-twitter-blue"
                />
            )}
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            value={formData.email}
            onChange={handleChange}
            className="bg-black border border-twitter-border rounded p-4 outline-none focus:border-twitter-blue"
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange}
            className="bg-black border border-twitter-border rounded p-4 outline-none focus:border-twitter-blue"
          />
          
          <button className="bg-white text-black font-bold rounded-full p-3 mt-4 hover:bg-gray-200 transition-colors">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-twitter-gray text-center">
          {isLogin ? "Don't have an account?" : "Have an account already?"}
          <span 
            className="text-twitter-blue ml-2 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
