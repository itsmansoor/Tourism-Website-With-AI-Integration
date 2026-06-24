import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const MyBookings = () => {
  const currentUser = useSelector((state) => state.user.currentUser);

  const [currentBookings, setCurrentBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const getAllBookings = useCallback(async () => {
    if (!currentUser?._id) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `/api/booking/get-UserCurrentBookings/${currentUser._id}?searchTerm=${searchTerm}`
      );

      const data = await res.json();

      if (data?.success) {
        setCurrentBookings(data.bookings || []);
      } else {
        setError(data?.message || "Failed to fetch bookings");
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }, [currentUser?._id, searchTerm]);

  useEffect(() => {
    getAllBookings();
  }, [getAllBookings]);

  const handleCancel = async (id) => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/booking/cancel-booking/${id}/${currentUser?._id}`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (data?.success) {
        toast.success(data?.message || "Booking cancelled");
        getAllBookings();
      } else {
        toast.error(data?.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[95%] shadow-xl rounded-lg p-4 flex flex-col gap-4 bg-white">
        {/* SEARCH */}
        <div className="w-full border-b pb-3">
          <input
            className="border rounded-lg p-2 w-full md:w-[300px] outline-none"
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* LOADING */}
        {loading && (
          <h1 className="text-center text-2xl font-semibold">
            Loading...
          </h1>
        )}

        {/* ERROR */}
        {error && (
          <h1 className="text-center text-red-500 text-xl">
            {error}
          </h1>
        )}

        {/* NO BOOKINGS */}
        {!loading && currentBookings.length === 0 && !error && (
          <h1 className="text-center text-xl">
            No bookings found
          </h1>
        )}

        {/* BOOKINGS */}
        {!loading &&
          currentBookings.map((booking) => (
            <div
              key={booking._id}
              className="w-full border rounded-lg p-3 flex flex-wrap gap-4 items-center justify-between"
            >
              <Link to={`/package/${booking?.packageDetails?._id}`}>
                <img
                  className="w-16 h-16 object-cover rounded"
                  src={`http://localhost:8000/images/${booking?.packageDetails?.packageImages?.[0]}`}
                  alt="Package"
                />
              </Link>

              <Link
                to={`/package/${booking?.packageDetails?._id}`}
                className="hover:underline font-semibold"
              >
                {booking?.packageDetails?.packageName}
              </Link>

              <p>{booking?.buyer?.username}</p>

              <p>{booking?.buyer?.email}</p>

              <p>{booking?.date}</p>

              <button
                onClick={() => handleCancel(booking._id)}
                className="p-2 rounded bg-red-600 text-white hover:opacity-90"
              >
                Cancel
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyBookings;