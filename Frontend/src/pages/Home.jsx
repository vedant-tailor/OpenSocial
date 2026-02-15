import React, { useState, useEffect, useRef } from "react";
import { Image, X, Send, Sparkles } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Post from "../components/Post";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const [loading, setLoading] = useState(true);
    const imgRef = useRef(null);
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchPosts = async () => {
        try {
            const res = await axios.get("http://localhost:8001/api/posts");
            setPosts(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImg({
                file,
                url: URL.createObjectURL(file)
            });
            e.target.value = null;
        }
    };

    const handleCreatePost = async () => {
        if (!text.trim() && !img) return;

        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("text", text);
            if (img) {
                formData.append("image", img.file);
            }

            const res = await axios.post(
                "http://localhost:8001/api/posts",
                formData,
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    } 
                }
            );
            setPosts([res.data, ...posts]);
            setText("");
            setImg(null);
            toast.success("Shared successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create post");
        }
    };

    const handleDeletePost = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8001/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(posts.filter((post) => post._id !== id));
            toast.success("Post deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete post");
        }
    };

    const handleLikePost = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:8001/api/posts/like/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Optimistic update
            setPosts(posts.map(post => {
                if (post._id === id) {
                    const isLiked = post.likes.includes(user._id);
                    return {
                        ...post,
                        likes: isLiked 
                            ? post.likes.filter(uid => uid !== user._id)
                            : [...post.likes, user._id]
                    };
                }
                return post;
            }));

        } catch (error) {
            console.error(error);
            toast.error("Failed to like post");
        }
    };

    const handleComment = async (id, text) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `http://localhost:8001/api/posts/comment/${id}`,
                { text },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPosts(posts.map(post => post._id === id ? res.data : post));
            toast.success("Reply sent");
        } catch (error) {
            console.error(error);
            toast.error("Failed to send reply");
        }
    };



    return (
        <div className="max-w-2xl mx-auto w-full pb-20">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                <Sparkles className="text-violet-400" size={28} />
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Discover</h2>
            </div>

            {/* Create Post Card */}
            <div className="glass-panel p-6 rounded-3xl mb-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-500/20 transition-all duration-500"></div>
                
                <div className="flex gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-violet-500 to-cyan-500 shrink-0">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                             {user?.profileImg ? (
                                <img src={user.profileImg} alt="Profile" className="w-full h-full object-cover" />
                             ) : (
                                <span className="font-bold text-white">{user?.username?.[0]?.toUpperCase()}</span>
                             )}
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        <textarea
                            placeholder="Share your thoughts..."
                            className="w-full bg-transparent text-lg outline-none placeholder-slate-500 text-white resize-none min-h-[80px]"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        
                        {img && (
                            <div className="relative w-full mb-4 rounded-xl overflow-hidden group/img">
                                <img src={img.url} alt="Selected" className="w-full max-h-80 object-cover" />
                                <button 
                                    onClick={() => {
                                        setImg(null);
                                        imgRef.current.value = null;
                                    }}
                                    className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-black/80"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-2 border-t border-slate-700/50 pt-4">
                            <button 
                                className="text-cyan-400 hover:bg-cyan-400/10 p-2.5 rounded-xl transition-all flex items-center gap-2"
                                onClick={() => imgRef.current.click()}
                            >
                                <Image size={22} />
                                <span className="text-sm font-medium">Add Photo</span>
                            </button>
                            <input 
                                type="file" 
                                hidden 
                                ref={imgRef} 
                                accept="image/*"
                                onChange={handleImgChange}
                            />
                            
                            <button 
                                onClick={handleCreatePost}
                                disabled={!text.trim() && !img}
                                className="btn-primary px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
                            >
                                <span className="font-semibold">Post</span>
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    posts.map((post, index) => (
                        <div key={post._id} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${index * 100}ms` }}>
                            <Post 
                                post={post} 
                                onLike={handleLikePost} 
                                onDelete={handleDeletePost} 
                                onComment={handleComment}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;
