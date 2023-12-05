import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
// import { RxDashboard } from "react-icons/rx";
import Logo from "./assets/logo.png";

const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();
  return (
    <div className="shadow-md px-6 py-4 flex justify-between items-center">
      <p
        className="font-semibold text-2xl flex justify-center items-center"
      >
        <img className="w-[10%] mr-4" alt="hcmus-logo" src={Logo} />
        {router.state && router.state.type} Dashboard
      </p>
      <button
        className="flex justify-center items-center text-red-500 px-3 py-2 font-semibold rounded-sm hover:text-red-400"
        onClick={() => navigate("/")}
      >
        Logout
        <span className="ml-2">
          <FiLogOut />
        </span>
      </button>
    </div>
  );
};

export default Navbar;
