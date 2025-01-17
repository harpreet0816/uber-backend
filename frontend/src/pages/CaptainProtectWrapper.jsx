import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CaptainProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/captain-login");
    }
  }, []);
  return <div>{children}</div>;
};

export default CaptainProtectWrapper;
