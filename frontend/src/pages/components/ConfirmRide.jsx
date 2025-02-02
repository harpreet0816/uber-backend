import "remixicon/fonts/remixicon.css";
import { images } from "../../assets/images";

const ConfirmRide = ({
  setConfirmRidePanelOpen,
  setVehicleFound,
  pickup,
  destination,
  fare,
  vehicleType,
  createRideHandler,
}) => {
  return (
    <div>
      <h5
        onClick={() => {
          setConfirmRidePanelOpen(false);
        }}
        className="p-1 text-center w-[93%] absolute top-0"
      >
        <i className=" text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Confirm your Ride</h3>
      <div className="flex gap-2 flex-col justify-between items-center">
        <img
          className="h-20"
          src={
            vehicleType
              ? images[vehicleType] : "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" 
          }
          alt="confirm ride vehicle"
        />
        <div className="w-full">
          <div className="flex gap-5 p-3 border-b-2 items-center">
            <h2 className="bg-[#eee] h-8 w-12 rounded-full flex items-center justify-center">
              <i className="text-lg ri-map-pin-fill"></i>
            </h2>
            <div>
              <h3 className="text-lg font-medium">
                {pickup ? pickup.split(" ")[0] : "562/11-A"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600 max-h-[20px] overflow-hidden text-ellipsis whitespace-pre-line w-[260px]">
                {pickup ? pickup : ""}
              </p>
            </div>
          </div>
          <div className="flex gap-5 p-3 border-b-2 items-center">
            <h2 className="bg-[#eee] h-8 w-12 rounded-full flex items-center justify-center">
              <i className="text-lg ri-map-pin-2-fill"></i>
            </h2>
            <div>
              <h3 className="text-lg font-medium">
                {destination ? destination.split(" ")[0] : "562/11-A"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600 max-h-[20px] overflow-hidden text-ellipsis whitespace-pre-line w-[260px]">
                {destination ? destination : ""}
              </p>
            </div>
          </div>
          <div className="flex gap-5 items-center p-3">
            <h2 className="bg-[#eee] h-8 w-12 rounded-full flex items-center justify-center">
              <i className="text-lg ri-currency-line"></i>
            </h2>
            <div>
              <h3 className="text-lg font-medium">
                ₹{Object.keys(fare).length > 0 ? fare[vehicleType] : ""}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setConfirmRidePanelOpen(false);
            setVehicleFound(true);
            createRideHandler();
          }}
          className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;
