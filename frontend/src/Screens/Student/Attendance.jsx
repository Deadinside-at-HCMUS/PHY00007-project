import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Heading from "../../components/Heading";
import { toast } from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [subject, setSubject] = useState();
  const [filterSubject, setFilterSubject] = useState(null);
  const [filterWeek, setFilterWeek] = useState(null);
  const [sortBy, setSortBy] = useState(null);  
  const router = useLocation();

  useEffect(() => {
    getAllAttendanceHandler();
  }, []);

  const getAllAttendanceHandler = () => {
    const headers = {
      "Content-Type": "application/json",
    };

    axios
      .get(`${baseApiURL()}/attendance/getAttendance/student/${router.state.loginid}`, { headers })
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

  const formatDate = (timestamp) => {
    const dateTime = new Date(timestamp);
    return dateTime.toDateString(); 
  };

  const formatTime = (timestamp) => {
    const dateTime = new Date(timestamp);
    return dateTime.toLocaleTimeString(); 
  };

  const filteredAndSortedAttendance = () => {
    let filteredAttendance = attendance;
  
    if (filterSubject) {
      filteredAttendance = filteredAttendance.filter(
        (item) => item.subject === filterSubject
      );
    }
  
    if (sortBy === 'asc') {
      filteredAttendance.sort((a, b) => new Date(a.time) - new Date(b.time));
    } else if (sortBy === 'desc') {
      filteredAttendance.sort((a, b) => new Date(b.time) - new Date(a.time));
    }

    if (filterWeek) {
      filteredAttendance = filteredAttendance.filter(
        (item) => item.week.toString() === filterWeek
      );
    }
  
    return filteredAttendance;
  };  

  return (
    <div className="w-[85%] mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Attendance of Student" />
      </div>

      <div className="mt-8 w-full">
          <div className="flex items-center mb-8 ml-2">
            <label className="mr-5">Filter by Subject:</label>
              <select
                className="py-2 rounded border bg-blue-50 focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
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
            <div className="ml-5 mr-2">
              <label className="ml-5 mr-5">Filter by Week:</label>
              <select
                className="py-2 rounded border bg-blue-50 focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                value={filterWeek || ''}
                onChange={(e) => setFilterWeek(e.target.value || null)}
              >
                <option value="">All Weeks</option>
                {[...Array(10)].map((_, index) => (
                  <option key={index + 1} value={(index + 1).toString()}>
                    Week {index + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="ml-5 mr-2">
              <label className="ml-4 mr-5">Sort by Time:</label>
              <select
                className="py-2 rounded border bg-blue-50 focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
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
                  className="bg-blue-100 py-3 px-6 mb-3 flex justify-between items-center w-[62%]">
                  <div>
                    <p>
                      <strong>Subject:</strong> {item.subject} &emsp; 
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(item.time)} &emsp; 
                      <strong>Time:</strong> {formatTime(item.time)} &emsp; 
                      <strong>Week:</strong> {item.week}
                    </p>
                  </div>
                  
                </li>
              ))}
            </ul>
          ) : (
            <p>No attendance records available.</p>
          )}
        </div>
    </div>
  );
};

export default StudentAttendance;
