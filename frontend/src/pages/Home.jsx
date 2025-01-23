import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "./components/LocationSearchPanel";
import VehiclePanel from "./components/VehiclePanel";
import ConfirmRide from "./components/ConfirmRide";
import WaitingForDriver from "./components/WaitingForDriver";
import LookingForDriver from "./components/LookingForDriver";

let timeoutId;
function debounce(cb, delay) {
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [pickupLatLon, setPickupLatLon] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationpLatLon, setDestinationpLatLon] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [confirmRidePanelOpen, setConfirmRidePanelOpen] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({car:"0",moto: "0", auto: "0"});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  const vehiclePanelRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  const debouncedFetchSuggestions = debounce(async (query) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: query },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      activeField === "pickup" ? setPickupSuggestions(response.data) : setDestinationSuggestions(response.data)
    } catch (error) {
      console.error(error.message);
    }
  }, 300);

  const handlePickupChange = async (e) => {
    const inputValue = e.target.value;
    setPickup(inputValue);
    try {
      if (inputValue.trim() === "") {
        setPickupSuggestions([]); // Clear suggestions when input is empty
        return;
      }
      debouncedFetchSuggestions(inputValue);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDestinationChange = (e) => {
    const inputValue = e.target.value.trim();
    setDestination(e.target.value);
    try {
      if (inputValue === "") {
        setDestinationSuggestions([]); // Clear suggestions when input is empty
        return;
      }
      debouncedFetchSuggestions(inputValue);
    } catch (error) {
      console.error(error.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if(pickup.trim() && destination.trim()){
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
          { 
              pickup: pickupLatLon, 
              destination: destinationpLatLon 
          },
          { 
              headers: { 
                  Authorization: `Bearer ${localStorage.getItem("token")}` 
              } 
          }
        );
        console.log(response, "Fsf")
        if(response.status === 200){
          setPanelOpen(false);
          setVehiclePanelOpen(true);
          setFare(response.data);
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    console.log(pickupLatLon, "--", destinationpLatLon)
  }, [pickupLatLon, destinationpLatLon])
  
  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "70%",
          padding: 24,
          // opacity: 1,
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "0",
          padding: 0,
          // opacity: 0
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
        });
      }
    },
    [panelOpen]
  );

  useGSAP(
    function () {
      if (vehiclePanelOpen) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanelOpen]
  );

  useGSAP(
    function () {
      if (confirmRidePanelOpen) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePanelOpen]
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound]
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver]
  );

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png"
        alt="Logo"
      />

      <div className="h-screen w-screen">
        <img
          className="h-full w-auto object-fill"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="map"
        />
      </div>
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[30%] p-6 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setPanelOpen(false);
            }}
            className="absolute top-6 right-6 opacity-0 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form onSubmit={submitHandler}>
            <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-700 rounded-full"></div>
            <input
              className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-5"
              type="text"
              value={pickup}
              onChange={handlePickupChange}
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              placeholder="Add a pick-up location"
            />
            <input
              className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-3"
              type="text"
              value={destination}
              onChange={handleDestinationChange}
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              placeholder="Enter your destination"
            />
            <button className={`bg-[#111] mt-3 text-white font-semibold rounded px-2 py-1 w-full text-lg placeholder:text-base focus:outline-none ${pickup && destination ? 'opacity-[1]' : 'opacity-[0.5]'}`}>Find a trip</button>
          </form>
        </div>
        <div ref={panelRef} className="h-0 bg-white">
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPanelOpen={setPanelOpen}
            setVehiclePanelOpen={setVehiclePanelOpen}
            setPickup={setPickup}
            setDestination={setDestination}
            setPickupLatLon={setPickupLatLon}
            setDestinationpLatLon={setDestinationpLatLon}
            activeField={activeField}
          />
        </div>
      </div>
      <div
        ref={vehiclePanelRef}
        className="fixed z-10 w-full bottom-0 bg-white px-3 py-6 pt-12 translate-y-full"
      >
        <VehiclePanel
          setConfirmRidePanelOpen={setConfirmRidePanelOpen}
          setVehiclePanelOpen={setVehiclePanelOpen}
          fare={fare}
        />
      </div>
      <div
        ref={confirmRidePanelRef}
        className="fixed z-10 w-full bottom-0 bg-white px-3 py-6 pt-12 translate-y-full"
      >
        <ConfirmRide
          setConfirmRidePanelOpen={setConfirmRidePanelOpen}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div
        ref={vehicleFoundRef}
        className="fixed z-10 w-full bottom-0 bg-white px-3 py-6 pt-12 translate-y-full"
      >
        <LookingForDriver setVehicleFound={setVehicleFound} />
      </div>
      <div
        ref={waitingForDriverRef}
        className="fixed z-10 w-full bottom-0 bg-white px-3 py-6 pt-12 translate-y-full"
      >
        <WaitingForDriver setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  );
};

export default Home;
