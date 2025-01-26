import { Link } from "react-router-dom";
import CaptainDetails from "./components/CaptainDetails";
import RidePopup from "./components/RidePopup";
import { useContext, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRideCaptainPopup from "./components/ConfirmRideCaptainPopup";
import { captainDataContext } from "../context/CaptainContext";
import { SocketContext } from "../context/SocketContext";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false)
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [ ride, setRide ] = useState(null)

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
          socket.emit("update-location-captain", {
            location : {
              ltd: position.coords.latitude,
              lng: position.coords.latitude
            }
          })
        })
      }
    }

    const locationInterval = setInterval(updateLocation, 10000)
    updateLocation()

    return () => clearInterval(locationInterval)
  }, []);

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
           <RidePopup  setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel}/>
      </div>
      <div ref={confirmRidePopupPanelRef} className="fixed z-10 h-screen w-full bottom-0 bg-white px-3 py-6 pt-12 translate-y-full">
           <ConfirmRideCaptainPopup  
           setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel}/>
      </div>
    </div>
  );
};

export default CaptainHome;
