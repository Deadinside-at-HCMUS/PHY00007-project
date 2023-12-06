import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Heading from "../../components/Heading";
import { MdOutlineDelete } from "react-icons/md";
import { baseApiURL } from "../../baseUrl";
// import { connectStorageEmulator } from "firebase/storage";

const Subjects = () => {
  const [data, setData] = useState({
    name: "",
    code: "",
    duration: "",
    lecturer: "",
  });
  const [selected, setSelected] = useState("add");
  const [subject, setSubject] = useState();
  const [lecturer, setLecturer] = useState();

  useEffect(() => {
    setLecturerData();
  }, []);

  const setLecturerData = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(`${baseApiURL()}/faculty/details/getFaculty`, { headers })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          setLecturer(response.data.users);
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
    getSubjectHandler();
  }, []);

  const getSubjectHandler = () => {
    axios
      .get(`${baseApiURL()}/subject/getSubject`)
      .then((response) => {
        if (response.data.success) {
          setSubject(response.data.subject);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const addSubjectHandler = () => {
    toast.loading("Adding Subject");
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(`${baseApiURL()}/subject/addSubject`, data, {
        headers: headers,
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setData({ name: "", code: "", duration: "", lecturer: "" });
          getSubjectHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  const deleteSubjectHandler = (id) => {
    toast.loading("Deleting Suject");
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .delete(`${baseApiURL()}/subject/deleteSubject/${id}`, {
        headers: headers,
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          getSubjectHandler();
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
        <Heading title="Add Course" />
        <div className="flex justify-end items-center w-full">
          <button
            className={`${
              selected === "add" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm mr-6`}
            onClick={() => setSelected("add")}
          >
            Add Course
          </button>
          <button
            className={`${
              selected === "view" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm`}
            onClick={() => setSelected("view")}
          >
            View Course
          </button>
        </div>
      </div>
      {selected === "add" && (
        <div className="flex flex-col justify-center items-center w-full mt-8">
          <div className="w-[40%] mb-4">
            <label htmlFor="code" className="leading-7 text-sm">
              Enter Course ID
            </label>
            <input
              type="number"
              id="code"
              value={data.code}
              onChange={(e) => setData({ ...data, code: e.target.value })}
              className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="name" className="leading-7 text-sm ">
              Enter Course Name
            </label>
            <input
              type="name"
              id="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="name" className="leading-7 text-sm ">
              Enter Course Duration
            </label>
            <input
              type="name"
              id="name"
              value={data.duration}
              onChange={(e) => setData({ ...data, duration: e.target.value })}
              className="w-full bg-blue-50 rounded border focus:border-dark-green focus:bg-secondary-light focus:ring-2 focus:ring-light-green text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>

          <div className="w-[40%]">
            <label htmlFor="" className="leading-7 text-sm">
                Select Lecturer
            </label>
            <select
                id="lecturer"
                className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[100%] accent-blue-700"
                value={data.lecturer}
                onChange={(e) =>
                  setData({ ...data, lecturer: e.target.value })
                }
              >
                <option defaultValue>-- Select Lecturer --</option>
                {lecturer &&
                  lecturer.map((lecturer) => {
                    return (
                      <option value={lecturer.employeeId} key={lecturer.employeeId}>
                        {lecturer.employeeId}
                      </option>
                    );
                  })}
              </select>
          </div>
          <button
            className="mt-6 bg-blue-500 px-6 py-3 text-white"
            onClick={addSubjectHandler}
          >
            Add Course
          </button>
        </div>
      )}
      {selected === "view" && (
        <div className="mt-8 w-full">
          <ul>
            {subject &&
              subject.map((item) => {
                return (
                  <li
                    key={item.code}
                    className="bg-blue-100 py-3 px-6 mb-3 flex justify-between items-center w-[70%]"
                  >
                    <div>
                      {item.code} - {item.name}
                    </div>
                    <button
                      className="text-red-500 text-2xl hover:text-red-300"
                      onClick={() => deleteSubjectHandler(item._id)}
                    >
                      <MdOutlineDelete />
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Subjects;
