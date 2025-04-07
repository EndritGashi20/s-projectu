import { useHistory } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import "./SearchPlaces.css";
import Kards from "./Kards";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useHttpClient } from "../../shared/hooks/http-hook";
  
const cities = ["New York", "Los Angeles", "Chicago", "San Francisco", "Miami","newPlace"];
const types = ["Rent", "Buy"];

const SearchPlaces = () => {
  const [address, setAddress] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const history = useHistory();
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // Refs for Swiper navigation buttons
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  

  // Check if userData exists and then access userId
  const userData = JSON.parse(localStorage.getItem("userData"));
const userId = userData?.userId || null; // Ensures userId is defined

//console.log("User ID:", userId);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest("http://localhost:5000/api/places/all");
        if (responseData) {
          setLoadedPlaces(responseData.places);
        } else {
          setLoadedPlaces([]);
        }
      } catch (err) {
        setLoadedPlaces([]);
      }
    };

    fetchPlaces();
  }, []);

  const handleSearch = () => {
    if (!address.trim() && !selectedCity && !minPrice && !maxPrice && !selectedType) return;

    const queryParams = new URLSearchParams();
    if (address.trim()) queryParams.append("address", address.trim());
    if (selectedCity) queryParams.append("city", selectedCity);
    if (minPrice) queryParams.append("minPrice", minPrice);
    if (maxPrice) queryParams.append("maxPrice", maxPrice);
    if (selectedType) queryParams.append("type", selectedType);

    history.push(`/search?${queryParams.toString()}`);
  };

  return (
    <React.Fragment>
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address..."
          />
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* ✅ Price Range Inputs (Min & Max) */}
          <div className="price-range">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min Price"
            />
            <span> - </span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max Price"
            />
          </div>

         
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="">Select Type</option>
            {types.map((type) => (
              <option key={type} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>

          <button className="search-button" onClick={handleSearch} disabled={!address.trim() && !selectedCity && !minPrice && !maxPrice && !selectedType}>
            Search
          </button>
        </div>
      </div>

      {/* Swiper Slider with Navigation */}
      <div className="relative p-4">
        <button ref={prevRef} className="absolute left-0 z-10 p-2 bg-gray-800 text-white rounded-full shadow-lg top-1/2 -translate-y-1/2">
          ◀
        </button>
        <button ref={nextRef} className="absolute right-0 z-10 p-2 bg-gray-800 text-white rounded-full shadow-lg top-1/2 -translate-y-1/2">
          ▶
        </button>

        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          modules={[Navigation]}
          className="mySwiper"
        >
          {loadedPlaces.map((place) => (
            <SwiperSlide key={place.id}>
              <Link 
            to={`/SinglePlace/${place._id}`} 
            key={place._id}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Kards 
              images={place.images} 
              title={place.title}
              city={place.city}
              address={place.address}
              price={place.price} 
              type={place.type}
              id={place.id}   // Ensure this is the correct ID
              userId={userId} // Pass the logged-in user's ID
            />
            </Link>
          </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </React.Fragment>
  );
};

export default SearchPlaces;
