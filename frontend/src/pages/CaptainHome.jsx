import { Link, useNavigate } from "react-router-dom";
import CaptainDetails from "./components/CaptainDetails";
import RidePopup from "./components/RidePopup";
import { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRideCaptainPopup from "./components/ConfirmRideCaptainPopup";
import { captainDataContext } from "../context/CaptainContext";
import { SocketContext } from "../context/SocketContext";
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

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false)
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [ ride, setRide ] = useState(null)

  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(captainDataContext);

  useEffect(() => {
    socket.emit('join', {
      userId: captain._id,
      userType: 'captain'
    })

    const updateLocation = () => {
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
          console.log(position, "---")
          socket.emit("update-location-captain", {
            userId: captain._id,
            location : {
              ltd: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
        })
      }
    }

    const locationInterval = setInterval(updateLocation, 10000)
    updateLocation()

    socket.on("new-ride", (data) => {
      setRide(data);
      setRidePopupPanel(true);
    })
    return () => clearInterval(locationInterval)
  }, []);

  const debouncedWrapper = debounce((func)=>func() , 300);

  const acceptRide = () => {
      debouncedWrapper(async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/rides/accept-ride`,
            {
              rideId: ride._id,
              captainId: captain._id,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if(response.status === 200){
            setRidePopupPanel(false)
            setConfirmRidePopupPanel(true)
          }
        } catch (error) {
          console.error(error.message);
        }
      })
  }

  const startRide = (otp) => {
      debouncedWrapper(async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
            {
              rideId: ride._id,
              otp: otp,
              captainId: captain._id,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if(response.status === 200){
            // console.log(response.data, "start ride ");
            setRide(response.data);
            setConfirmRidePopupPanel(false);
            navigate("/captain-riding", {state: {rideData: ride}})
          }
        } catch (error) {
          console.error(error.message);
        }
      })
  }

  useGSAP(
    function () {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
          transform: 'translateY(0)'
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          transform: 'translateY(100%)'
        });
      }
    },
    [ridePopupPanel]
  );

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: 'translateY(0)'
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: 'translateY(100%)'
        });
      }
    },
    [confirmRidePopupPanel]
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
          to="/home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="map"
        />
      </div>
      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>
      <div ref={ridePopupPanelRef} className="fixed z-10 w-full bottom-0 bg-white px-3 py-6 pt-12 translate-y-full">
           <RidePopup  setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} ride={ride} setRide={setRide} acceptRide={acceptRide}/>
      </div>
      <div ref={confirmRidePopupPanelRef} className="fixed z-10 h-screen w-full bottom-0 bg-white px-3 py-6 pt-12 translate-y-full">
           <ConfirmRideCaptainPopup  
           setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} ride={ride} setRide={setRide} startRide={startRide}/>
      </div>
    </div>
  );
};

export default CaptainHome;
