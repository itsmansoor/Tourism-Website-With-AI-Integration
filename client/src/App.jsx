import { useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Header from "./pages/components/Header";
import Profile from "./pages/Profile";
import About from "./pages/About";
import PrivateRoute from "./pages/Routes/PrivateRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./pages/Routes/AdminRoute";
import UpdatePackage from "./pages/admin/UpdatePackage";
import Package from "./pages/Package";
import RatingsPage from "./pages/RatingsPage";
import Booking from "./pages/user/Booking";
import Search from "./pages/Search";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Footer from "./pages/components/Footer";
import AskAIModal from "./pages/components/AskAIModal";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "leaflet/dist/leaflet.css";
import { FaRobot } from "react-icons/fa";

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [aiReply, setAIReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (question) => {
    setLoading(true);
    setAIReply("");

    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: question,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Trevo Travel App",
          },
        }
      );

      const response = res.data?.choices?.[0]?.message?.content;
      setAIReply(response || "No answer from AI.");
    } catch (error) {
      console.log("AI Error:", error.response?.data || error.message);
      setAIReply("Something went wrong with AI request!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BrowserRouter>
        <Header />

        <div className="max-w-7xl mx-auto py-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<Search />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/package/:id" element={<Package />} />
            <Route path="/package/ratings/:id" element={<RatingsPage />} />

            {/* User Protected */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile/user" element={<Profile />} />
              <Route path="/booking/:packageId" element={<Booking />} />
            </Route>

            {/* Admin Protected */}
            <Route element={<AdminRoute />}>
              <Route path="/profile/admin" element={<AdminDashboard />} />
              <Route
                path="/profile/admin/update-package/:id"
                element={<UpdatePackage />}
              />
            </Route>
          </Routes>
        </div>

        <ToastContainer />
        <Footer />
      </BrowserRouter>

      {/* AI Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl animate-bounce"
      >
        <FaRobot size={24} />
      </button>

      {/* AI Modal */}
      <AskAIModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAsk={handleAsk}
        reply={aiReply}
        loading={loading}
      />
    </>
  );
};

export default App;