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
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/50 dark:bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-slate-700 dark:text-slate-400 text-sm font-medium mb-1.5">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none h-24 transition-all"
              placeholder="Tell us about yourself"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-400 text-sm font-medium mb-1.5">Cover Image</label>
            <div className="relative w-full h-36 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                {coverPreview && (
                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover opacity-80" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                    <label className="cursor-pointer bg-slate-900/60 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-slate-900/80 transition shadow-lg">
                         <span className="text-white text-sm font-medium">Change Cover</span>
                         <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, "cover")} />
                    </label>
                </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-400 text-sm font-medium mb-1.5">Profile Image</label>
            <div className="flex items-center gap-5">
                <div className="relative w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-md">
                    {profilePreview ? (
                        <img src={profilePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-2xl">?</div>
                    )}
                </div>
                <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-sm">
                    <span className="text-slate-700 dark:text-white text-sm font-medium">Upload Image</span>
                    <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange(e, "profile")} />
                </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors shadow-lg shadow-violet-500/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
