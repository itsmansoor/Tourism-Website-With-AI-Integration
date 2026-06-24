import { useState,useCallback,useEffect  } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AllPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMoreBtn, setShowMoreBtn] = useState(false);


  const getPackages = useCallback(async () => {
  try {
    setLoading(true);

    let url =
      filter === "offer"
        ? `/api/package/get-packages?searchTerm=${search}&offer=true`
        : filter === "latest"
        ? `/api/package/get-packages?searchTerm=${search}&sort=createdAt`
        : filter === "top"
        ? `/api/package/get-packages?searchTerm=${search}&sort=packageRating`
        : `/api/package/get-packages?searchTerm=${search}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data?.success) {
      setPackages(data?.packages || []);
    } else {
      toast.error(data?.message || "Something went wrong!");
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
  const handleDelete = async (packageId) => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/package/delete-package/${packageId}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      toast.success(data?.message || "Deleted successfully");

      getPackages();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="shadow-xl rounded-lg w-full flex flex-col p-5 gap-2">

      {loading && (
        <h1 className="text-center text-lg">Loading...</h1>
      )}

      <input
        className="p-2 rounded border"
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="my-2 border-y-2 py-2">
        <ul className="w-full flex justify-around">
          {["all", "offer", "latest", "top"].map((item) => (
            <li
              key={item}
              id={item}
              onClick={(e) => setFilter(e.target.id)}
              className={`cursor-pointer border rounded-xl p-2 transition-all duration-300 hover:scale-95 ${
                filter === item ? "bg-blue-500 text-white" : ""
              }`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      {/* packages */}
      {packages.length > 0 ? (
        packages.map((pack) => (
          <div
            key={pack._id}
            className="border rounded-lg w-full flex p-3 justify-between items-center hover:scale-[1.02] transition-all duration-300"
          >
            <Link to={`/package/${pack._id}`}>
              <img
                src={`http://localhost:8000/images/${pack?.packageImages?.[0]}`}
                alt="image"
                className="w-20 h-20 rounded"
              />
            </Link>

            <Link to={`/package/${pack._id}`}>
              <p className="font-semibold hover:underline">
                {pack?.packageName}
              </p>
            </Link>

            <div className="flex flex-col">
              <Link to={`/profile/admin/update-package/${pack._id}`}>
                <button className="text-blue-600 hover:underline">
                  Edit
                </button>
              </Link>

              <button
                onClick={() => handleDelete(pack._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <h1 className="text-center text-2xl">
          No Packages Yet!
        </h1>
      )}

      {showMoreBtn && (
        <button
          onClick={showMoreBtn}
          className="text-sm bg-green-700 text-white p-2 m-3 rounded w-max"
        >
          Show More
        </button>
      )}
    </div>
  );
};

export default AllPackages;