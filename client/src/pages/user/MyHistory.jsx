import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const MyHistory = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // GET BOOKINGS
  const getAllBookings = useCallback(async () => {
    if (!currentUser?._id) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `/api/booking/get-allUserBookings/${currentUser._id}?searchTerm=${search}`
      );

      const data = await res.json();

      if (data?.success) {
        setAllBookings(data?.bookings || []);
      } else {
        setError(data?.message || "Something went wrong");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError("Server Error");
    }
  }, [currentUser, search]);

  // USE EFFECT
  useEffect(() => {
    getAllBookings();
  }, [getAllBookings]);

  // DELETE HISTORY
  const handleHistoryDelete = async (id) => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/booking/delete-booking-history/${id}/${currentUser?._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data?.success) {
        toast.success(data?.message);
        getAllBookings();
      } else {
        toast.error(data?.message || "Delete failed");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Server Error");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[95%] shadow-xl rounded-lg p-3 flex flex-col gap-2">

        <h1 className="text-center text-2xl font-semibold">
          History
        </h1>

        {/* LOADING */}
        {loading && (
          <h1 className="text-center text-2xl">
            Loading...
          </h1>
        )}

        {/* ERROR */}
        {error && (
          <h1 className="text-center text-2xl text-red-600">
            {error}
          </h1>
        )}

        {/* SEARCH */}
        <div className="w-full border-b-4">
          <input
            className="border rounded-lg p-2 mb-2 outline-none"
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>

        {/* BOOKINGS */}
        {!loading &&
          allBookings &&
          allBookings.length > 0 &&
          allBookings.map((booking) => {
            return (
              <div
                className="w-full border-y-2 p-3 flex flex-wrap overflow-auto gap-3 items-center justify-between"
                key={booking?._id}
              >
                {/* IMAGE */}
                <Link to={`/package/${booking?.packageDetails?._id}`}>
                  <img
                    className="w-12 h-12 object-cover rounded"
                    src={`http://localhost:8000/images/${booking?.packageDetails?.packageImages?.[0]}`}
                    alt="Package"
                  />
                </Link>

                {/* PACKAGE NAME */}
                <Link to={`/package/${booking?.packageDetails?._id}`}>
                  <p className="hover:underline">
                    {booking?.packageDetails?.packageName}
                  </p>
                </Link>

                {/* USERNAME */}
                <p>{booking?.buyer?.username}</p>

                {/* EMAIL */}
                <p>{booking?.buyer?.email}</p>

                {/* DATE */}
                <p>{booking?.date}</p>

                {/* DELETE BUTTON */}
                {(new Date(booking?.date).getTime() <
                  new Date().getTime() ||
                  booking?.status === "Cancelled") && (
                  <button
                    onClick={() => {
                      handleHistoryDelete(booking?._id);
                    }}
                    className="p-2 rounded bg-red-600 text-white hover:opacity-95"
                  >
                    Delete
                  </button>
                )}
              </div>
            );
          })}

        {/* NO BOOKINGS */}
        {!loading && allBookings.length === 0 && (
          <p className="text-center text-gray-500 py-5">
            No History Found
          </p>
        )}
      </div>
    </div>
  );
};

export default MyHistory;