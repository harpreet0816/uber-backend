const RidePopup = ({ setRidePopupPanel, setConfirmRidePopupPanel, ride, 
  setRide, acceptRide }) => {

  if(!ride) {return (<div>loading...</div>)}
  return (
    <div>
      <h5
        onClick={() => {
          setRide(null)
          setRidePopupPanel(false);
        }}
        className="p-1 text-center w-[93%] absolute top-0"
      >
        <i className=" text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">New Ride Avaible!</h3>
      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3 ">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0_hQThmfgUmHe2SM5q3kDe622hRHOBYPZlQ&s"
            alt="passenger poto"
          />
          <h2 className="text-lg font-medium">{ride.user.fullname.firstname + " " + ride.user.fullname.lastname}</h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 KM</h5>
      </div>
      <div className="flex gap-2 flex-col justify-between items-center">
        <div className="w-full">
          <div className="flex gap-5 p-3 border-b-2 items-center">
            <h2 className="bg-[#eee] h-8 w-12 rounded-full flex items-center justify-center">
              <i className="text-lg ri-map-pin-fill"></i>
            </h2>
            <div>
              <h3 className="text-lg font-medium">{ride.pickup.split(",")[0]}</h3>
              <p className="text-sm -mt-1 text-gray-600">
              {ride.pickup}
              </p>
            </div>
          </div>
          <div className="flex gap-5 p-3 border-b-2 items-center">
            <h2 className="bg-[#eee] h-8 w-12 rounded-full flex items-center justify-center">
              <i className="text-lg ri-map-pin-2-fill"></i>
            </h2>
            <div>
              <h3 className="text-lg font-medium">{ride?.destination.split(",")[0]}</h3>
              <p className="text-sm -mt-1 text-gray-600">
              {ride?.destination}
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
        <div className="w-full mt-5 px-4 flex flex-col items-center justify-between gap-3">
          <button
            onClick={() => {
              setRidePopupPanel(false);
            }}
            className="w-full bg-gray-300 text-gray-700 font-semibold p-3 px-10 rounded-lg"
          >
            Ignore
          </button>
          <button
            onClick={() => {
              setRidePopupPanel(false);
              acceptRide()
            }}
            className="w-full bg-green-600 text-white font-semibold p-3 px-10 rounded-lg"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopup;
