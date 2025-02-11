import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";

const UserProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const {user, setUser} = useContext(userDataContext)
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          setUser(data.user);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err.message);
        navigate("/login");
      });
  }, [token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <> {children} </>;
};

export default UserProtectedWrapper;
