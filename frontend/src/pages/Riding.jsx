import { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
const Riding = () => {
  const location = useLocation();
  const ride = location.state.rideData;

  const navigate = useNavigate();

  const {socket} = useContext(SocketContext);

  useEffect(() => {
    socket.on("end-ride", () => {
      navigate("/home")
    });
  }, [])
  
  return (
    <div className="h-screen">
        <Link to="/home" className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full">
        <i className="text-lg font-medium ri-home-5-line"></i>
        </Link>
      <div className="h-1/2">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="map"
        />
      </div>
      <div className="h-1/2 p-4">
        <div className="flex items-center justify-between">
          <img
            className="h-12"
            src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
            alt="confirm ride vehicle"
          />
          <div className="text-right">
            <h2 className="text-lg font-medium">{ride?.captain?.fullname?.firstname}</h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">{ride?.captain?.vehicle?.plate}</h4>
            <p className="text-sm text-gray-600">{ride?.captain?.vehicle?.vehicleType}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-col justify-between items-center">
          <div className="w-full mt-5">
            <div className="flex gap-5 p-3 border-b-2 items-center">
              <h2 className="bg-[#eee] h-8 w-12 rounded-full flex items-center justify-center">
                <i className="text-lg ri-map-pin-2-fill"></i>
              </h2>
              <div>
                <h3 className="text-lg font-medium">{ride?.destination.split(" ")[0]}</h3>
                <p className="text-sm -mt-1 text-gray-600"
                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {ride?.destination}
                </p>
              </div>
            </div>
            <div className="flex gap-5 items-center p-3">
              <h2 className="bg-[#eee] h-8 w-12 rounded-full flex items-center justify-center">
                <i className="text-lg ri-currency-line"></i>
              </h2>
              <div>
                <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
                <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
              </div>
            </div>
          </div>
        </div>
        <button className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg">Make a Payment</button>
      </div>
    </div>
  );
};

export default Riding;
