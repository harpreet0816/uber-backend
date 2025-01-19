const LocationSearchPanel = ({setVehiclePanelOpen, setPanelOpen}) => {
  // sample array for location
  const locations = [
    "24B, Near Kapoor;s cafe, Sheryains codding school, Bhopal",
    "22A, Near Malholtra;s cafe, Sheryains codding school, Bhopal",
    "25Q, Near singhania;s cafe, Sheryains codding school, Bhopal",
    "26Z, Near sharma;s cafe, Sheryains codding school, Bhopal",
    "29D, Near drinky;s cafe, Sheryains codding school, Bhopal",
  ];
  return (
    <div>
      {/* this is just sample data */}

      {locations.map((location, index) => {
        return (
          <div key={index} onClick={()=> {setVehiclePanelOpen(true); setPanelOpen(false)}} className="flex gap-4 border-2 p-2 rounded-xl border-gray-100 active:border-black items-center my-2 justify-start">
            <h2 className="bg-[#eee] h-8 w-12 rounded-full flex items-center justify-center">
              <i className="ri-map-pin-fill"></i>
            </h2>
            <h4 className="font-medium">{location}</h4>
          </div>
        );
      })}
    </div>
  );
};

export default LocationSearchPanel;
