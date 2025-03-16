import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PlaceItem from "./PlaceItem";

const SearchResults = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const address = searchParams.get("address");
  const city = searchParams.get("city"); 
  const type = searchParams.get("type");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  

  useEffect(() => {
    if (!address && !city && !type && !minPrice && !maxPrice ) return;

    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
  
      try {
        let query = "";
        if (address) query += `address=${encodeURIComponent(address)}`;
        if (city) query += `${query ? "&" : ""}city=${encodeURIComponent(city)}`;
        if (type) query += `${query ? "&" : ""}type=${encodeURIComponent(type)}`;
        if (minPrice) query += `${query ? "&" : ""}minPrice=${encodeURIComponent(minPrice)}`;
        if (maxPrice) query += `${query ? "&" : ""}maxPrice=${encodeURIComponent(maxPrice)}`;
  
        const response = await fetch(`http://localhost:5000/api/places/newest?${query}`);
        const data = await response.json();
  
        console.log("API Response:", data); 
  
        if (!response.ok) {
          throw new Error(data.message || "No places found.");
        }
  
        
        setPlaces(data.places && Array.isArray(data.places) ? data.places : []);
      } catch (err) {
        setError(err.message || "Failed to fetch places.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchPlaces();
  }, [address, city, type, minPrice,maxPrice]);

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", textAlign: "center" }}>
      <h2>Search Results for "{address || city}"</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && places.length === 0 && <p>No places found.</p>}

      <ul className="places-list">
        {places.map((place) => (
          <PlaceItem
            key={place._id}
            id={place._id}
            image={place.image}
            title={place.title}
            description={place.description}
            address={place.address}
            creatorId={place.creator}
            coordinates={place.location}
          />
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
