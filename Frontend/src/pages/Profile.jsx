import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, ArrowLeft, MapPin, Link as LinkIcon, Edit3 } from "lucide-react";
import { toast } from "react-hot-toast";
import EditProfileModal from "../components/EditProfileModal";
import Post from "../components/Post";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [feedType, setFeedType] = useState("posts");

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setCurrentUser(storedUser);

        const userRes = await axios.get(`http://localhost:8001/api/users/profile/${username}`);
        setUser(userRes.data);
        setFollowersCount(userRes.data.followers.length);

        if (storedUser && userRes.data.followers.includes(storedUser._id)) {
            setIsFollowing(true);
        } else {
            setIsFollowing(false);
        }

        const postsRes = await axios.get("http://localhost:8001/api/posts");
        setPosts(postsRes.data);

      } catch (error) {
        console.error(error);
        toast.error("User not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAndPosts();
  }, [username, navigate]);

  const handleFollow = async () => {
    try {
        const token = localStorage.getItem("token");
        if (isFollowing) {
            await axios.post(`http://localhost:8001/api/users/unfollow/${user._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFollowing(false);
            setFollowersCount(prev => prev - 1);
            toast.success("Unfollowed");
        } else {
            await axios.post(`http://localhost:8001/api/users/follow/${user._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFollowing(true);
            setFollowersCount(prev => prev + 1);
            toast.success("Followed");
        }
    } catch (error) {
        toast.error("Failed to update follow status");
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("bio", updatedData.bio);
      if (updatedData.profileFile) formData.append("profileImg", updatedData.profileFile);
      if (updatedData.coverFile) formData.append("coverImg", updatedData.coverFile);
      
      const res = await axios.put(
        "http://localhost:8001/api/users/update",
        formData,
        { 
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data" 
            } 
        }
      );
      
      setUser({ ...user, ...res.data });
      if (currentUser._id === user._id) {
        const updatedCurrentUser = { ...currentUser, ...res.data };
        localStorage.setItem("user", JSON.stringify(updatedCurrentUser));
        setCurrentUser(updatedCurrentUser);
      }
      
      setIsEditModalOpen(false);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile");
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
          
          setPosts(posts.map(post => {
              if (post._id === id) {
                  const isPostLiked = post.likes.includes(currentUser._id);
                  return {
                      ...post,
                      likes: isPostLiked 
                          ? post.likes.filter(uid => uid !== currentUser._id)
                          : [...post.likes, currentUser._id]
                  };
              }
              return post;
          }));

      } catch (error) {
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
          toast.error("Failed to send reply");
      }
  };

  if (loading) return <div className="text-white text-center mt-20 text-xl font-light tracking-wide">Loading Profile...</div>;
  if (!user) return null;

  const isMyProfile = currentUser && currentUser.username === user.username;

  const getPosts = () => {
    switch (feedType) {
        case "posts": return posts.filter(post => post.user._id === user._id);
        case "replies": return posts.filter(post => post.comments.some(comment => comment.postedBy._id === user._id));
        case "likes": return posts.filter(post => post.likes.includes(user._id));
        default: return [];
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-slate-900/60 border-b border-white/5 px-6 py-4 flex items-center gap-4 transition-all duration-300">
        <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors group"
        >
            <ArrowLeft className="text-slate-400 group-hover:text-white transition-colors" size={20} />
        </button>
        <div>
            <h2 className="font-bold text-xl text-white leading-tight">{user.username}</h2>
            <p className="text-slate-500 text-sm font-medium">
                {posts.filter(post => post.user._id === user._id).length} posts
            </p>
        </div>
      </div>

      {/* Banner */}
      <div className="h-60 relative group overflow-hidden rounded-b-3xl">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80 z-10"></div>
        {user.coverImg ? (
            <img src={user.coverImg} alt="Cover" className="w-full h-full object-cover" />
        ) : (
            <div className="w-full h-full bg-gradient-to-r from-violet-600 to-cyan-600"></div>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 relative -mt-20 z-20 mb-8">
        <div className="flex justify-between items-end">
             {/* Avatar */}
            <div className="relative group">
                <div className="w-36 h-36 rounded-full p-1.5 bg-slate-900">
                    <div className="w-full h-full rounded-full bg-slate-800 overflow-hidden border-4 border-slate-900 shadow-2xl">
                        {user.profileImg ? (
                            <img src={user.profileImg} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-slate-500 bg-slate-800">
                                {user.username[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mb-4">
                {isMyProfile ? (
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="glass-panel hover:bg-white/10 text-white font-semibold px-6 py-2.5 rounded-full transition-all border border-white/10 flex items-center gap-2"
                    >
                        <Edit3 size={16} />
                        <span>Edit Profile</span>
                    </button>
                ) : (
                    <button 
                        onClick={handleFollow}
                        className={`font-bold px-8 py-2.5 rounded-full transition-all shadow-lg ${
                            isFollowing 
                                ? "bg-transparent border border-slate-600 text-white hover:bg-red-500/10 hover:border-red-500 hover:text-red-400" 
                                : "btn-primary text-white"
                        }`}
                    >
                        {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                )}
            </div>
        </div>

        <div className="mt-4 space-y-3">
            <div>
                <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                <p className="text-slate-500 font-medium">@{user.username}</p>
            </div>
            
            {user.bio && (
                <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">{user.bio}</p>
            )}

            <div className="flex items-center gap-6 text-slate-400 text-sm">
                <div className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    <span>Somewhere on Earth</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <LinkIcon size={16} />
                    <span className="text-violet-400 hover:underline cursor-pointer">opensocial.com</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                </div>
            </div>

            <div className="flex gap-6 pt-2">
                <div className="flex items-center gap-1.5 group cursor-pointer">
                    <span className="text-white font-bold text-lg">{user.following.length}</span>
                    <span className="text-slate-500 group-hover:text-violet-400 transition-colors">Following</span>
                </div>
                <div className="flex items-center gap-1.5 group cursor-pointer">
                    <span className="text-white font-bold text-lg">{followersCount}</span>
                    <span className="text-slate-500 group-hover:text-cyan-400 transition-colors">Followers</span>
                </div>
            </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-white/5 sticky top-[73px] bg-slate-900/95 backdrop-blur z-20 mb-6">
        {["posts", "replies", "likes"].map((tab) => (
            <div 
                key={tab}
                className="flex-1 text-center py-4 cursor-pointer relative group"
                onClick={() => setFeedType(tab)}
            >
                <span className={`font-medium transition-colors capitalized ${feedType === tab ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>
                {feedType === tab && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
                )}
            </div>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 pb-20 space-y-6">
        {getPosts().length === 0 ? (
            <div className="py-20 text-center">
                <div className="glass-panel inline-block p-8 rounded-3xl">
                    <p className="text-slate-400 text-lg">Nothing to show here yet.</p>
                </div>
            </div>
        ) : (
            getPosts().map((post, index) => (
                <div key={post._id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
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

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleUpdateProfile}
      />
    </div>
  );
};

export default Profile;
