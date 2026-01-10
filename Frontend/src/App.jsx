import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";

function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <div className="flex max-w-7xl mx-auto">
      {!isAuthPage && <Sidebar />}
      <main className={`${!isAuthPage ? "md:ml-[68px] xl:ml-[275px]" : "w-full"} flex flex-1 min-h-screen pb-16 md:pb-0`}>
        {children}
        {/* Right Sidebar Placeholder */}
        {!isAuthPage && (
             <div className="hidden lg:block w-[350px] pl-8 py-4 border-l border-twitter-border">
                <div className="bg-twitter-dark-gray rounded-2xl p-4">
                    <h2 className="font-bold text-xl mb-4">Who to follow</h2>
                    {/* Dummy items */}
                    <div className="flex items-center gap-3 mb-4">
                         <div className="w-10 h-10 rounded-full bg-gray-500"></div>
                         <div>
                             <p className="font-bold">Elon Musk</p>
                             <p className="text-gray-500 text-sm">@elonmusk</p>
                         </div>
                         <button className="ml-auto bg-white text-black px-4 py-1 rounded-full font-bold text-sm">Follow</button>
                    </div>
                </div>
             </div>
        )}
      </main>
      {!isAuthPage && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <Router>
        <Toaster />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile/:username" element={<Profile />} />
          </Routes>
        </Layout>
    </Router>
  );
}

export default App;