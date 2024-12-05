import { LuX } from "react-icons/lu";
import { useHelper } from "../contexts/HelperContext";

const AlertComponent = () => {
  const { alert, hideAlert } = useHelper();

  const alertColors = {
    error: 'bg-red-100 text-red-600 border-red-500',
    info: 'bg-blue-100 text-blue-600 border-blue-500',
    warning: 'bg-yellow-100 text-yellow-600 border-yellow-500',
    success: 'bg-green-100 text-green-600 border-green-500'
  };

  return (
    <>
      {alert && alert.type && (
        <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 max-w-md w-full p-4 rounded-lg border ${alertColors[alert.type]} z-50`}
        >
          <div className="flex justify-between items-center text-black">
            <span>{ alert.message ? alert.message : alert.type }</span>
            <button
                onClick={hideAlert}
            >
              <LuX className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertComponent;
