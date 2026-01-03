import React, { useState } from "react";
import { Image, Send } from "lucide-react";

const Home = () => {
    const [posts, setPosts] = useState([
        { id: 1, user: "John Doe", handle: "@johndoe", text: "Hello Twitter clone!", time: "2h" },
        { id: 2, user: "Jane Smith", handle: "@janesmith", text: "Working on a MERN stack app.", time: "4h" }
    ]);

  return (
    <div className="flex-1 min-h-screen border-r border-twitter-border max-w-[600px]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md p-4 border-b border-twitter-border">
        <h2 className="text-xl font-bold font-bold">Home</h2>
      </div>

      {/* Tweet Input */}
      <div className="p-4 border-b border-twitter-border flex gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-500 shrink-0"></div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="What is happening?!"
            className="w-full bg-transparent text-xl outline-none placeholder-gray-500 mb-4"
          />
          <div className="flex justify-between items-center">
            <button className="text-twitter-blue hover:bg-twitter-blue/10 p-2 rounded-full transition-colors">
              <Image size={20} />
            </button>
            <button className="bg-twitter-blue hover:bg-opacity-90 text-white font-bold px-4 py-2 rounded-full">
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div>
        {posts.map((post) => (
            <div key={post.id} className="p-4 border-b border-twitter-border hover:bg-white/5 cursor-pointer transition-colors">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-600 shrink-0"></div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold hover:underline">{post.user}</span>
                            <span className="text-twitter-gray">{post.handle}</span>
                            <span className="text-twitter-gray">· {post.time}</span>
                        </div>
                        <p className="mt-1">{post.text}</p>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
