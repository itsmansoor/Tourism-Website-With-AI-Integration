import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SingleCard from "./components/SingleCard";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sideBarSearchData, setSideBarSearchData] = useState({
    searchTerm: "",
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [allPackages, setAllPackages] = useState([]);
  const [showMoreBtn, setShowMoreBtn] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const searchTermFromUrl = urlParams.get("searchTerm");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    const searchFilters = {
      searchTerm: searchTermFromUrl || "",
      offer: offerFromUrl === "true",
      sort: sortFromUrl || "createdAt",
      order: orderFromUrl || "desc",
    };

    setSideBarSearchData(searchFilters);

    const fetchAllPackages = async () => {
      try {
        setLoading(true);
        setShowMoreBtn(false);

        const res = await fetch(
          `/api/package/get-packages?${urlParams.toString()}`
        );

        const data = await res.json();

        setAllPackages(data?.packages || []);

        if ((data?.packages || []).length >= 8) {
          setShowMoreBtn(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPackages();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === "searchTerm") {
      setSideBarSearchData((prev) => ({
        ...prev,
        searchTerm: value,
      }));
    }

    if (id === "offer") {
      setSideBarSearchData((prev) => ({
        ...prev,
        offer: checked,
      }));
    }

    if (id === "sort_order") {
      const [sort, order] = value.split("_");

      setSideBarSearchData((prev) => ({
        ...prev,
        sort,
        order,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarSearchData.searchTerm);
    urlParams.set("offer", sideBarSearchData.offer);
    urlParams.set("sort", sideBarSearchData.sort);
    urlParams.set("order", sideBarSearchData.order);

    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const startIndex = allPackages.length;

    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);

    try {
      const res = await fetch(
        `/api/package/get-packages?${urlParams.toString()}`
      );

      const data = await res.json();

      if ((data?.packages || []).length < 8) {
        setShowMoreBtn(false);
      }

      setAllPackages((prev) => [...prev, ...(data?.packages || [])]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search"
              className="border rounded-lg p-3 w-full"
              value={sideBarSearchData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2 items-center">
            <label className="font-semibold">Type:</label>
            <input
              type="checkbox"
              id="offer"
              className="w-5"
              checked={sideBarSearchData.offer}
              onChange={handleChange}
            />
            <span>Offer</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort_order"
              className="p-3 border rounded-lg"
              value={`${sideBarSearchData.sort}_${sideBarSearchData.order}`}
              onChange={handleChange}
            >
              <option value="packagePrice_desc">Price high to low</option>
              <option value="packagePrice_asc">Price low to high</option>
              <option value="packageRating_desc">Top Rated</option>
              <option value="packageTotalRatings_desc">Most Rated</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-[#EB662B] rounded-lg text-white p-3 uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="flex-1">
        <h1 className="text-xl font-semibold border-b p-3 text-slate-700 mt-5">
          Package Results:
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-1">
          {loading && (
            <p className="text-center w-full text-slate-700">Loading...</p>
          )}

          {!loading && allPackages.length === 0 && (
            <p className="text-xl text-slate-700">No Packages Found!</p>
          )}

          {!loading &&
            allPackages.map((packageData, i) => (
              <SingleCard key={i} packageData={packageData} />
            ))}
        </div>

        {showMoreBtn && (
          <button
            onClick={onShowMoreClick}
            className="text-sm bg-green-700 text-white p-2 m-3 rounded"
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;