import React from "react";
import { Heart, Trash2, MessageCircle, Repeat } from "lucide-react";
import { Link } from "react-router-dom";

const Post = ({ post, onDelete, onLike }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isMyPost = user?._id === post.user?._id;
  const isLiked = post.likes.includes(user?._id);

  const handleDelete = (e) => {
    e.preventDefault();
    onDelete(post._id);
  };

  const handleLike = (e) => {
    e.preventDefault();
    onLike(post._id);
  };

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="p-4 border-b border-gray-800 hover:bg-white/5 cursor-pointer transition-colors">
      <div className="flex gap-4">
        <div className="shrink-0">
            <Link to={`/profile/${post.user.username}`}>
                {post.user.profileImg ? (
                    <img
                    src={post.user.profileImg}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold text-lg">
                        {post.user.username[0].toUpperCase()}
                    </div>
                )}
            </Link>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <Link to={`/profile/${post.user.username}`} className="flex items-center gap-2 group">
              <span className="font-bold group-hover:underline">
                {post.user.username}
              </span>
              <span className="text-gray-500">@{post.user.username}</span>
              <span className="text-gray-500">· {formattedDate}</span>
            </Link>
            
            {isMyPost && (
              <button
                onClick={handleDelete}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <p className="mt-1">{post.text}</p>
          
          {post.image && (
            <img src={post.image} alt="Post" className="mt-3 rounded-xl border border-gray-800" />
          )}

          <div className="flex justify-between mt-4 text-gray-500 max-w-md">
            <div className="flex items-center gap-1 hover:text-blue-500 transition-colors group">
                <MessageCircle size={18} className="group-hover:bg-blue-500/10 rounded-full p-0.5" />
                <span className="text-sm">{post.comments?.length || 0}</span>
            </div>
            <div className="flex items-center gap-1 hover:text-green-500 transition-colors group">
                <Repeat size={18} className="group-hover:bg-green-500/10 rounded-full p-0.5" />
            </div>
            <button 
                onClick={handleLike}
                className={`flex items-center gap-1 transition-colors group ${isLiked ? "text-pink-600" : "hover:text-pink-600"}`}
            >
                <Heart size={18} className={`group-hover:bg-pink-600/10 rounded-full p-0.5 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-sm">{post.likes?.length || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
