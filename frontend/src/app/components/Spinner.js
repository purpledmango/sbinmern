import React from "react";
import { ImSpinner9 } from "react-icons/im";

const Spinner = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <ImSpinner9 className="animate-spin h-12 w-12 text-green-500" />
    </div>
  );
};

export default Spinner;