import React from "react";

const Kards =  props => {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="w-80 rounded-lg bg-white shadow-lg scale-110">
        <div className="relative">
          <img
            className="rounded-lg w-full h-52 object-cover"
            src={`http://localhost:5000/${props.image}`}
            alt={props.title}
          />
          <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition"></div>
        </div>
        <div className="p-4">
          <div className="flex justify-between text-sm font-bold text-gray-800">
            <span>{props.title}</span>
            <span className="flex items-center">
              
              <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                
              </svg>
            </span>
          </div>
          <p className="text-sm text-gray-600 my-2"><span className="text-sm font-bold text-gray-800">ADDRESS: </span> {props.address}</p>
          <p className="text-sm text-gray-600 my-2"><span className="text-sm font-bold text-gray-800">CITY </span> {props.city}</p>
          <h5 className="text-sm font-bold text-gray-800">Price $</h5>
        </div>
      </div>
    </div>
  );
};

export default Kards;
