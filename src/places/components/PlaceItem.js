import React, { useState, useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceItem.css';

const PlaceItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isFavoritesPage = useRouteMatch('/favorites/:userId');

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

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => setShowConfirmModal(true);
  const cancelDeleteHandler = () => setShowConfirmModal(false);

  const confirmDeleteHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === props.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? props.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
            <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and delete this place? Please note that it can't be undone thereafter.</p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}

          {/* Image Slider Section */}
          <div className="place-item__slider">
            {props.images?.length > 0 && (
              <div className="slider-container">
                <img
  src={`${process.env.REACT_APP_ASSET_URL}/${props.images[currentImageIndex].replace(/\\/g, '/')}`}
  alt={`${props.title} - ${currentImageIndex + 1}`}
  className="slider-image"
/>
                {props.images.length > 1 && (
                  <div className="slider-controls">
                    <button onClick={prevImage}>&lt;</button>
                    <span>{currentImageIndex + 1} / {props.images.length}</span>
                    <button onClick={nextImage}>&gt;</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="place-item__info">
            <div className="info-row">
              <span className="label">Titulli:</span>
              <span>{props.title}</span>
            </div>
            <div className="info-row">
              <span className="label">Address:</span>
              <span>{props.address}</span>
            </div>
            <div className="info-row">
              <span className="label">Pershkrimi:</span>
              <span>{props.description}</span>
            </div>
          </div>

          <div className="place-item__actions">
            {auth.userId === props.creatorId && (
              <React.Fragment>
                <Button to={`/places/${props.id}`}>EDIT</Button>
                <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>
              </React.Fragment>
            )}

            {!isFavoritesPage && auth.isLoggedIn && (
              <Button
              onClick={addToFavorites}
                disabled={isFavorite}
                className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                  isFavorite ? "bg-gray-400 text-white" : "bg-blue-500 text-white"
                }`}
              >
                {isFavorite ? "Added" : "Add to Favorites"}
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
