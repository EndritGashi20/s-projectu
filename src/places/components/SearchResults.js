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
  const city = searchParams.get("city"); // ✅ Get city from query

  useEffect(() => {
    if (!address && !city) return;

    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = "";
        if (address) query += `address=${encodeURIComponent(address)}`;
        if (city) query += `${query ? '&' : ''}city=${encodeURIComponent(city)}`;

        const response = await fetch(`http://localhost:5000/api/places/search?${query}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "No places found.");
        }

        setPlaces(data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch places.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [address, city]); // ✅ Re-fetch when address or city changes

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", textAlign: "center" }}>
      <h2>Search Results for "{address || city}"</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && places.length === 0 && <p>No places found.</p>}

      <ul className="places-list">
        {places.map((place) => (
          <PlaceItem
            key={place.id}
            id={place.id}
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
