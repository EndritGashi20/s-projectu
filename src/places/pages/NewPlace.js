import React from 'react';

import './NewPlace.css';
import Input from '../../shared/components/FormElements/Input';
import {VALIDATOR_REQUIRE} from '../../shared/utils/validators'

const NewPlace = () => {
  return (
    <form className="place-form">
      <Input element="input" 
      type="text" label="Title" 
      validators={[VALIDATOR_REQUIRE()]} 
      errorText="Plase enter valid title"/>

    </form>
  );
};

export default NewPlace;