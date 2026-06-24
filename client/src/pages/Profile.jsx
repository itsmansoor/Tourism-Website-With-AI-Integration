import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  logOutStart,
  logOutSuccess,
  logOutFailure,
  deleteUserAccountStart,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
} from "../redux/user/userSlice";

import MyBookings from "./user/MyBookings";
import UpdateProfile from "./user/UpdateProfile";
import MyHistory from "./user/MyHistory";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  const [activePanelId, setActivePanelId] = useState(1);

  useEffect(() => {
    // no formData needed here (removed unused state)
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());

      const res = await fetch("/api/auth/logout");
      const data = await res.json();

      if (!data?.success) {
        dispatch(logOutFailure(data?.message));
        toast.error(data?.message || "Logout failed");
        return;
      }

      dispatch(logOutSuccess());
      toast.success(data?.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
      dispatch(logOutFailure("Server error"));
      toast.error("Server error");
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!currentUser?._id) return;

    const confirmDelete = window.confirm(
      "Are you sure? The account will be permanently deleted!"
    );

    if (!confirmDelete) return;

    try {
      dispatch(deleteUserAccountStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data?.success) {
        dispatch(deleteUserAccountFailure(data?.message));
        toast.error(data?.message || "Delete failed");
        return;
      }

      dispatch(deleteUserAccountSuccess());
      toast.success(data?.message);

      navigate("/login");
    } catch (error) {
      console.log(error);
      dispatch(deleteUserAccountFailure("Server error"));
      toast.error("Server error");
    }
  };

  if (!currentUser) {
    return (
      <div className="w-full flex justify-center p-5">
        <p className="text-red-600 font-semibold">Login First</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-wrap max-sm:flex-col p-2">

      {/* LEFT PANEL */}
      <div className="w-[25%] p-3 max-sm:w-full">
        <div className="flex flex-col items-center gap-4 p-3 rounded-lg shadow-lg">

          <img
            src={
              currentUser.avatar
                ? `http://localhost:8000/images/${currentUser.avatar}`
                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTueIx2Jkawe7r91I50VfVAZLS60yx8RjiSfQ&s"
            }
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover"
          />

          <p className="font-semibold">
            Logged in user Information
          </p>

          <button
            onClick={() => setActivePanelId(3)}
            className="px-6 bg-[#6358DC] text-white rounded-lg"
          >
            Edit Profile
          </button>

          <div className="w-full flex flex-col gap-3 shadow-lg p-3 rounded-lg">

            <p className="font-semibold">{currentUser.username}</p>
            <p>{currentUser.email}</p>
            <p>{currentUser.phone}</p>
            <p>{currentUser.address}</p>

            <div className="flex justify-between">
              <button
                onClick={handleLogout}
                className="bg-[#6358DC] text-white px-3 rounded"
              >
                Logout
              </button>

              <button
                onClick={handleDeleteAccount}
                className="bg-orange-600 text-white px-3 rounded"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-[75%] max-sm:w-full">

        <nav className="border-b-4 py-2">
          <button
            className={activePanelId === 1 ? "bg-[#6358DC] text-white p-1" : "p-1"}
            onClick={() => setActivePanelId(1)}
          >
            Bookings
          </button>

          <button
            className={activePanelId === 2 ? "bg-[#6358DC] text-white p-1" : "p-1"}
            onClick={() => setActivePanelId(2)}
          >
            History
          </button>

          <button
            className={activePanelId === 3 ? "bg-[#6358DC] text-white p-1" : "p-1"}
            onClick={() => setActivePanelId(3)}
          >
            Profile
          </button>
        </nav>

        {activePanelId === 1 && <MyBookings />}
        {activePanelId === 2 && <MyHistory />}
        {activePanelId === 3 && <UpdateProfile />}

      </div>

    </div>
  );
};

export default Profile;