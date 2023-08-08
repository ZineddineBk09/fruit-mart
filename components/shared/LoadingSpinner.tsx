import { CircularProgress } from "@mui/material";

const LoadingSpinner = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <CircularProgress
        className="text-green-500 w-full mx-auto "
        color="inherit"
      />
    </div>
  );
};

export default LoadingSpinner;
