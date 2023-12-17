const axios = require("axios");
const mqtt = require("mqtt");
const connectToMongo = require("./Database/db");
const express = require("express");
const app = express();
connectToMongo();
const port = 8080 || process.env.PORT;
var cors = require("cors");

app.use(cors());
app.use(express.json()); //to convert request data to json

// Credential Apis
app.use("/api/student/auth", require("./routes/Student Api/studentCredential"));
app.use("/api/faculty/auth", require("./routes/Faculty Api/facultyCredential"));
app.use("/api/admin/auth", require("./routes/Admin Api/adminCredential"));
// Details Apis
app.use("/api/student/details", require("./routes/Student Api/studentDetails"));
app.use("/api/faculty/details", require("./routes/Faculty Api/facultyDetails"));
app.use("/api/admin/details", require("./routes/Admin Api/adminDetails"));
// Other Apis
app.use("/api/timetable", require("./routes/timetable"));
app.use("/api/notice", require("./routes/notice"));
app.use("/api/subject", require("./routes/subject"));
app.use("/api/branch", require("./routes/branch"));
app.use("/api/attendance", require("./routes/attendance"));

app.listen(port, () => {
    console.log(`Server Listening On http://localhost:${port}`);
});

const protocol = "mqtt";
const host = "broker.emqx.io";
const mqttPort = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `${protocol}://${host}:${mqttPort}`;

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: "group02_sma",
    password: "21clc_iot",
    reconnectPeriod: 1000,
});

const topic = "esp8266/smartAttendance";

client.on("connect", () => {
    console.log("Connected to mqtt broker");
    client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`);
    });
});

client.on("message", (topic, payload) => {
    var message = payload.toString();
    var jsonObject = JSON.parse(message);

    // Access the properties of the object
    var content = jsonObject.Content;
    var id = jsonObject.ID;
    var course = jsonObject.Course;
    var week = jsonObject.Week;

    // Print the extracted information
    console.log("Received Message from ", topic);
    console.log(content);
    if (id !== -1) {
        console.log("ID:", id);
        console.log("Course:", course);
        console.log("Week:", week);

        axios
            .post("http://localhost:8080/api/student/details/getDetails", {
                fingerPrintID: id,
            })
            .then((response) => {
                if (response.data.success) {
                    const foundStudent = response.data.user[0];
                    const studentID = foundStudent.enrollmentNo;
                    console.log("Student ID found:", studentID);

                    data = {
                        subject: course,
                        studentID: studentID,
                        time: new Date(),
                        week: week,
                    };
                    axios
                        .post(
                            "http://localhost:8080/api/attendance/addAttendance",
                            data
                        )
                        .then((response) => {
                            if (response.data.success) {
                                console.log(response.data.message);

                                const notificationInfo = {
                                    value1:
                                        foundStudent.lastName +
                                        " " +
                                        foundStudent.middleName +
                                        " " +
                                        foundStudent.firstName,
                                    value2: course,
                                    value3: week,
                                };
                                const event = "Attendance";

                                axios.post(
                                    `https://maker.ifttt.com/trigger/${event}/with/key/${process.env.IFTTT_KEY}`,
                                    (data = notificationInfo)
                                );
                            } else {
                                console.log(response.data.message);
                            }
                        })
                        .catch((error) => {
                            console.log(error.response.data.message);
                        });
                } else {
                    console.log("No student with given fingerprint id found!");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
});
