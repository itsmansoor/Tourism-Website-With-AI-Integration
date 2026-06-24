import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import loginImage from "../assets/images/login.png";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      dispatch(loginStart());

      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data?.success) {
        dispatch(loginSuccess(data.user));
        toast.success(data.message || "Login successful");
        navigate("/");
      } else {
        dispatch(loginFailure(data.message || "Login failed"));
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#FFF1DA]">
      <div className="w-[90%] md:w-[60%] bg-white rounded-md flex flex-col gap-6 p-4">
        {/* Heading */}
        <h1 className="text-center text-lg md:text-3xl font-bold text-gray-800 mt-6">
          Welcome to <span className="text-[#6358DC]">Trevo</span>
        </h1>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-5 items-center justify-center">
          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img src={loginImage} alt="Login" className="max-h-[300px]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full md:w-1/2 px-4">
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
                placeholder="Your Email"
              />
            </div>

            <div className="mt-4">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
                placeholder="Your Password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#EB662B] text-white p-3 mt-4 rounded-md"
            >
              {loading ? "Loading..." : "Login"}
            </button>

            <p className="my-4 text-center">
              Don't have an account?{" "}
              <span className="text-[#EB662B]">
                <Link to="/signup">Signup</Link>
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;