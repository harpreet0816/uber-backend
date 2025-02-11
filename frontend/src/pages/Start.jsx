import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div>
      <div className="bg-cover bg-left bg-[url(https://images.unsplash.com/photo-1670361747602-0272a863e3c2?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-8 w-full flex justify-between flex-col">
      <div className="inline-block bg-gradient-to-r from-transparent from-30%
      via-[#e7e5e56b] via-70% to-[#b5b2b217] to-100% p-2 rounded-lg max-w-fit">
        <img className="w-16 ml-8" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png" alt="no img" />
        </div>
            <div className="bg-white pb-7 py-5 px-4">
                <h2 className="text-2xl font-bold">Get Started with Uber</h2>
                <Link  to="/login" className="flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5">Continue</Link>
            </div>
      </div>
    </div>
  );
};

export default Start;
