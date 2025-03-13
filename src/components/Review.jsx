import React from "react";

const Review = ({ _id, title, stars, name, image, position }) => {
  return (
    <div key={_id} className="client-review">
      <p className="client-text">{title}</p>

      <div className="client-content">
        <div className="flex gap-3">
          <img src={image} alt={name} className="w-12 h-12 rounded-full" />
          <div className="flex flex-col">
            <p className="font-semibold text-white-800">{name}</p>
            <p className="text-white-500 md:text-base text-sm font-light">
              {position}
            </p>
          </div>
        </div>
        <div className="flex self-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => {
            const hasFraction = stars % 1 !== 0;
            const isHalfStar = index === Math.floor(stars) && hasFraction;

            return (
              <img
                key={index}
                src={
                  index < Math.floor(stars)
                    ? "/assets/star1.png"
                    : isHalfStar
                    ? "/assets/star3.png"
                    : "/assets/star2.png"
                }
                alt="star"
                className="w-5 h-5"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Review;
