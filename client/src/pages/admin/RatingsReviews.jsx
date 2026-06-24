import { Rating } from "@mui/material";
import { useState, useEffect ,useCallback} from "react";
import { Link } from "react-router-dom";

const RatingsReviews = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);

 const getPackages = useCallback(async () => {
  try {
    setLoading(true);

    const url =
      filter === "most"
        ? `/api/package/get-packages?searchTerm=${search}&sort=packageTotalRatings`
        : `/api/package/get-packages?searchTerm=${search}&sort=packageRating`;

    const res = await fetch(url);
    const data = await res.json();

    if (data?.success) {
      setPackages(data?.packages || []);
    } else {
      setPackages([]);
    }

    setShowMoreBtn((data?.packages?.length || 0) > 8);
    setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading(false);
  }
}, [filter, search]);

useEffect(() => {
  getPackages();
}, [getPackages]);

  const onShowMoreSClick = async () => {
    const startIndex = packages.length;

    const url =
      filter === "most"
        ? `/api/package/get-packages?searchTerm=${search}&sort=packageTotalRatings&startIndex=${startIndex}`
        : `/api/package/get-packages?searchTerm=${search}&sort=packageRating&startIndex=${startIndex}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data?.packages?.length < 9) {
      setShowMoreBtn(false);
    }

    setPackages((prev) => [...prev, ...(data?.packages || [])]);
  };

  return (
    <div className="shadow-xl rounded-lg w-full flex flex-col p-5 gap-2">

      {loading && <h1 className="text-center text-lg">Loading...</h1>}

      <input
        className="p-2 rounded border"
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="my-2 border-y-2 py-2">
        <ul className="w-full flex justify-around">
          <li
            id="all"
            className={`cursor-pointer border rounded-xl p-2 ${
              filter === "all" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={(e) => setFilter(e.target.id)}
          >
            All
          </li>

          <li
            id="most"
            className={`cursor-pointer border rounded-xl p-2 ${
              filter === "most" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={(e) => setFilter(e.target.id)}
          >
            Most Rated
          </li>
        </ul>
      </div>

      {/* EMPTY STATE FIX */}
      {!loading && packages.length === 0 && (
        <h1 className="text-center text-2xl">No Ratings Available!</h1>
      )}

      {packages.map((pack, i) => (
        <div
          key={i}
          className="border rounded-lg w-full flex p-3 justify-between gap-2 flex-wrap items-center"
        >
          <Link to={`/package/ratings/${pack._id}`}>
            <img
              src={
                pack?.packageImages?.[0]
                  ? `http://localhost:8000/images/${pack.packageImages[0]}`
                  : "https://via.placeholder.com/80"
              }
              alt="image"
              className="w-20 h-20 rounded"
            />
          </Link>

          <Link to={`/package/ratings/${pack._id}`}>
            <p className="font-semibold hover:underline">
              {pack?.packageName}
            </p>
          </Link>

          <p className="flex items-center gap-1">
            <Rating value={pack?.packageRating || 0} precision={0.1} readOnly />
            ({pack?.packageTotalRatings || 0})
          </p>
        </div>
      ))}

      {showMoreBtn && (
        <button
          onClick={onShowMoreSClick}
          className="text-sm bg-green-700 text-white p-2 m-3 rounded w-max"
        >
          Show More
        </button>
      )}
    </div>
  );
};

export default RatingsReviews;
