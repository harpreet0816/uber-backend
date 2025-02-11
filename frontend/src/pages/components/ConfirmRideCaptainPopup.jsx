import { useState } from "react";
import { Link } from "react-router-dom";

const ConfirmRideCaptainPopup = ({
  setRidePopupPanel,
  setConfirmRidePopupPanel,
  ride, 
  setRide,
  startRide
}) => {

  const [otp, setOtp] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if(!otp || !parseInt(Math.abs(otp)) || otp.length != 6 ){
      console.error(otp, "otp must be of 6 digits")
      return;
    }
    startRide(otp)
  }
  if(!ride) {return (<div>loading...</div>)}
  return (
    <div>
      <h5
        onClick={() => {
          setRide(null);
          setRidePopupPanel(true);
          setConfirmRidePopupPanel(false);
        }}
        className="p-1 text-center w-[93%] absolute top-0"
      >
        <i className=" text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">
        Confirm this ride to Start!
      </h3>
      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3 ">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0_hQThmfgUmHe2SM5q3kDe622hRHOBYPZlQ&s"
            alt="passenger poto"
          />
          <h2 className="text-lg font-medium">{ride.user.fullname.firstname + " " + ride.user.fullname.lastname}</h2>
        </div>
        <h5 className="text-lg font-semibold">{ride?.distance && parseInt(ride.distance)} KM</h5>
      </div>
      <div className="flex gap-2 flex-col justify-between items-center">
        <div className="w-full">
          <div className="flex gap-5 p-3 border-b-2 items-center">
            <h2 className="bg-[#eee] h-8 w-12 rounded-full flex items-center justify-center">
              <i className="text-lg ri-map-pin-fill"></i>
            </h2>
            <div>
              <h3 className="text-lg font-medium">{ride.pickup.split(",")[0]}</h3>
              <p className="text-sm -mt-1 text-gray-600"
              style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {ride.pickup}
              </p>
            </div>
          </div>
          <div className="flex gap-5 p-3 border-b-2 items-center">
            <h2 className="bg-[#eee] h-8 w-12 rounded-full flex items-center justify-center">
              <i className="text-lg ri-map-pin-2-fill"></i>
            </h2>
            <div>
              <h3 className="text-lg font-medium">{ride.destination.split(",")[0]}</h3>
              <p className="text-sm -mt-1 text-gray-600"
              style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {ride.destination}
              </p>
            </div>
          </div>
          <div className="flex gap-5 items-center p-3">
            <h2 className="bg-[#eee] h-8 w-12 rounded-full flex items-center justify-center">
              <i className="text-lg ri-currency-line"></i>
            </h2>
            <div>
              <h3 className="text-lg font-medium">₹{ride.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>
        <div className="mt-6 w-full">
          <form onSubmit={submitHandler}>
            <input
              type="text"
              name="otp"
              placeholder="Enter Otp"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
              }}
              className="bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full"
            />
            <Link
              onClick={submitHandler}
              className="flex justify-center w-full mt-5 bg-green-600 text-white text-lg font-semibold p-3 rounded-lg"
            >
              Confirm
            </Link>
            <button
              onClick={() => {
                setConfirmRidePopupPanel(false);
                setRidePopupPanel(false);
                setRide(null)
              }}
              className="w-full mt-2 bg-red-500 text-white  font-semibold p-3 rounded-lg"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRideCaptainPopup;
