import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      },
      city: {
        value: null,
        isValid: false
      },
      type: {
        value: null,
        isValid: false
      },
      price: {
        value: null,
        isValid: false
      }
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('creator', auth.userId);
      formData.append('image', formState.inputs.image.value);
      formData.append('city', formState.inputs.title.value);
      formData.append('type', formState.inputs.title.value);
      formData.append('price',formState.inputs.price.value);
      await sendRequest('http://localhost:5000/api/places', 'POST', formData);
      history.push('/');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <Input
          id="city"
          element="input"
          type="text"
          label="City"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid city."
          onInput={inputHandler}
        />
  
        {/* ✅ Added Dropdown for Rent/Buy */}
        <div className="form-control">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            onChange={(e) =>
              inputHandler("type", e.target.value, true)
            }
            className="input-element"
          >
            <option value="">Select Type</option>
            <option value="rent">Rent</option>
            <option value="buy">Buy</option>
          </select>
        </div>
        <Input
          id="price"
          element="input"
          type="text"
          label="Price"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid city."
          onInput={inputHandler}
        />
  
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
  
};

export default NewPlace;
