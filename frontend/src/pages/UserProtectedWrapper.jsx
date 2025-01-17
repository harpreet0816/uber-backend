
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProtectedWrapper = ({children}) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  useEffect(() => {
    if(!token) {
        navigate('/login');
    }
  }, [])
  
  return (
    <> {children} </>
)
}

export default UserProtectedWrapper;