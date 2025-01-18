import { userDataContext } from "../context/UserContext";
import { useContext, useState } from "react";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false)

  const { user } = useContext(userDataContext);

  const submitHandler = (e) => {
    e.preventDefault();
  }
  return (
    <div className="h-screen relative">
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
        <div className="h-[30%] p-5 bg-white relative">
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form onSubmit={submitHandler}>
          <div className="line absolute h-16 w-1 top-[45%] left-10 bg-gray-700 rounded-full"></div>
            <input
              className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-5"
              type="text"
              value={pickup}
              onChange={(e) =>{ setPickup(e.target.value);  setPanelOpen(true);}}
              placeholder="Add a pick-up location"
            />
            <input
              className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-3"
              type="text"
              value={destination}
              onChange={(e) => {setDestination(e.target.value); setPanelOpen(true)}}
              placeholder="Enter your destination"
            />
          </form>
        </div>
        <div className="h-0 bg-red-400">
        </div>
      </div>
    </div>
  );
};

export default Home;
