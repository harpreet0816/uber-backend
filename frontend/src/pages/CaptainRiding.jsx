import { Link } from "react-router-dom"

const CaptainRiding = () => {
  return (
    <div className="h-screen">
    <div className="fixed p-6 top-0 flex items-center justify-between w-screen ">
      <img
        className="w-16"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png"
        alt="Logo"
      />
      <Link
        to="/captain-home"
        className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-logout-box-r-line"></i>
      </Link>
    </div>
    <div className="h-4/5">
      <img
        className="h-full w-full object-cover"
        src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
        alt="map"
      />
    </div>
    <div className="h-1/5 p-6 flex items-center justify-between bg-yellow-400 relative">
    <h5
        onClick={() => {
        }}
        className="p-1 text-center w-[95%] absolute top-0"
      >
        <i className=" text-3xl text-black ri-arrow-up-wide-line"></i>
      </h5>
    <h4 className="text-lg font-semibold">4 KM away</h4>
    <button className=" bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">Complete Ride</button>
    </div>
  </div>
  )
}

export default CaptainRiding