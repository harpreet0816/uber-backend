import { useState } from "react";
import { Link } from "react-router-dom";

const UserSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});

  const submitHandler = (e) => {
    e.preventDefault();
    setUserData((prev) => {
      return { ...prev, fullName: {firstName,lastName} , email, password };
    });
    console.log("done", userData);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-16 mb-10"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png"
          alt="no img"
        />
        <form onSubmit={submitHandler}>
          <h3 className="text-lg font-medium mb-2">What&apos;s your name</h3>
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              className="bg-[#eeee] rounded px-4 py-2 border w-1/2  text-lg placeholder:text-base focus:outline-gray-400"
              name="firstname"
              placeholder="First name"
              required
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              className="bg-[#eeee] rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base  focus:outline-gray-400"
              name="lastname"
              placeholder="Last name"
              required
            />
          </div>
          <h3 className="text-lg font-medium mb-2">What&apos;s your email</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-[#eeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base  focus:outline-gray-400"
            name="email"
            placeholder="email@example.com"
            required
          />
          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            type="password"
            autoComplete="false"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="bg-[#eeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base focus:outline-gray-400"
            name="password"
            placeholder="password"
            required
          />
          <button className="bg-[#111] mb-3 text-white font-semibold rounded px-4 py-2 w-full text-bas placeholder:text-sm focus:outline-none">
            Register
          </button>
        </form>
        <p className="text-center">
          Already have a account?{" "}
          <Link to="/login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>
      <div>
      <p className="text-[10px] leading-tight">
        Tha site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
        Policy</span> and <span className='underline'>Term of Service</span> apply.
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
