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
        {/* Right Sidebar Placeholder - Removed */}
        {!isAuthPage && (
             <div className="hidden lg:block w-[350px] pl-8 py-4 border-l border-twitter-border">
                {/* Empty for now or can be removed entirely if layout allows */}
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