import React from "react";
import { Heart, Trash2, MessageCircle, Repeat, Share2 } from "lucide-react";
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
    <div className="glass-card rounded-2xl p-5 mb-6 hover:bg-slate-800/40 transition-all duration-300 border border-slate-700/30 shadow-lg hover:shadow-violet-500/10 hover:border-violet-500/30 group">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="shrink-0">
            <Link to={`/profile/${post.user.username}`}>
                <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-violet-500 to-cyan-400">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                        {post.user.profileImg ? (
                            <img src={post.user.profileImg} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-bold text-white">{post.user.username[0].toUpperCase()}</span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <Link to={`/profile/${post.user.username}`} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
              <span className="font-bold text-white hover:text-violet-400 transition-colors">
                {post.user.username}
              </span>
              <span className="text-slate-500 text-sm">@{post.user.username}</span>
              <span className="hidden sm:inline text-slate-600">·</span>
              <span className="text-slate-500 text-sm">{formattedDate}</span>
            </Link>
            
            {isMyPost && (
              <button
                onClick={handleDelete}
                className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          <p className="text-slate-200 text-lg leading-relaxed mb-3 whitespace-pre-wrap">{post.text}</p>
          
          {post.image && (
            <div className="rounded-xl overflow-hidden border border-slate-700/50 mb-4 bg-black/50">
                <img src={post.image} alt="Post" className="w-full h-auto max-h-[500px] object-contain" />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 md:pr-12 border-t border-slate-700/30 pt-3">
            <button 
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-all group/comment"
            >
                <div className="p-2 rounded-full group-hover/comment:bg-cyan-500/10 transition-colors">
                    <MessageCircle size={20} />
                </div>
                <span className="text-sm font-medium">{post.comments?.length || 0}</span>
            </button>
            
            <button className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition-all group/repost">
                <div className="p-2 rounded-full group-hover/repost:bg-green-500/10 transition-colors">
                    <Repeat size={20} />
                </div>
            </button>
            
            <button 
                onClick={handleLike}
                className={`flex items-center gap-2 transition-all group/like ${isLiked ? "text-pink-500" : "text-slate-400 hover:text-pink-500"}`}
            >
                <div className="p-2 rounded-full group-hover/like:bg-pink-500/10 transition-colors">
                    <Heart size={20} className={`transition-transform duration-300 ${isLiked ? "fill-current scale-110" : "group-hover/like:scale-110"}`} />
                </div>
                <span className="text-sm font-medium">{post.likes?.length || 0}</span>
            </button>

            <button className="flex items-center gap-2 text-slate-400 hover:text-violet-400 transition-all group/share">
                <div className="p-2 rounded-full group-hover/share:bg-violet-500/10 transition-colors">
                    <Share2 size={20} />
                </div>
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-slate-700/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <form onSubmit={handleCommentSubmit} className="flex gap-3">
                    <input 
                        type="text" 
                        placeholder="Post your reply..." 
                        className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button 
                        type="submit" 
                        className="bg-violet-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-violet-700 disabled:opacity-50 disabled:hover:bg-violet-600 transition-colors"
                        disabled={!commentText.trim()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        Reply
                    </button>
                </form>

                <div className="space-y-4 pl-2">
                    {post.comments?.map((comment, index) => (
                        <div key={index} className="flex gap-3 group/item">
                             <div className="w-8 h-8 rounded-full bg-slate-700 shrink-0 overflow-hidden flex items-center justify-center font-bold text-xs text-white">
                                {comment.postedBy?.profileImg ? (
                                    <img src={comment.postedBy.profileImg} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    comment.postedBy?.username?.[0]?.toUpperCase() || "?"
                                )}
                            </div>
                            <div className="bg-slate-800/30 p-3 rounded-2xl rounded-tl-none border border-transparent group-hover/item:border-slate-700/50 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm text-white">{comment.postedBy?.username || "Unknown"}</span>
                                    <span className="text-slate-500 text-xs">
                                        {new Date(comment.created).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-slate-300 text-sm">{comment.text}</p>
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
