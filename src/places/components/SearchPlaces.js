import { useHistory } from "react-router-dom";
import { useState } from "react";
import "./SearchPlaces.css";

const cities = ["New York", "Los Angeles", "Chicago", "San Francisco", "Miami","city"]; // Sample cities

const SearchPlaces = () => {
  const [address, setAddress] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const history = useHistory();

  const handleSearch = () => {
    if (!address.trim() && !selectedCity) return; // Ensure at least one is provided

    const queryParams = new URLSearchParams();
    if (address.trim()) queryParams.append("address", address.trim());
    if (selectedCity) queryParams.append("city", selectedCity);

    history.push(`/search?${queryParams.toString()}`);
  };

  return (
    <div className="search-container">
      <div className="search-box">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address..."
        />
        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
          <option value="">Select a city (optional)</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <button onClick={handleSearch} disabled={!address.trim() && !selectedCity}>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchPlaces;
