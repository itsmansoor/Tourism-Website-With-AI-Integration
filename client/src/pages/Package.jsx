import WeatherCard from "./components/WeatherCard";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import Rating from "@mui/material/Rating";
import { useSelector } from "react-redux";
import RatingCard from "./RatingCard";
import { toast } from "react-toastify";
import MapModal from "./components/MapModal";
import { FaClock, FaArrowRight } from "react-icons/fa";

const Package = () => {
  const { currentUser } = useSelector((state) => state.user);

  const params = useParams();
  const navigate = useNavigate();

  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [packageData, setPackageData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageRating: 0,
    packageTotalRatings: 0,
    packageImages: [],
  });

  const [ratingsData, setRatingsData] = useState({
    rating: 0,
    review: "",
    packageId: "",
    userRef: "",
    username: "",
    userProfileImg: "",
  });

  const [packageRatings, setPackageRatings] = useState([]);
  const [ratingGiven, setRatingGiven] = useState(false);

  // sync user data into rating state
  useEffect(() => {
    if (currentUser && params?.id) {
      setRatingsData((prev) => ({
        ...prev,
        packageId: params.id,
        userRef: currentUser?._id,
        username: currentUser?.username,
        userProfileImg: currentUser?.avatar,
      }));
    }
  }, [currentUser, params?.id]);

  // get package data
  const getPackageData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/package/get-package-data/${params?.id}`);

      const data = await res.json();

      if (data?.success) {
        setPackageData(data?.packageData);
      } else {
        setError(data?.message || "Something went wrong!");
      }
    } catch (err) {
      console.log(err);
      setError("Server Error");
    } finally {
      setLoading(false);
    }
  }, [params?.id]);

  // get ratings
  const getRatings = useCallback(async () => {
    try {
      const res = await fetch(`/api/rating/get-ratings/${params?.id}/4`);

      const data = await res.json();

      setPackageRatings(data || []);
    } catch (err) {
      console.log(err);
    }
  }, [params?.id]);

  // check if user already rated
  const checkRatingGiven = useCallback(async () => {
    if (!currentUser) return;

    try {
      const res = await fetch(
        `/api/rating/rating-given/${currentUser?._id}/${params?.id}`,
      );

      const data = await res.json();

      setRatingGiven(data?.given);
    } catch (error) {
      console.log(error);
    }
  }, [currentUser, params?.id]);

  // initial load
  useEffect(() => {
    if (params?.id) {
      getPackageData();
      getRatings();
    }

    if (currentUser) {
      checkRatingGiven();
    }
  }, [params?.id, currentUser, getPackageData, getRatings, checkRatingGiven]);

  // submit rating
  const giveRating = async () => {
    if (ratingGiven) {
      toast.error("You already submitted your rating!");
      return;
    }

    if (ratingsData.rating === 0 && ratingsData.review.trim() === "") {
      toast.error("At least one field is required!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/rating/give-rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingsData),
      });

      const data = await res.json();

      if (data?.success) {
        toast.success(data?.message);

        setRatingsData((prev) => ({
          ...prev,
          rating: 0,
          review: "",
        }));

        getPackageData();
        getRatings();
        checkRatingGiven();
      } else {
        toast.error(data?.message || "Something went wrong!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* loading */}
      {loading && (
        <p className="text-center text-lg font-semibold">Loading...</p>
      )}

      {/* error */}
      {error && (
        <p className="text-center text-red-500 font-semibold">{error}</p>
      )}

      {/* package section */}
      {!loading && !error && (
        <div className="w-full flex flex-col md:flex-row gap-6">
          {/* LEFT */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {packageData?.packageName}
            </h1>

            <p className="text-lg font-semibold text-orange-500">
              {packageData?.packageDestination}
            </p>
            <WeatherCard city={packageData?.packageDestination} />

            <p className="flex items-center gap-2 text-gray-700">
              <FaClock />
              {packageData?.packageDays} Days - {packageData?.packageNights}{" "}
              Nights
            </p>

            {/* rating */}
            {packageData?.packageTotalRatings > 0 && (
              <div className="flex items-center gap-2">
                <Rating
                  value={packageData?.packageRating || 0}
                  precision={0.1}
                  readOnly
                />

                <span>({packageData?.packageTotalRatings})</span>
              </div>
            )}

            {/* description */}
            <p className="text-gray-700 leading-relaxed">
              {packageData?.packageDescription?.length > 150
                ? packageData?.packageDescription.substring(0, 150) + "..."
                : packageData?.packageDescription}
            </p>

            {/* package info */}
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-semibold">Accommodation:</span>{" "}
                {packageData?.packageAccommodation}
              </p>

              <p>
                <span className="font-semibold">Transportation:</span>{" "}
                {packageData?.packageTransportation}
              </p>

              <p>
                <span className="font-semibold">Meals:</span>{" "}
                {packageData?.packageMeals}
              </p>

              <p>
                <span className="font-semibold">Activities:</span>{" "}
                {packageData?.packageActivities}
              </p>

              <p className="text-2xl font-bold text-orange-500">
                Rs. {packageData?.packagePrice}
              </p>
            </div>

            {/* buttons */}
            <div className="flex gap-4">
              <button
                onClick={() =>
                  currentUser
                    ? navigate(`/booking/${params?.id}`)
                    : navigate("/login")
                }
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
              >
                Book Now
              </button>

              <button
                onClick={() => setShowMap(true)}
                className="border border-orange-500 text-orange-500 px-6 py-3 rounded-lg"
              >
                View Map
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-1/2">
            {packageData?.packageImages?.length > 0 ? (
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                loop={packageData?.packageImages?.length > 1}
                className="h-[350px] rounded-xl overflow-hidden"
              >
                {packageData.packageImages.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`http://localhost:8000/images/${img}`}
                      alt={`Package ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="h-[350px] flex items-center justify-center bg-gray-100 rounded-xl">
                No Image Available
              </div>
            )}
          </div>
        </div>
      )}

      {/* reviews */}
      {!loading && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Reviews & Ratings</h2>

          {/* rating form */}
          {!ratingGiven && currentUser && (
            <div className="flex flex-col gap-4 mb-8">
              <Rating
                value={ratingsData?.rating}
                onChange={(e, newValue) =>
                  setRatingsData({
                    ...ratingsData,
                    rating: newValue,
                  })
                }
              />

              <textarea
                rows={4}
                placeholder="Write your review..."
                value={ratingsData?.review}
                onChange={(e) =>
                  setRatingsData({
                    ...ratingsData,
                    review: e.target.value,
                  })
                }
                className="border p-3 rounded-lg resize-none"
              />

              <button
                onClick={giveRating}
                className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg w-fit"
              >
                Submit Review
              </button>
            </div>
          )}

          {/* ratings cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <RatingCard packageRatings={packageRatings} />
          </div>

          {/* view all */}
          {packageData?.packageTotalRatings > 4 && (
            <button
              onClick={() => navigate(`/package/ratings/${params?.id}`)}
              className="flex items-center gap-2 mt-6 border p-3 rounded-lg hover:bg-gray-100"
            >
              View All <FaArrowRight />
            </button>
          )}
        </div>
      )}

      {/* map modal */}
      {showMap && (
        <MapModal
          location={packageData?.packageDestination}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
};

export default Package;
