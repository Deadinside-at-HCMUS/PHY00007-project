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
    week: "",
  });
  const [selected, setSelected] = useState("add");
  const [attendance, setAttendance] = useState();
  const [subject, setSubject] = useState();

  const [filterStudentID, setFilterStudentID] = useState("");
  const [filterSubject, setFilterSubject] = useState(null);
  const [sortBy, setSortBy] = useState(null);  

  const [newStudentID, setNewStudentID] = useState("");

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
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .get(`${baseApiURL()}/attendance/getAttendance`, { headers })
      .then((response) => {
        if (response.data.success) {
          console.log(response.data);
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
          setData({ subject: "", studentID: "", time: "", week: "" });
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

  const formatDate = (timestamp) => {
    const dateTime = new Date(timestamp);
    return dateTime.toDateString(); // Adjust format as needed
  };

  const formatTime = (timestamp) => {
    const dateTime = new Date(timestamp);
    return dateTime.toLocaleTimeString(); // Adjust format as needed
  };

  const filteredAndSortedAttendance = () => {
    let filteredAttendance = attendance;
  
    // Apply subject filter
    if (filterSubject) {
      filteredAttendance = filteredAttendance.filter(
        (item) => item.subject === filterSubject
      );
    }
  
    // Apply sorting
    if (sortBy === 'asc') {
      filteredAttendance.sort((a, b) => new Date(a.time) - new Date(b.time));
    } else if (sortBy === 'desc') {
      filteredAttendance.sort((a, b) => new Date(b.time) - new Date(a.time));
    }
  
    // Apply student ID filter
    if (filterStudentID) {
      filteredAttendance = filteredAttendance.filter(
        (item) => item.studentID.toString() === filterStudentID
      );
    }

    return filteredAttendance;
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
          <div className="w-[40%] mb-4">
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
          <div className="w-[40%]">
            <label htmlFor="week" className="leading-7 text-sm">
              Enter Course Week
            </label>
            <input
              type="number"
              id="week"
              value={data.week}
              onChange={(e) => setData({ ...data, week: e.target.value })}
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
          <div className="flex items-center mb-6">

            <label className="ml-5 mr-2">Find by Student ID:</label>
            <input
              type="number"
              value={filterStudentID}
              onChange={(e) => setFilterStudentID(e.target.value)}
              className="rounded border bg-blue-50 focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
            <div className="ml-5">
                <label className="mr-2">Filter by Subject:</label>
                <select
                  className="py-2 px-2 bg-blue-50 rounded text-base accent-blue-700 mr-5"
                  value={filterSubject || ''}
                  onChange={(e) => setFilterSubject(e.target.value || null)}
                >
                  <option value="">All Subjects</option>
                  {subject &&
                    subject.map((subj) => (
                      <option key={subj.name} value={subj.name}>
                        {subj.name}
                      </option>
                    ))}
                </select>

                <label className="mr-2 ml-2">Sort by Time:</label>
                <select
                  className="py-2 px-3 bg-blue-50 rounded text-base accent-blue-700"
                  value={sortBy || ''}
                  onChange={(e) => setSortBy(e.target.value || null)}
                >
                  <option value="">Default</option>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
            </div>
          </div>

          {attendance && attendance.length > 0 ? (
            <ul>
              {filteredAndSortedAttendance().map((item) => (
                <li 
                  key={item.id}
                  className="bg-blue-100 py-3 px-6 mb-3 flex justify-between items-center w-[60%]">
                  <div>
                    <p>
                      <strong>Subject:</strong> {item.subject} &emsp; 
                      <strong>Student ID:</strong> {item.studentID}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(item.time)} &emsp; 
                      <strong>Time:</strong> {formatTime(item.time)} &emsp; 
                      <strong>Week:</strong> {item.week}
                    </p>
                  </div>
                  
                  <button
                    className="text-red-500 text-2xl hover:text-red-300"
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
