import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Users,
  FileText,
  Heart,
  MessageCircle,
  UserCheck,
  TrendingUp,
  Shield,
  ChevronRight,
  Image as ImageIcon,
  Video,
} from "lucide-react";

const API = "http://localhost:8001/api";

const getToken = () => localStorage.getItem("token");

const fetchAdmin = async (endpoint) => {
  const res = await fetch(`${API}/admin/${endpoint}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return res.json();
};

// ─── Mini stat card ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, gradient }) {
  return (
    <div className="glass-card rounded-2xl p-6 flex items-center gap-5 hover-card">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${gradient}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">
          {value ?? <span className="text-slate-400 text-lg">—</span>}
        </p>
      </div>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ count, icon, color }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${color}`}
    >
      {icon}
      {count}
    </span>
  );
}

// ─── Highlighted post card ────────────────────────────────────────────────────
function FeaturedPost({ title, data, badgeIcon, badgeCount, badgeColor }) {
  if (!data?.post) {
    return (
      <div className="glass-card rounded-2xl p-6 flex flex-col gap-3">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          {title}
        </h3>
        <p className="text-slate-400 text-sm">No posts yet.</p>
      </div>
    );
  }

  const { post } = data;
  const user = post.user;

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-4 hover-card group">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
        <Badge count={badgeCount} icon={badgeIcon} color={badgeColor} />
      </div>

      {/* Author */}
      <Link
        to={`/profile/${user?.username}`}
        className="flex items-center gap-3 group/author"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 p-[2px] flex-shrink-0">
          <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center">
            {user?.profileImg ? (
              <img src={user.profileImg} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {user?.username?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="font-semibold text-sm text-slate-900 dark:text-white group-hover/author:text-violet-500 transition-colors">
            @{user?.username}
          </p>
          <p className="text-xs text-slate-500">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </Link>

      {/* Content */}
      {post.text && (
        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
          {post.text}
        </p>
      )}

      {/* Media */}
      {post.image && (
        <div className="rounded-xl overflow-hidden max-h-56">
          <img
            src={post.image}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {!post.image && post.video && (
        <div className="rounded-xl overflow-hidden max-h-56 bg-black">
          <video src={post.video} className="w-full max-h-56 object-contain" controls />
        </div>
      )}

      {/* Footer stats */}
      <div className="flex items-center gap-4 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-sm text-slate-500">
        <span className="flex items-center gap-1">
          <Heart size={14} className="text-rose-400" />
          {post.likes?.length ?? 0} likes
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={14} className="text-sky-400" />
          {post.comments?.length ?? 0} comments
        </span>
        {post.image && (
          <span className="flex items-center gap-1">
            <ImageIcon size={14} className="text-emerald-400" />
            Image
          </span>
        )}
        {post.video && (
          <span className="flex items-center gap-1">
            <Video size={14} className="text-amber-400" />
            Video
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Most followed user card ───────────────────────────────────────────────────
function MostFollowedUser({ data }) {
  if (!data?.user) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
          Most Followed User
        </h3>
        <p className="text-slate-400 text-sm">No users yet.</p>
      </div>
    );
  }

  const { user, followersCount, posts } = data;

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
      {/* Section title */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp size={20} className="text-cyan-400" />
          Most Followed User
        </h3>
        <Badge
          count={`${followersCount} followers`}
          icon={<UserCheck size={14} />}
          color="bg-cyan-500/15 text-cyan-600 dark:text-cyan-400"
        />
      </div>

      {/* User card */}
      <Link
        to={`/profile/${user.username}`}
        className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-400/20 hover:border-violet-400/40 transition-all group"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 p-[2px] flex-shrink-0">
          <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center">
            {user.profileImg ? (
              <img src={user.profileImg} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-xl text-slate-900 dark:text-white">
                {user.username[0].toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="font-bold text-slate-900 dark:text-white group-hover:text-violet-500 transition-colors">
            @{user.username}
          </p>
          {user.bio && (
            <p className="text-sm text-slate-500 truncate mt-0.5">{user.bio}</p>
          )}
          <div className="flex gap-4 mt-2 text-xs text-slate-500">
            <span><b className="text-slate-800 dark:text-slate-200">{user.followers?.length ?? 0}</b> followers</span>
            <span><b className="text-slate-800 dark:text-slate-200">{user.following?.length ?? 0}</b> following</span>
          </div>
        </div>
        <ChevronRight size={18} className="text-slate-400 group-hover:text-violet-400 transition-colors flex-shrink-0" />
      </Link>

      {/* Posts */}
      {posts?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
            Their Recent Posts
          </p>
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50"
              >
                {post.text && (
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 mb-2">
                    {post.text}
                  </p>
                )}
                {post.image && (
                  <img
                    src={post.image}
                    alt="post"
                    className="rounded-lg max-h-40 object-cover w-full mb-2"
                  />
                )}
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Heart size={12} className="text-rose-400" />
                    {post.likes?.length ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={12} className="text-sky-400" />
                    {post.comments?.length ?? 0}
                  </span>
                  <span className="ml-auto">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function Admin() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState(null);
  const [mostLiked, setMostLiked] = useState(null);
  const [mostCommented, setMostCommented] = useState(null);
  const [mostFollowed, setMostFollowed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const [s, ml, mc, mf] = await Promise.all([
          fetchAdmin("stats"),
          fetchAdmin("most-liked-post"),
          fetchAdmin("most-commented-post"),
          fetchAdmin("most-followed-user"),
        ]);
        setStats(s);
        setMostLiked(ml);
        setMostCommented(mc);
        setMostFollowed(mf);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (!user?.isAdmin) return null;

  return (
    <div className="max-w-4xl mx-auto px-2 py-4 flex flex-col gap-8">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
          <Shield size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Platform overview &amp; insights
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass-card rounded-2xl p-4 border border-red-400/30 text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 gap-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 h-24" />
          ))}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon={<Users size={26} />}
              label="Total Users"
              value={stats?.totalUsers?.toLocaleString()}
              gradient="bg-gradient-to-br from-violet-500 to-violet-700"
            />
            <StatCard
              icon={<FileText size={26} />}
              label="Total Posts"
              value={stats?.totalPosts?.toLocaleString()}
              gradient="bg-gradient-to-br from-cyan-500 to-cyan-700"
            />
            <StatCard
              icon={<Heart size={26} />}
              label="Most Liked Post Likes"
              value={mostLiked?.likesCount?.toLocaleString()}
              gradient="bg-gradient-to-br from-rose-500 to-pink-700"
            />
            <StatCard
              icon={<MessageCircle size={26} />}
              label="Most Commented Post"
              value={mostCommented?.commentsCount?.toLocaleString()}
              gradient="bg-gradient-to-br from-sky-500 to-blue-700"
            />
          </div>

          {/* Featured posts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FeaturedPost
              title="🔥 Most Liked Post"
              data={mostLiked}
              badgeCount={mostLiked?.likesCount ?? 0}
              badgeIcon={<Heart size={14} />}
              badgeColor="bg-rose-500/15 text-rose-600 dark:text-rose-400"
            />
            <FeaturedPost
              title="💬 Most Commented Post"
              data={mostCommented}
              badgeCount={mostCommented?.commentsCount ?? 0}
              badgeIcon={<MessageCircle size={14} />}
              badgeColor="bg-sky-500/15 text-sky-600 dark:text-sky-400"
            />
          </div>

          {/* Most followed user */}
          <MostFollowedUser data={mostFollowed} />
        </>
      )}
    </div>
  );
}
