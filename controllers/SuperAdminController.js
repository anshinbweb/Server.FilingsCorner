const SuperAdminMaster = require("../models/SuperAdminMaster");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const CompanyMaster = require("../models/CompanyMaster");
const fs = require("fs");

exports.createSuperAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const superAdmin = new SuperAdminMaster({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        await superAdmin.save();
        res.status(201).json({
            message: "SuperAdmin created successfully",
            isOk: true,
        });
    } catch (error) {
        console.error("Error in createSuperAdmin:", error);
        res.status(500).json({
            isOk: false,
            error: "Internal server error",
            message: error,
        });
    }
};

exports.loginSuperAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const superAdmin = await SuperAdminMaster.findOne({ email });
        if (!superAdmin) {
            return res
                .status(404)
                .json({ isOk: false, message: "SuperAdmin not found" });
        }

        const isMatch = await bcrypt.compare(password, superAdmin.password);

        if (!isMatch) {
            return res
                .status(400)
                .json({ isOk: false, message: "Invalid credentials" });
        }

        const token = await generateToken(superAdmin._id, "superadmin");

        return res.status(200).json({
            isOk: true,
            message: "SuperAdmin logged in successfully",
            data: superAdmin,
            token: token,
            role: "superadmin",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            isOk: false,
            error: "Internal server error",
            message: error,
        });
    }
};

exports.getSuperAdmin = async (req, res) => {
    try {
        return res.status(200).json({
            isOk: true,
            data: req.user,
            role: req.role,
        });
    } catch (error) {
        return res.status(500).json({
            isOk: false,
            error: "Internal server error",
            message: error,
        });
    }
};

