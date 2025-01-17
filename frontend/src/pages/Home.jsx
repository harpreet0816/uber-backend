import { Link } from "react-router-dom"
import { userDataContext } from "../context/UserContext";
import { useContext } from "react";

const Home = () => {
    const {user} = useContext(userDataContext);
    
  return (
    <Link to="/">Home <br /> {user.email}</Link>
  )
}

export default Home