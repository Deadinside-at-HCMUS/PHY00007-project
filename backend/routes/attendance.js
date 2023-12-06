const express = require("express");
const router = express.Router();
const Attendace = require("../models/Other/Attendance");

router.get("/getAttendance", async (req, res) => {
    try {
        let attendance = await Attendace.find();
        // console.log(attendance);
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
    let { subject, studentID, time } = req.body;
    try {
        let attedance = await Attendace.findOne({ time });
        if (attedance) {
            return res
                .status(400)
                .json({ success: false, message: "Attendace Already Exists" });
        }
        await Attendace.create({
            subject,
            studentID,
            time
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
