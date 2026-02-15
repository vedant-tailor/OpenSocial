import React from "react";
import { Heart, Trash2, MessageCircle, Repeat, Share2, Edit2, X, Check, Image, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Post = ({ post, onDelete, onLike, onComment, onEditPost, onEditComment }) => {
  const [showComments, setShowComments] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState(post.text);
  const [editImg, setEditImg] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState(post.image);
  const [editingCommentId, setEditingCommentId] = React.useState(null);
  const [editCommentContent, setEditCommentContent] = React.useState("");
  const fileInputRef = React.useRef(null);

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

  const handleEditSubmit = () => {
    if (editContent.trim() || previewUrl) {
        onEditPost(post._id, editContent, editImg || previewUrl);
        setIsEditing(false);
    }
  };

  const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setEditImg(file);
          setPreviewUrl(URL.createObjectURL(file));
      }
  };

  const handleRemoveImage = () => {
      setEditImg(null);
      setPreviewUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditCommentSubmit = (commentId) => {
      if (editCommentContent.trim()) {
          onEditComment(post._id, commentId, editCommentContent);
          setEditingCommentId(null);
          setEditCommentContent("");
      }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/post/${post._id}`;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: `${post.user.username}'s Post`,
                text: post.text,
                url: shareUrl,
            });
            toast.success("Shared successfully");
        } catch (error) {
            console.error("Error sharing:", error);
        }
    } else {
        try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success("Link copied to clipboard");
        } catch (error) {
            toast.error("Failed to copy link");
        }
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
              <div className="flex gap-2">
                 <button
                    onClick={() => {
                        setIsEditing(!isEditing);
                        setEditContent(post.text);
                        setEditImg(null);
                        setPreviewUrl(post.image);
                    }}
                    className="text-slate-500 hover:text-cyan-400 p-2 hover:bg-cyan-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
              </div>
            )}
          </div>

          {isEditing ? (
             <div className="mb-3">
                 <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-violet-500 resize-none min-h-[100px] mb-2"
                 />
                 
                 {previewUrl && (
                     <div className="relative mb-2 rounded-xl overflow-hidden group/preview border border-slate-700/50">
                         <img src={previewUrl} alt="Preview" className="w-full max-h-60 object-contain bg-black/50" />
                         <button
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-red-500/80 transition-colors"
                         >
                             <X size={16} />
                         </button>
                     </div>
                 )}

                 <div className="flex justify-between items-center">
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium px-2 py-1 hover:bg-cyan-500/10 rounded-lg transition-colors"
                    >
                        <ImageIcon size={18} />
                        <span>{previewUrl ? "Change Photo" : "Add Photo"}</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        hidden
                        accept="image/*"
                    />

                     <div className="flex gap-2">
                         <button
                            onClick={() => setIsEditing(false)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full transition-colors"
                         >
                            <X size={20} />
                         </button>
                         <button
                             onClick={handleEditSubmit}
                             className="p-2 text-green-400 hover:bg-green-500/10 rounded-full transition-colors"
                         >
                             <Check size={20} />
                         </button>
                     </div>
                 </div>
             </div>
          ) : (
             <>
                <p className="text-slate-200 text-lg leading-relaxed mb-3 whitespace-pre-wrap">{post.text}</p>
                {post.image && (
                    <div className="rounded-xl overflow-hidden border border-slate-700/50 mb-4 bg-black/50">
                        <img src={post.image} alt="Post" className="w-full h-auto max-h-[500px] object-contain" />
                    </div>
                )}
             </>
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
            

            
            <button 
                onClick={handleLike}
                className={`flex items-center gap-2 transition-all group/like ${isLiked ? "text-pink-500" : "text-slate-400 hover:text-pink-500"}`}
            >
                <div className="p-2 rounded-full group-hover/like:bg-pink-500/10 transition-colors">
                    <Heart size={20} className={`transition-transform duration-300 ${isLiked ? "fill-current scale-110" : "group-hover/like:scale-110"}`} />
                </div>
                <span className="text-sm font-medium">{post.likes?.length || 0}</span>
            </button>

            <button 
                onClick={handleShare}
                className="flex items-center gap-2 text-slate-400 hover:text-violet-400 transition-all group/share"
            >
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
                                {editingCommentId === comment._id ? (
                                     <div className="flex-1">
                                         <input
                                            type="text"
                                            value={editCommentContent}
                                            onChange={(e) => setEditCommentContent(e.target.value)}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1 text-slate-200 focus:outline-none focus:border-violet-500 text-sm mb-2"
                                         />
                                         <div className="flex justify-end gap-2">
                                             <button
                                                onClick={() => setEditingCommentId(null)}
                                                className="text-slate-400 hover:text-white text-xs"
                                             >
                                                Cancel
                                             </button>
                                             <button
                                                onClick={() => handleEditCommentSubmit(comment._id)}
                                                className="text-violet-400 hover:text-violet-300 text-xs font-semibold"
                                             >
                                                Save
                                             </button>
                                         </div>
                                     </div>
                                ) : (
                                    <div className="flex-1">
                                        <p className="text-slate-300 text-sm">{comment.text}</p>
                                    </div>
                                )}
                                
                                {user?._id === comment.postedBy?._id && !editingCommentId && (
                                    <button
                                        onClick={() => {
                                            setEditingCommentId(comment._id);
                                            setEditCommentContent(comment.text);
                                        }}
                                        className="text-slate-500 hover:text-cyan-400 p-1 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                )}
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
