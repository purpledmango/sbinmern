import { LoaderCircle, LoaderCircleIcon } from "lucide-react";
import React from "react";
import { ImSpinner9 } from "react-icons/im";

const Spinner = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <LoaderCircleIcon className="animate-spin h-auto w-auto text-orange-500" />
    </div>
  );
};

export default Spinner;