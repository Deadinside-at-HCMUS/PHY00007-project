import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Profile from "./Profile";
import Timetable from "./Timetable";
import Attendance from "./Attendance";
import Notice from "../../components/Notice";
import { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("My Profile");
  const router = useLocation();
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (router.state === null) {
      navigate("/");
    }
    setLoad(true);
  }, [navigate, router.state]);
  return (
    <section>
      {load && (
        <>
          <Navbar />
          <ul className="flex justify-evenly items-center gap-10 w-[85%] mx-auto my-8">
            <li
              className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                selectedMenu === "My Profile"
                  ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
                  : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
              }`}
              onClick={() => setSelectedMenu("My Profile")}
            >
              Student Profile
            </li>
            <li
              className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                selectedMenu === "Timetable"
                  ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
                  : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
              }`}
              onClick={() => setSelectedMenu("Timetable")}
            >
              View Timetable
            </li>
            <li
              className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                selectedMenu === "Attendance"
                  ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
                  : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
              }`}
              onClick={() => setSelectedMenu("Attendance")}
            >
              View Attendance
            </li>
            <li
              className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                selectedMenu === "Notice"
                  ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
                  : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
              }`}
              onClick={() => setSelectedMenu("Notice")}
            >
              View Notice
            </li>
          </ul>
          <>
            {selectedMenu === "My Profile" && <Profile />}
            {selectedMenu === "Timetable" && <Timetable />}
            {selectedMenu === "Attendance" && <Attendance />}
            {selectedMenu === "Notice" && <Notice />}
          </>
        </>
      )}
      <Toaster position="bottom-center" />
    </section>
  );
};

export default Home;
