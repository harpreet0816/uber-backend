import { Link } from "react-router-dom";

const UserLogin = () => {
  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
      <img
        className="w-16 mb-10"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png"
        alt="no img"
      />
      <form action="">
        <h3 className="text-lg font-medium mb-2">What&apos;s your email?</h3>
        <input
          type="email"
          className="bg-[#eeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base focus:outline-gray-400"
          name="email"
          placeholder="email@example.com"
          required
        />
        <h3 className="text-lg font-medium mb-2">Enter Password</h3>
        <input
          type="password"
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
      <button className="bg-[#10b461] mb-7 text-white font-semibold rounded px-4 py-2 w-full text-lg placeholder:text-base focus:outline-none">
          Sign in as Captain
        </button>
      </div>
    </div>
  );
};

export default UserLogin;
