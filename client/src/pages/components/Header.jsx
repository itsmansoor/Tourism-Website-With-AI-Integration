import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import defaultProfileImg from "../../assets/images/profile.png";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
    
  const activeLink = location.pathname;

  const linkClass = (path) =>
    `hover:underline hover:scale-105 transition-all duration-150 ${
      activeLink === path ? "underline text-orange-500" : ""
    }`;

  const avatarSrc = currentUser?.avatar
    ? `http://localhost:8000/images/${currentUser.avatar}`
    : defaultProfileImg;

  return (
    <div className="fixed top-0 left-0 w-full bg-white z-50">
      <div className="max-w-7xl w-full mx-auto p-4 text-gray-800">

        {/* Navbar */}
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex-1">
            <Link to="/">
              <h1 className="text-4xl font-bold text-[#EB662B]">Trevo</h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex justify-center flex-1">
            <ul className="flex items-center gap-6 text-lg">
              <li className={linkClass("/")}>
                <Link to="/">Home</Link>
              </li>
              <li className={linkClass("/search")}>
                <Link to="/search">Bookings</Link>
              </li>
              <li className={linkClass("/about")}>
                <Link to="/about">About</Link>
              </li>
              <li className={linkClass("/contact")}>
                <Link to="/contact">Contact</Link>
              </li>
              <li className={linkClass("/blog")}>
                <Link to="/blog">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Profile / Login */}
          <div className="flex-1 flex justify-end items-center">
            {currentUser ? (
              <Link
                to={`/profile/${
                  currentUser.user_role === 1 ? "admin" : "user"
                  
                }`}
              >``
                <img
                  src={avatarSrc}
                  alt="avatar"
                  className="border w-10 h-10 rounded-full object-cover"
                />
              </Link>
            ) : (
              <Link
                className="bg-orange-500 text-white px-8 py-2 rounded-full"
                to="/login"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="text-3xl ml-4 md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <ul className="flex flex-col gap-4 mt-4 text-lg md:hidden">
            <li className={linkClass("/")}>
              <Link to="/">Home</Link>
            </li>
            <li className={linkClass("/search")}>
              <Link to="/search">Bookings</Link>
            </li>
            <li className={linkClass("/about")}>
              <Link to="/about">About</Link>
            </li>
            <li className={linkClass("/contact")}>
              <Link to="/contact">Contact</Link>
            </li>
            <li className={linkClass("/blog")}>
              <Link to="/blog">Blog</Link>
            </li>
          </ul>
        )}

        <hr className="border border-orange-500 mt-2" />
      </div>
    </div>
  );
};

export default Header;