import React, { useState } from "react";

const Kards = (props) => {
  const [isFavorite, setIsFavorite] = useState(false);
  //router.post('/:uid/favorites/:pid', placesControllers.addFavoritePlace);
  const addToFavorites = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/places/${props.userId}/favorites/${props.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setIsFavorite(true);
      } else {
        console.error("Failed to add to favorites");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center py-4">
      <div className="w-80 rounded-lg bg-white shadow-lg scale-110">
        <div className="relative">
          <img
            className="rounded-lg w-full h-52 object-cover"
            src={`http://localhost:5000/${props.image}`}
            alt={props.title}
          />
          <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition"></div>
        </div>
        <div className="p-4">
          <div className="flex justify-between text-sm font-bold text-gray-800">
            <span>{props.title}</span>
            <button
              onClick={addToFavorites}
              disabled={isFavorite}
              className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                isFavorite ? "bg-gray-400 text-white" : "bg-blue-500 text-white"
              }`}
            >
              {isFavorite ? "Added" : "Add to Favorites"}
            </button>
          </div>
          <p className="text-sm text-gray-600 my-2">
            <span className="text-sm font-bold text-gray-800">ADDRESS: </span> {props.address}
          </p>
          <p className="text-sm text-gray-600 my-2">
            <span className="text-sm font-bold text-gray-800">CITY: </span> {props.city}
          </p>
          <h5 className="text-sm font-bold text-gray-800">Price $</h5>
        </div>
      </div>
    </div>
  );
};

export default Kards;
