import React from "react";
import { Heart, Trash2, MessageCircle, Repeat } from "lucide-react";
import { Link } from "react-router-dom";

const Post = ({ post, onDelete, onLike, onComment }) => {
  const [showComments, setShowComments] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");
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

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post._id, commentText);
      setCommentText("");
    }
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
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold text-lg text-white">
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
            <div 
                className="flex items-center gap-1 hover:text-blue-500 transition-colors group cursor-pointer"
                onClick={() => setShowComments(!showComments)}
            >
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

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 border-t border-gray-800 pt-4">
                <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
                    <input 
                        type="text" 
                        placeholder="Tweet your reply" 
                        className="flex-1 bg-gray-900 border border-gray-800 rounded-full px-4 py-2 outline-none focus:border-blue-500"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-600 disabled:opacity-50"
                        disabled={!commentText.trim()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        Reply
                    </button>
                </form>

                <div className="space-y-4">
                    {post.comments?.map((comment, index) => (
                        <div key={index} className="flex gap-3">
                             <div className="w-8 h-8 rounded-full bg-gray-600 shrink-0 overflow-hidden flex items-center justify-center font-bold text-sm text-white">
                                {comment.postedBy?.profileImg ? (
                                    <img src={comment.postedBy.profileImg} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    comment.postedBy?.username?.[0]?.toUpperCase() || "?"
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{comment.postedBy?.username || "Unknown"}</span>
                                    <span className="text-gray-500 text-xs">
                                        {new Date(comment.created).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
