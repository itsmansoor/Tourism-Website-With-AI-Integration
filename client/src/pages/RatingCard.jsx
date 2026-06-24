/* eslint-disable react/prop-types */
import { useState } from "react";
import { Rating } from "@mui/material";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const defaultProfileImg =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTueIx2Jkawe7r91I50VfVAZLS60yx8RjiSfQ&s";

const RatingCard = ({ packageRatings }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      {packageRatings?.map((rating, i) => {
        const isLong = rating?.review?.length > 90;

        return (
          <div
            key={i}
            className="relative w-full rounded-lg border p-3 flex flex-col gap-2"
          >
            {/* USER */}
            <div className="flex gap-2 items-center">
              <img
                src={rating?.userProfileImg ? `http://localhost:8000/images/${rating.userProfileImg}` : defaultProfileImg}
                alt={rating?.username?.[0] || "U"}
                className="w-6 h-6 rounded-full border"
              />
              <p className="font-semibold">{rating?.username}</p>
            </div>

            {/* RATING */}
            <Rating
              value={rating?.rating || 0}
              readOnly
              size="small"
              precision={0.1}
            />

            {/* REVIEW */}
            <p className="break-words">
              {rating?.review
                ? isLong
                  ? rating.review.substring(0, 90) + "..."
                  : rating.review
                : rating.rating < 3
                ? "Not Bad"
                : "Good"}
            </p>

            {/* MORE BUTTON */}
            {isLong && openIndex !== i && (
              <button
                className="flex items-center gap-1 font-semibold"
                onClick={() => setOpenIndex(i)}
              >
                More <FaArrowDown />
              </button>
            )}

            {/* FULL POPUP */}
            {openIndex === i && (
              <div className="absolute inset-0 bg-white p-3 border rounded-lg z-50">
                <div className="flex gap-2 items-center">
                  <img
                    src={rating?.userProfileImg ? `http://localhost:8000/images/${rating.userProfileImg}` : defaultProfileImg}
                    alt="user"
                    className="w-6 h-6 rounded-full border"
                  />
                  <p className="font-semibold">{rating?.username}</p>
                </div>

                <Rating
                  value={rating?.rating || 0}
                  readOnly
                  size="small"
                  precision={0.1}
                />

                <p className="mt-2">{rating?.review}</p>

                <button
                  className="mt-2 flex items-center gap-1 font-semibold"
                  onClick={() => setOpenIndex(null)}
                >
                  Less <FaArrowUp />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default RatingCard;