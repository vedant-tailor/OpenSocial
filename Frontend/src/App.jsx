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

  if (isAuthPage) return children;

  return (
    <div className="flex min-h-screen bg-transparent relative">
      <div className="hidden md:block w-0 xl:w-[260px] relative z-50">
        <Sidebar />
      </div>
      
      <main className="flex-1 min-h-screen w-full md:pl-[100px] xl:pl-4 max-w-[1600px] mx-auto pt-4 md:pt-8 pb-24 md:pb-8 px-4 relative z-0">
        {children}
      </main>
      
      <BottomNav />
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