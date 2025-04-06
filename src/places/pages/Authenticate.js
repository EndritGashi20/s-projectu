import React from "react";

import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_EMAIL,VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
const Authenticate = () => {

const [formState, inputHandler] = useForm(
{
    email:{
        value:'',
        isValid:false
    },
    password:{
        value:'',
        isValid:false
    },
    
},
false
);


const authSubmitHandler = event =>{
    event.preventDefault();
  //console.log(formState.inputs);
}


    return(
    <form className="place-form" onSubmit={authSubmitHandler}>
        <Input
        id="email"
        element="input"
        type="text"
        label="email"
        validators={[VALIDATOR_EMAIL()]}
        errorText="Please enter a valid email."
        onInput={inputHandler}
      />
      <Input
        id="password"
        element="input"
        type="text"
        label="Password"
        validators={[VALIDATOR_MINLENGTH(8)]}
        errorText="Please enter a valid password."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        Log in
      </Button>
    </form>
    );
};

export default Authenticate;