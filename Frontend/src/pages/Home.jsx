import React, { useState, useEffect } from "react";
import { Image } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Post from "../components/Post";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/posts");
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

    const handleCreatePost = async () => {
        if (!text.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                "http://localhost:8000/api/posts",
                { text },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPosts([res.data, ...posts]);
            setText("");
            toast.success("Posted!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create post");
        }
    };

    const handleDeletePost = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8000/api/posts/${id}`, {
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
                `http://localhost:8000/api/posts/like/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Optimistic update
            const user = JSON.parse(localStorage.getItem("user"));
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

  return (
    <div className="flex-1 min-h-screen border-r border-gray-800 max-w-[600px]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold font-bold">Home</h2>
      </div>

      {/* Tweet Input */}
      <div className="p-4 border-b border-gray-800 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-600 shrink-0 overflow-hidden flex items-center justify-center font-bold text-lg text-white">
            {/* Show current user profile image if available */}
             {JSON.parse(localStorage.getItem("user"))?.profileImg ? (
                <img 
                    src={JSON.parse(localStorage.getItem("user")).profileImg} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                />
             ) : (
                JSON.parse(localStorage.getItem("user"))?.username[0].toUpperCase()
             )}
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="What is happening?!"
            className="w-full bg-transparent text-xl outline-none placeholder-gray-500 mb-4 text-white"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <button className="text-blue-400 hover:bg-blue-400/10 p-2 rounded-full transition-colors">
              <Image size={20} />
            </button>
            <button 
                onClick={handleCreatePost}
                disabled={!text.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div>
        {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : (
            posts.map((post) => (
                <Post 
                    key={post._id} 
                    post={post} 
                    onLike={handleLikePost} 
                    onDelete={handleDeletePost} 
                />
            ))
        )}
      </div>
    </div>
  );
};

export default Home;
