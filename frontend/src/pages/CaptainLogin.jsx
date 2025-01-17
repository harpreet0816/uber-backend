import { useState } from 'react'
import { Link } from 'react-router-dom';

const CaptainLogin = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [captainData, setCaptainData] = useState({});
  
  const submitHandler = (e) => {
      e.preventDefault();
      setCaptainData((prev) => {
        return { ...prev, email , password }; 
      })
      console.log("done", captainData);
      setEmail("");
      setPassword("")
  }
  
  return (
    <div className="p-7 pt-2  h-screen flex flex-col justify-between">
      <div>
      <img
          className="w-20 mb-1"
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
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
        <p className="text-center">Join a fleet? <Link to="/captain-signup" className="text-blue-600">Register as a Captain</Link></p>
      </div>
      <div>
      <Link to="/login" className="bg-[#d5622d] flex items-center justify-center mb-7 text-white font-semibold rounded px-4 py-2 w-full text-lg placeholder:text-base focus:outline-none">
          Sign in as User
        </Link>
      </div>
    </div>
  )
}

export default CaptainLogin