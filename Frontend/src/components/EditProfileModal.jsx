import React, { useState } from "react";
import { X } from "lucide-react";

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    bio: user.bio || "",
    profileImg: user.profileImg || "",
    coverImg: user.coverImg || "",
  });
  const [profilePreview, setProfilePreview] = useState(user.profileImg || "");
  const [coverPreview, setCoverPreview] = useState(user.coverImg || "");
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === "profile") {
                setProfilePreview(reader.result);
                setProfileFile(file);
            } else {
                setCoverPreview(reader.result);
                setCoverFile(file);
            }
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, profileFile, coverFile });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black border border-gray-700 rounded-2xl w-full max-w-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-blue-500 outline-none resize-none h-24"
              placeholder="Tell us about yourself"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Cover Image</label>
            <div className="relative w-full h-32 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                {coverPreview && (
                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover opacity-60" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                    <label className="cursor-pointer bg-black/50 p-2 rounded-full hover:bg-black/70 transition">
                         <span className="text-white text-sm font-bold">Change Cover</span>
                         <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, "cover")} />
                    </label>
                </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Profile Image</label>
            <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full bg-gray-800 overflow-hidden border border-gray-700">
                    {profilePreview ? (
                        <img src={profilePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">?</div>
                    )}
                </div>
                <label className="cursor-pointer bg-gray-800 px-4 py-2 rounded-full border border-gray-700 hover:bg-gray-700 transition">
                    <span className="text-white text-sm">Upload Image</span>
                    <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, "profile")} />
                </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-full border border-gray-600 text-white font-bold hover:bg-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-full bg-white text-black font-bold hover:bg-gray-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
