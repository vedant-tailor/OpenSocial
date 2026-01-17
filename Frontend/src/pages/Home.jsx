import React, { useState, useEffect, useRef } from "react";
import { Image, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Post from "../components/Post";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const [loading, setLoading] = useState(true);
    const imgRef = useRef(null);

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

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImg({
                file,
                url: URL.createObjectURL(file)
            });
            // Reset value to allow selecting the same file again if needed
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
                "http://localhost:8000/api/posts",
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

    const handleComment = async (id, text) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `http://localhost:8000/api/posts/comment/${id}`,
                { text },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update posts with the new post data (which includes comments)
            setPosts(posts.map(post => post._id === id ? res.data : post));
            toast.success("Reply sent");
        } catch (error) {
            console.error(error);
            toast.error("Failed to send reply");
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
          {img && (
            <div className="relative w-full mb-4">
                <img src={img.url} alt="Selected" className="w-full rounded-xl object-cover max-h-80" />
                <button 
                    onClick={() => {
                        setImg(null);
                        imgRef.current.value = null;
                    }}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
          )}
          <div className="flex justify-between items-center">
            <button 
                className="text-blue-400 hover:bg-blue-400/10 p-2 rounded-full transition-colors"
                onClick={() => imgRef.current.click()}
            >
              <Image size={20} />
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
                    onComment={handleComment}
                />
            ))
        )}
      </div>
    </div>
  );
};

export default Home;
