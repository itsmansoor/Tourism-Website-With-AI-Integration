import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  updatePassStart,
  updatePassSuccess,
  updatePassFailure,
} from "../../redux/user/userSlice";

import { toast } from "react-toastify";
import axios from "axios";
import { FiUpload } from "react-icons/fi";

const UpdateProfile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [updateProfileDetailsPanel, setUpdateProfileDetailsPanel] =
    useState(true);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [updatePassword, setUpdatePassword] = useState({
    oldpassword: "",
    newpassword: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        address: currentUser.address || "",
        phone: currentUser.phone || "",
        avatar: currentUser.avatar || "",
      });

      if (currentUser.avatar) {
        setAvatarPreview(
          `http://localhost:8000/images/${currentUser.avatar}`
        );
      }
    }
  }, [currentUser]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setAvatarFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePass = (e) => {
    setUpdatePassword((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();

    if (
      !avatarFile &&
      currentUser.username === formData.username &&
      currentUser.email === formData.email &&
      currentUser.address === formData.address &&
      currentUser.phone === formData.phone
    ) {
      toast.error("Change at least 1 field to update details");
      return;
    }

    try {
      dispatch(updateUserStart());

      const updatedForm = new FormData();

      updatedForm.append("username", formData.username);
      updatedForm.append("email", formData.email);
      updatedForm.append("address", formData.address);
      updatedForm.append("phone", formData.phone);

      if (avatarFile) {
        updatedForm.append("avatar", avatarFile);
      }

      const res = await axios.post(
        `/api/user/update/${currentUser._id}`,
        updatedForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = res.data;

      if (data.success) {
        dispatch(updateUserSuccess(data.user));

        toast.success(data.message || "Profile updated successfully");
      } else {
        dispatch(updateUserFailure(data.message));

        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);

      dispatch(updateUserFailure("Something went wrong"));

      toast.error("Something went wrong");
    }
  };

  const updateUserPassword = async (e) => {
    e.preventDefault();

    if (
      !updatePassword.oldpassword ||
      !updatePassword.newpassword
    ) {
      toast.error("Enter valid passwords");

      return;
    }

    if (
      updatePassword.oldpassword ===
      updatePassword.newpassword
    ) {
      toast.error("New password can't be same");

      return;
    }

    try {
      dispatch(updatePassStart());

      const res = await fetch(
        `/api/user/update-password/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatePassword),
        }
      );

      const data = await res.json();

      if (!data.success) {
        dispatch(updatePassFailure(data.message));

        toast.error(data.message);

        if (res.status === 401) {
          navigate("/login");
        }

        return;
      }

      dispatch(updatePassSuccess());

      toast.success(data.message || "Password updated");

      setUpdatePassword({
        oldpassword: "",
        newpassword: "",
      });
    } catch (err) {
      console.log(err);

      dispatch(updatePassFailure("Something went wrong"));

      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center bg-[#6358DC] py-10">
      <div className="w-[90%] md:w-[60%] bg-white rounded-md shadow-lg p-6">
        <h1 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          {updateProfileDetailsPanel ? (
            <>
              Update <span className="text-[#6358DC]">Profile</span>
            </>
          ) : (
            <>
              Change <span className="text-[#6358DC]">Password</span>
            </>
          )}
        </h1>

        {updateProfileDetailsPanel ? (
          <form
            onSubmit={updateUserDetails}
            className="space-y-4"
          >
            {/* AVATAR */}
            <div className="flex items-center gap-4">
              <label
                htmlFor="avatarUpload"
                className="cursor-pointer flex items-center gap-2 text-[#6358DC] font-medium"
              >
                <FiUpload />
                Upload Avatar
              </label>

              <input
                type="file"
                id="avatarUpload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className="w-14 h-14 rounded-full object-cover border"
                />
              )}
            </div>

            {/* USERNAME */}
            <div>
              <label className="font-medium">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Your Username"
                className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="font-medium">
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                maxLength={200}
                placeholder="Your Address"
                className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none resize-none"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="font-medium">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Phone"
                className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
              />
            </div>

            {/* UPDATE BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6358DC] text-white p-3 rounded-md hover:opacity-90"
            >
              {loading ? "Loading..." : "Update"}
            </button>

            {/* CHANGE PASSWORD BUTTON */}
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setUpdateProfileDetailsPanel(false)
              }
              className="w-full bg-red-600 text-white p-3 rounded-md hover:opacity-90"
            >
              Change Password
            </button>
          </form>
        ) : (
          <form
            onSubmit={updateUserPassword}
            className="space-y-4"
          >
            {/* OLD PASSWORD */}
            <div>
              <label className="font-medium">
                Old Password
              </label>

              <input
                type="password"
                name="oldpassword"
                value={updatePassword.oldpassword}
                onChange={handlePass}
                placeholder="Enter old password"
                className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
              />
            </div>

            {/* NEW PASSWORD */}
            <div>
              <label className="font-medium">
                New Password
              </label>

              <input
                type="password"
                name="newpassword"
                value={updatePassword.newpassword}
                onChange={handlePass}
                placeholder="Enter new password"
                className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
              />
            </div>

            {/* UPDATE PASSWORD BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6358DC] text-white p-3 rounded-md hover:opacity-90"
            >
              {loading
                ? "Loading..."
                : "Update Password"}
            </button>

            {/* BACK BUTTON */}
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setUpdateProfileDetailsPanel(true);

                setUpdatePassword({
                  oldpassword: "",
                  newpassword: "",
                });
              }}
              className="w-full bg-red-600 text-white p-3 rounded-md hover:opacity-90"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateProfile;