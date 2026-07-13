import { AlertTriangle } from "lucide-react";
import Button from "../ui/Button";

const ErrorState = ({ message = "Something went wrong.", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-red-50 rounded-full p-5 mb-4">
        <AlertTriangle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">Oops!</h3>
      <p className="text-gray-500 mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;