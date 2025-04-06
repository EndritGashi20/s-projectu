import React from "react";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import Map from '../../shared/components/UIElements/Map';
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const SinglePlace = () => {
    const placeId = useParams().placeId;
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchPlaces = async () => {
            setLoading(true);
            setError(null);
        
            try {
                const response = await fetch(`http://localhost:5000/api/places/${placeId}`);
                const data = await response.json();
            
                if (!response.ok) {
                    throw new Error(data.message || "No place found.");
                }
            
                setPlace(data.place || null);
            } catch (err) {
                setError(err.message || "Failed to fetch place.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchPlaces();
    }, [placeId]);

    useEffect(() => {
        if (!place || !place.creator) return;

        const fetchUser = async () => {
            setLoading(true);
            setError(null);
        
            try {
                const response = await fetch(`http://localhost:5000/api/users/user/${place.creator}`);
                const data = await response.json();
            
                if (!response.ok) {
                    throw new Error(data.message || "User not found.");
                }
            
                setUser(data.user || null);
            } catch (err) {
                setError(err.message || "Failed to fetch user.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
       // console.log(user);
    }, [place]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!place) return <div>No place found</div>;

    return (
        <div style={{
            minHeight: "100vh",
            padding: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "900px",
                background: "#fff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                transition: "transform 0.3s ease",
                ":hover": {
                    transform: "translateY(-5px)"
                }
            }}>
                {/* Property Image */}
                <div style={{
                    height: "400px",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <img 
                        src={`http://localhost:5000/${place?.image}`}
                        alt={place?.title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center"
                        }} 
                    />
                    <div style={{
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "500"
                    }}>
                        ${place?.price}/mo
                    </div>
                </div>

                {/* Property Details */}
                <div style={{ padding: "2rem" }}>
                    <h1 style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "28px",
                        fontWeight: "700",
                        color: "#111827"
                    }}>
                        {place?.title}
                    </h1>

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "1.5rem",
                        color: "#6b7280"
                    }}>
                        <span style={{ marginRight: "16px" }}>📍 {place?.address}</span>
                        <span>🌆 {place?.city}</span>
                    </div>
                     {/* Description */}
                     <div style={{ marginBottom: "2rem" }}>
                        <h2 style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            margin: "0 0 1rem 0",
                            color: "#111827"
                        }}>
                            About this property
                        </h2>
                        <p style={{
                            lineHeight: "1.6",
                            color: "#4b5563",
                            margin: "0"
                        }}>
                            {place?.description}
                        </p>
                    </div>

                    

                    {/* Map Location */}
                    <div>
                        <h2 style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            margin: "0 0 1rem 0",
                            color: "#111827"
                        }}>
                            Location
                        </h2>
                        <div className="map-container" style={{ height: "300px" }}>
                            {place?.location && <Map center={place.location} zoom={16} />}
                        </div>
                    </div>

                    {/* Creator Information Card */}
                    <Link 
                                to={`/${user.id}/places`}
                                key={user._id}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                              >
                    <div style={{
                        background: "#f9fafb",
                        padding: "1.5rem",
                        borderRadius: "12px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        marginBottom: "2rem",
                        marginTop: "2rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px"
                    }}>
                    
                        <img 
                            src={`http://localhost:5000/${user?.image}`} 
                            alt={user?.name} 
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                objectFit: "cover"
                            }} 
                        />
                        <h2 style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            color: "#111827"
                        }}>
                            {user?.name}
                        </h2>
                    </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SinglePlace;
