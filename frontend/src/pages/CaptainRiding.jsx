import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FinishRide from "./components/FinishRide";
import axios from "axios";

let timeoutId;
function debounce(cb, delay) {
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

const CaptainRiding = () => {

  const [finishRidePanel, setFinishRidePanel] = useState(false);

  const finishRidePanelRef = useRef(null);

  const navigate = useNavigate();

  const location = useLocation()
  const ride = location.state?.rideData;

  const debouncedWrapper = debounce((func)=>func() , 300);

  const endRideHandler = () => {
    debouncedWrapper(async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
          {
            rideId: ride._id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if(response.status === 200){
          navigate("/captain-home")
        }
      } catch (error) {
        console.error(error.message);
      }
    })
  }

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [finishRidePanel]
  );

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
            setFinishRidePanel(true);
          }}
          className="p-1 text-center w-[95%] absolute top-0"
        >
          <i className=" text-3xl text-black ri-arrow-up-wide-line"></i>
        </h5>
        <h4 className="flex-1 text-lg font-semibold overflow-ellipsis mr-3">₹ {ride.fare}</h4>
        <button onClick={() => {
          setFinishRidePanel(true);
        }} className=" bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
          Complete Ride
        </button>
      </div>
      <div
        ref={finishRidePanelRef}
        className="fixed z-10 w-full bottom-0 bg-white px-3 py-6 pt-12 translate-y-full"
      >
        <FinishRide setFinishRidePanel={setFinishRidePanel} ride={ride} endRideHandler={endRideHandler}/>
      </div>
    </div>
  );
};

export default CaptainRiding;
