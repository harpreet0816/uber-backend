import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../context/UserContext";

const UserLogin = () => {  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});
  
  const { setUser } = useContext(userDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
      e.preventDefault();
      setUserData((prev) => {
        return { ...prev, email , password }; 
      })
      const userData = {
        email, 
        password,
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData);

      if(response.status === 200){
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token',data.token);
        navigate("/home")
      }
      setEmail("");
      setPassword("")
  }

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
      <img
        className="w-16 mb-10"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png"
        alt="no img"
      />
      <form onSubmit={submitHandler}>
        <h3 className="text-lg font-medium mb-2">What&apos;s your email?</h3>
        <input
          type="email"
          value={email}
          onChange={(e)=>{
            setEmail(e.target.value)
          }}
          className="bg-[#eeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base focus:outline-gray-400"
          name="email"
          placeholder="email@example.com"
          required
        />
        <h3 className="text-lg font-medium mb-2">Enter Password</h3>
        <input
          type="password"
          autoComplete="false"
          value={password}
          onChange={(e)=>{
            setPassword(e.target.value);
          }}  
          className="bg-[#eeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base focus:outline-gray-400"
          name="password"
          placeholder="password"
          required
        />
        <button className="bg-[#111] mb-3 text-white font-semibold rounded px-4 py-2 w-full text-lg placeholder:text-base focus:outline-none">
          Login
        </button>
      </form>
        <p className="text-center">New here? <Link to="/signup" className="text-blue-600">Create new Account</Link></p>
      </div>
      <div>
      <Link to="/captain-login" className="bg-[#10b461] flex items-center justify-center mb-7 text-white font-semibold rounded px-4 py-2 w-full text-lg placeholder:text-base focus:outline-none">
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
