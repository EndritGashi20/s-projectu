import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../shared/context/auth-context";

const Kards = (props) => {
  const auth = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const location = useLocation();

  const addToFavorites = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `/places/${props.userId}/favorites/${props.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + auth.token
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

  const isFavoritesPage = location.pathname.startsWith("/favorites/");

 
  const firstImage = props.images && props.images.length > 0
    ? `${process.env.REACT_APP_ASSET_URL}/${props.images[0]}`
    : `${process.env.REACT_APP_ASSET_URL}/${props.image}`;

  return (
    <div className="flex justify-center items-center py-4">
      <Link
        to={`/SinglePlace/${props.id}`}
        className="w-80 rounded-lg bg-white shadow-lg scale-110"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className="relative">
          <img
            className="rounded-lg w-full h-52 object-cover"
            src={firstImage}
            alt={props.title}
          />
          <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition"></div>
        </div>
        <div className="p-4">
          {auth.isLoggedIn && !isFavoritesPage && (
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
          )}
          <p className="text-sm text-gray-600 my-2">
            <span className="text-sm font-bold text-gray-800">ADDRESS: </span> {props.address}
          </p>
          <p className="text-sm text-gray-600 my-2">
            <span className="text-sm font-bold text-gray-800">CITY: </span> {props.city}
          </p>
          <h5 className="text-sm font-bold text-gray-800">Price ${props.price}</h5>
        </div>
      </Link>
    </div>
  );
};

export default Kards;
