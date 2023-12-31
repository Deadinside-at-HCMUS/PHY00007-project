const express = require("express");
const router = express.Router();
const Attendace = require("../models/Other/Attendance");
const Subject = require("../models/Other/Subject");

router.get("/getAttendance", async (req, res) => {
    try {
        let attendance = await Attendace.find();
        if (!attendance) {
            return res
                .status(400)
                .json({ success: false, message: "No Attendace Available" });
        }
        const data = {
            success: true,
            message: "All Attendace Loaded!",
            attendance,
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

router.get("/getAttendance/faculty/:id", async (req, res) => {
    try {
        const subjectList = await Subject.find({ lecturer: req.params.id });
        const subjectNames = subjectList.map((subject) => subject.name);
        let attendance = await Attendace.find({ subject: subjectNames });
        if (!attendance) {
            return res
                .status(400)
                .json({ success: false, message: "No Attendace Available" });
        }
        const data = {
            success: true,
            message: "All Attendace Loaded!",
            attendance,
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

router.get("/getAttendance/student/:id", async (req, res) => {
    try {
        let attendance = await Attendace.find({ studentID: req.params.id });
        if (!attendance) {
            return res
                .status(400)
                .json({ success: false, message: "No Attendace Available" });
        }

        const data = {
            success: true,
            message: "All Attendace Loaded!",
            attendance,
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

router.post("/addAttendance", async (req, res) => {
    let { subject, studentID, time, week } = req.body;
    try {
        let foundSubject = await Subject.findOne({ name: subject });
        if (!foundSubject.students.includes(studentID)) {
            return res.status(400).json({
                success: false,
                message: "Student haven't registered this course!",
            });
        }

        let attedance = await Attendace.findOne({ studentID, subject, week });
        if (attedance) {
            return res.status(400).json({
                success: false,
                message: "Student have already attended the class!",
            });
        }

        await Attendace.create({
            subject,
            studentID,
            time,
            week,
        });
        const data = {
            success: true,
            message: "Attendace Added!",
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

router.delete("/deleteAttendance/:id", async (req, res) => {
    try {
        let attedance = await Attendace.findByIdAndDelete(req.params.id);
        if (!attedance) {
            return res
                .status(400)
                .json({ success: false, message: "No Attendace Exists!" });
        }
        const data = {
            success: true,
            message: "Attendace Deleted!",
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

module.exports = router;
