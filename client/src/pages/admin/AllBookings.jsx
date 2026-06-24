import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Chart from "../components/Chart";

const AllBookings = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [currentBookings, setCurrentBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

 const getAllBookings = useCallback(async () => {
  try {
    setLoading(true);
    setError("");

    const res = await fetch(
      `/api/booking/get-currentBookings?searchTerm=${searchTerm}`
    );

    const data = await res.json();

    if (data?.success) {
      setCurrentBookings(data?.bookings || []);
    } else {
      setError(data?.message || "Something went wrong");
    }

    setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading(false);
    setError("Something went wrong");
  }
}, [searchTerm]);

  useEffect(() => {
    getAllBookings();
  },  [getAllBookings]);

  const handleCancel = async (id) => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/booking/cancel-booking/${id}/${currentUser._id}`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (data?.success) {
        alert(data?.message);
        getAllBookings();
      } else {
        alert(data?.message);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[95%] shadow-xl rounded-lg p-3 px-1 flex flex-col gap-2">
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

        <div className="w-full border-b-4 p-3">
          <input
            className="border rounded-lg p-2 mb-2 outline-none"
            type="text"
            placeholder="Search Username or Email"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          {currentBookings.length > 0 && (
            <Chart data={currentBookings} />
          )}
        </div>

        {!loading &&
          currentBookings.length > 0 &&
          currentBookings.map((booking, i) => {
            return (
              <div
                className="w-full border-y-2 p-3 flex flex-wrap overflow-auto gap-3 items-center justify-between"
                key={booking._id || i}
              >
                <Link
                  to={`/package/${booking?.packageDetails?._id}`}
                >
                  <img
                    className="w-12 h-12 object-cover rounded"
                    src={`http://localhost:8000/images/${booking?.packageDetails?.packageImages?.[0]}`}
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

                <button
                  onClick={() =>
                    handleCancel(booking._id)
                  }
                  className="p-2 rounded bg-red-600 text-white hover:opacity-95"
                >
                  Cancel
                </button>
              </div>
            );
          })}

        {!loading &&
          currentBookings.length === 0 && (
            <p className="text-center text-gray-500 py-5">
              No bookings found
            </p>
          )}
      </div>
    </div>
  );
};

export default AllBookings;