import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import EditProfileModal from "../components/EditProfileModal";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/users/profile/${username}`);
        setUser(res.data);
      } catch (error) {
        console.error(error);
        toast.error("User not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    const storedUser = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(storedUser);
    
    fetchUser();
  }, [username, navigate]);

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
      const updatedCurrentUser = { ...currentUser, ...res.data };
      localStorage.setItem("user", JSON.stringify(updatedCurrentUser));
      setCurrentUser(updatedCurrentUser);
      
      setIsEditModalOpen(false);
      toast.success("Profile updated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
  if (!user) return null;

  const isMyProfile = currentUser && currentUser.username === user.username;

  return (
    <div className="w-full min-h-screen text-white border-x border-gray-800">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-800 sticky top-0 bg-black/80 backdrop-blur z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-900 rounded-full">
            <ArrowLeft size={20} />
        </button>
        <div>
            <h2 className="font-bold text-xl">{user.username}</h2>
            <p className="text-gray-500 text-sm">0 posts</p>
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
                    <button className="bg-white text-black font-bold px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
                        Follow
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
                    <span className="text-white font-bold">0 <span className="text-gray-500 font-normal">Following</span></span>
                    <span className="text-white font-bold">0 <span className="text-gray-500 font-normal">Followers</span></span>
                </div>
            </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-800 mt-4">
            <div className="flex-1 text-center py-3 font-bold hover:bg-gray-900 cursor-pointer relative">
                Posts
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex-1 text-center py-3 text-gray-500 hover:bg-gray-900 cursor-pointer">Replies</div>
            <div className="flex-1 text-center py-3 text-gray-500 hover:bg-gray-900 cursor-pointer">Likes</div>
        </div>

        {/* Content Placeholder */}
        <div className="p-4 text-center text-gray-500">
            No posts yet.
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
