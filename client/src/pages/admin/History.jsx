import { useState, useEffect ,useCallback} from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const History = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  
  const getAllBookings = useCallback(async () => {
  try {
    setLoading(true);

    const res = await fetch(
      `/api/booking/get-allBookings?searchTerm=${search}`
    );

    const data = await res.json();

    if (data?.success) {
      setAllBookings(data?.bookings || []);
      setError("");
    } else {
      setError(data?.message || "Error");
      setAllBookings([]);
    }

    setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading(false);
  }
}, [search]);
useEffect(() => {
  getAllBookings();
}, [getAllBookings]);

  const handleHistoryDelete = async (id) => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/booking/delete-booking-history/${id}/${currentUser._id}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (data?.success) {
        toast.success(data?.message || "Deleted");
        getAllBookings();
      } else {
        toast.error(data?.message || "Failed");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[95%] shadow-xl rounded-lg p-3 flex flex-col gap-2">

        <h1 className="text-center text-2xl">History</h1>

        {loading && (
          <h1 className="text-center text-2xl">
            Loading...
          </h1>
        )}

        {error && (
          <h1 className="text-center text-2xl text-red-600">
            {error}
          </h1>
        )}

        <div className="w-full border-b-4">
          <input
            className="border rounded-lg p-2 mb-2"
            type="text"
            placeholder="Search Username or Email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {!loading &&
          allBookings.length > 0 &&
          allBookings.map((booking) => (
            <div
              className="w-full border-y-2 p-3 flex flex-wrap gap-3 items-center justify-between"
              key={booking._id}
            >
              <Link
                to={`/package/${booking?.packageDetails?._id}`}
              >
                <img
                  className="w-12 h-12 object-cover"
                  src={`http://localhost:8000/images/${
                    booking?.packageDetails
                      ?.packageImages?.[0]
                  }`}
                  alt="Package"
                />
              </Link>

              <Link
                to={`/package/${booking?.packageDetails?._id}`}
              >
                <p className="hover:underline">
                  {
                    booking?.packageDetails
                      ?.packageName
                  }
                </p>
              </Link>

              <p>{booking?.buyer?.username}</p>
              <p>{booking?.buyer?.email}</p>
              <p>{booking?.date}</p>

              {(new Date(booking?.date).getTime() <
                new Date().getTime() ||
                booking?.status === "Cancelled") && (
                <button
                  onClick={() =>
                    handleHistoryDelete(booking._id)
                  }
                  className="p-2 rounded bg-red-600 text-white hover:opacity-95"
                >
                  Delete
                </button>
              )}
            </div>
          ))}

        {!loading && allBookings.length === 0 && (
          <p className="text-center text-gray-500">
            No history found
          </p>
        )}
      </div>
    </div>
  );
};

export default History;