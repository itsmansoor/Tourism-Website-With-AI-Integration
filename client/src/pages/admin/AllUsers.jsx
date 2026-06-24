import { useState, useCallback ,useEffect} from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const getUsers = useCallback(async () => {
  try {
    setLoading(true);

    const res = await fetch(
      `/api/user/getAllUsers?searchTerm=${search}`
    );

    const data = await res.json();

    if (data?.success === false) {
      setError(data?.message || "Error");
      setAllUsers([]);
    } else {
      setAllUsers(data || []);
      setError("");
    }

    setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading(false);
  }
}, [search]);

useEffect(() => {
  getUsers();
}, [getUsers]);
  const handleUserDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete the user!"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const res = await fetch(
        `/api/user/delete-user/${userId}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (data?.success === false) {
        toast.error(data?.message || "Failed to delete");
      } else {
        toast.success(data?.message || "User deleted");
        getUsers();
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full shadow-lg rounded-lg p-2">

        <h1 className="text-2xl text-center">
          {loading ? "Loading..." : "All Users"}
        </h1>

        {error && (
          <h1 className="text-center text-red-600 text-xl">
            {error}
          </h1>
        )}

        <input
          type="text"
          className="my-3 p-2 rounded-lg border"
          placeholder="Search name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <h2 className="text-xl font-semibold mb-2 ml-2">
          Total Users: {allUser?.length || 0}
        </h2>

        {allUser?.length > 0 ? (
          allUser.map((user) => (
            <div
              className="flex justify-between p-2 px-3 border-y-2 gap-3"
              key={user._id}
            >
              <h5 className="flex flex-1 justify-center items-center">
                {user.username}
              </h5>

              <h5 className="flex flex-1 justify-center items-center">
                {user.email}
              </h5>

              <h5 className="flex flex-1 justify-center items-center">
                {user.address}
              </h5>

              <h5 className="flex flex-1 justify-center items-center">
                {user.phone}
              </h5>

              <div className="flex flex-1 justify-center items-center">
                <button
                  disabled={loading}
                  onClick={() => handleUserDelete(user._id)}
                  className="p-2 text-red-500 hover:scale-125 disabled:opacity-70"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-4">No users found</p>
        )}
      </div>
    </div>
  );
};

export default AllUsers;