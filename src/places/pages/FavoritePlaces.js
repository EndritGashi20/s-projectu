import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const FavoritePlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

 useEffect(() => {
     const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/places/${userId}/favorites`
        );
  
        // Ensure we set only the 'favorites' array
        setLoadedPlaces(Array.isArray(responseData.favorites) ? responseData.favorites : []);
      } catch (err) {
        setLoadedPlaces([]); // Default to an empty array if there's an error
      }
    };
     fetchPlaces();
   }, [sendRequest, userId]);

 /* const placeDeleteHandler = deleteedPlaceId => {
     setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deleteedPlaceId));
  };*/

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces}  />}
    </React.Fragment>
  );
};

export default FavoritePlaces;
