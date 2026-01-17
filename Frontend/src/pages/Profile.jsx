import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, ArrowLeft } from "lucide-react";
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

        // Fetch user profile
        const userRes = await axios.get(`http://localhost:8000/api/users/profile/${username}`);
        setUser(userRes.data);
        setFollowersCount(userRes.data.followers.length);

        // Check if current user is following
        if (storedUser && userRes.data.followers.includes(storedUser._id)) {
            setIsFollowing(true);
        } else {
            setIsFollowing(false);
        }

        // Fetch all posts to allow filtering for Likes/Replies
        const postsRes = await axios.get("http://localhost:8000/api/posts");
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
            await axios.post(`http://localhost:8000/api/users/unfollow/${user._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFollowing(false);
            setFollowersCount(prev => prev - 1);
            toast.success("Unfollowed");
        } else {
            await axios.post(`http://localhost:8000/api/users/follow/${user._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsFollowing(true);
            setFollowersCount(prev => prev + 1);
            toast.success("Followed");
        }
    } catch (error) {
        console.error(error);
        toast.error("Failed to update follow status");
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("bio", updatedData.bio);
      if (updatedData.profileFile) {
        formData.append("profileImg", updatedData.profileFile);
      }
      if (updatedData.coverFile) {
        formData.append("coverImg", updatedData.coverFile);
      }
      
      const res = await axios.put(
        "http://localhost:8000/api/users/update",
        formData,
        { 
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data" 
            } 
        }
      );
      
      setUser({ ...user, ...res.data });
      // Update local storage if it's the current user
      if (currentUser._id === user._id) {
        const updatedCurrentUser = { ...currentUser, ...res.data };
        localStorage.setItem("user", JSON.stringify(updatedCurrentUser));
        setCurrentUser(updatedCurrentUser);
      }
      
      setIsEditModalOpen(false);
      toast.success("Profile updated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
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

          setPosts(posts.map(post => post._id === id ? res.data : post));
          toast.success("Reply sent");
      } catch (error) {
          console.error(error);
          toast.error("Failed to send reply");
      }
  };

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
  if (!user) return null;

  const isMyProfile = currentUser && currentUser.username === user.username;

  const getPosts = () => {
    switch (feedType) {
        case "posts":
            return posts.filter(post => post.user._id === user._id);
        case "replies":
            return posts.filter(post => 
                post.comments.some(comment => comment.postedBy._id === user._id)
            );
        case "likes":
            return posts.filter(post => post.likes.includes(user._id));
        default:
            return posts.filter(post => post.user._id === user._id);
    }
  };

  return (
    <div className="w-full min-h-screen text-white border-x border-gray-800">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-800 sticky top-0 bg-black/80 backdrop-blur z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-900 rounded-full">
            <ArrowLeft size={20} />
        </button>
        <div>
            <h2 className="font-bold text-xl">{user.username}</h2>
            <p className="text-gray-500 text-sm">
                {posts.filter(post => post.user._id === user._id).length} posts
            </p>
        </div>
      </div>

      {/* Hero Section */}
      <div>
        {/* Banner */}
        <div className="h-48 bg-gray-800 relative">
            {user.coverImg && (
                <img 
                    src={user.coverImg} 
                    alt="Cover" 
                    className="w-full h-full object-cover"
                />
            )}
        </div>

        {/* Profile Info */}
        <div className="px-4 relative mb-4">
            <div className="absolute -top-16 left-4 border-4 border-black rounded-full">
                <div className="w-32 h-32 rounded-full bg-gray-700 overflow-hidden">
                    {user.profileImg ? (
                        <img src={user.profileImg} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-500">
                            {user.username[0].toUpperCase()}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex justify-end py-3">
                {isMyProfile ? (
                    <button 
                        onClick={() => setIsEditModalOpen(true)}
                        className="border border-gray-600 font-bold px-4 py-1.5 rounded-full hover:bg-gray-900 transition-colors"
                    >
                        Edit profile
                    </button>
                ) : (
                    <button 
                        onClick={handleFollow}
                        className={`font-bold px-4 py-1.5 rounded-full transition-colors ${
                            isFollowing 
                                ? "bg-transparent border border-gray-600 text-white hover:bg-red-500/10 hover:border-red-600 hover:text-red-500" 
                                : "bg-white text-black hover:bg-gray-200"
                        }`}
                    >
                        {isFollowing ? "Unfollow" : "Follow"}
                    </button>
                )}
            </div>

            <div className="mt-8">
                <h1 className="font-bold text-xl leading-5">{user.username}</h1>
                <p className="text-gray-500">@{user.username}</p>
                
                {user.bio && <p className="mt-3">{user.bio}</p>}

                <div className="flex items-center gap-2 mt-3 text-gray-500">
                    <Calendar size={16} />
                    <span className="text-sm">Joined {new Date(user.createdAt).toDateString()}</span>
                </div>

                <div className="flex gap-4 mt-3 text-sm">
                    <span className="text-white font-bold">{user.following.length} <span className="text-gray-500 font-normal">Following</span></span>
                    <span className="text-white font-bold">{followersCount} <span className="text-gray-500 font-normal">Followers</span></span>
                </div>
            </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-800 mt-4">
            <div 
                className={`flex-1 text-center py-3 cursor-pointer relative ${feedType === "posts" ? "font-bold text-white" : "text-gray-500 hover:bg-gray-900"}`}
                onClick={() => setFeedType("posts")}
            >
                Posts
                {feedType === "posts" && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full"></div>
                )}
            </div>
            <div 
                className={`flex-1 text-center py-3 cursor-pointer relative ${feedType === "replies" ? "font-bold text-white" : "text-gray-500 hover:bg-gray-900"}`}
                onClick={() => setFeedType("replies")}
            >
                Replies
                {feedType === "replies" && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full"></div>
                )}
            </div>
            <div 
                className={`flex-1 text-center py-3 cursor-pointer relative ${feedType === "likes" ? "font-bold text-white" : "text-gray-500 hover:bg-gray-900"}`}
                onClick={() => setFeedType("likes")}
            >
                Likes
                {feedType === "likes" && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full"></div>
                )}
            </div>
        </div>

        {/* Content */}
        <div>
            {getPosts().length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                    No posts yet.
                </div>
            ) : (
                getPosts().map(post => (
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
