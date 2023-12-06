import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Heading from "../../components/Heading";
import { MdOutlineDelete } from "react-icons/md";
import { baseApiURL } from "../../baseUrl";

const Attendance = () => {
  const [data, setData] = useState({
    subject: "",
    studentID: "",
    time: "",
  });
  const [selected, setSelected] = useState("add");
  const [attendance, setAttendance] = useState();
  const [subject, setSubject] = useState();

  useEffect(() => {
    getSubjectData();
  }, []);

  const getSubjectData = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .get(`${baseApiURL()}/subject/getSubject`, { headers })
      .then((response) => {
        if (response.data.success) {
          setSubject(response.data.subject);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  useEffect(() => {
    getAttendanceHandler();
  }, []);


  const getAttendanceHandler = () => {
    axios
      .get(`${baseApiURL()}/attendance/getAttendance`)
      .then((response) => {
        if (response.data.success) {
          setAttendance(response.data.attendance);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const addAttendanceHandler = () => {
    toast.loading("Adding Attendance");
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(`${baseApiURL()}/attendance/addAttendance`, data, {
        headers: headers,
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setData({ subject: "", studentID: "", time: "" });
          getAttendanceHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  const deleteAttendanceHandler = (id) => {
    toast.loading("Deleting Attendance");
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .delete(`${baseApiURL()}/attendance/deleteAttendance/${id}`, {
        headers: headers,
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          getAttendanceHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className="w-[85%] mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Add Attendance" />
        <div className="flex justify-end items-center w-full">
          <button
            className={`${
              selected === "add" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm mr-6`}
            onClick={() => setSelected("add")}
          >
            Add Attendance
          </button>
          <button
            className={`${
              selected === "view" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm`}
            onClick={() => setSelected("view")}
          >
            View Attendance
          </button>
        </div>
      </div>
      {selected === "add" && (
        <div className="flex flex-col justify-center items-center w-full mt-8">
          <div className="w-[40%] mb-4">
          <label htmlFor="" className="leading-7 text-sm">
              Select Subject
            </label>
            <select
              id="subject"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[100%] accent-blue-700"
              value={data.subject}
              onChange={(e) =>
                setData({ ...data, subject: e.target.value })
              }
            >
              <option defaultValue>-- Select Subject --</option>
              {subject &&
                subject.map((subject) => {
                  return (
                    <option value={subject.name} key={subject.name}>
                      {subject.name}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="studentID" className="leading-7 text-sm">
              Enter Student ID
            </label>
            <input
              type="number"
              id="studentID"
              value={data.studentID}
              onChange={(e) => setData({ ...data, studentID: e.target.value })}
              className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="w-[40%]">
            <label htmlFor="time" className="leading-7 text-sm ">
              Enter Attendance Time
            </label>
            <input
              type="datetime-local"
              id="time"
              value={data.time}
              onChange={(e) => setData({ ...data, time: e.target.value })}
              className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <button
            className="mt-6 bg-blue-500 px-6 py-3 text-white"
            onClick={addAttendanceHandler}
          >
            Add Attendance
          </button>
        </div>
      )}
      {selected === "view" && (
        <div className="mt-8 w-full">
          {attendance && attendance.length > 0 ? (
            <ul>
              {attendance.map((item) => (
                <li 
                  key={item.id}
                  className="bg-blue-100 py-3 px-6 mb-3 flex justify-between items-center w-[70%]">
                  <div>
                    Subject: {item.subject}, Student ID: {item.studentID}, Time: {item.time}
                  </div>
                  <button
                      className="text-2xl hover:text-red-500"
                      onClick={() => deleteAttendanceHandler(item._id)}
                    >
                      <MdOutlineDelete />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No attendance records available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;
