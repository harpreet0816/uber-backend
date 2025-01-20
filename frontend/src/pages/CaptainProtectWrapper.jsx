import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { captainDataContext } from "../context/CaptainContext";
import axios from "axios";

const CaptainProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const { captain, setCaptain } = useContext(captainDataContext);
  const [ isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/captain-login");
    }

    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response) => {
      if(response.status === 200){
  
        const data = response.data;
        setCaptain(data.captain);
        setIsLoading(false);
        
      }
    }).catch(err => {
      console.log(err.message);
      navigate("/captain-login");
    });
    
  }, [ token ]);

  

  if(isLoading){
    return (
      <div>Loading...</div>
    )
  }

  return <div>{children}</div>;
};

export default CaptainProtectWrapper;
