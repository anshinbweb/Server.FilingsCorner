const EmployeeMaster = require("../../models/EmployeeMaster");
const EmployeeDetails = require("../../models/EmployeeDetails");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");

exports.createEmployeeMaster = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            phone,
            department,
            dateOfJoining,
            currentSalary,
            companyDetailsId,
            isActive,
        } = req.body;

        if (!fs.existsSync(`${__basedir}/uploads/employeeMaster`)) {
            fs.mkdirSync(`${__basedir}/uploads/employeeMaster`);
        }

        let photo = req.file
            ? `uploads/employeeMaster/${req.file.filename}`
            : null;

        const newEmployeeMaster = new EmployeeMaster({
            firstName,
            lastName,
            email,
            password,
            phone,
            photo,
            department,
            dateOfJoining,
            currentSalary,
            companyDetailsId,
            isActive,
        });

        const newEmployeeDetail = new EmployeeDetails({
            firstName,
            lastName,
            email,
            password,
            phone,
            photo,
            department,
            dateOfJoining,
            currentSalary,
            companyDetailsId,
            isActive,
            employeeMasterId: newEmployeeMaster._id,
        });

        const savedEmployeeMaster = await newEmployeeMaster.save();

        await newEmployeeDetail.save();

        res.status(201).json({
            isOK: true,
            message: "Employee created successfully",
            employee: savedEmployeeMaster,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            isOK: false,
            message: "Error creating employee",
            error: error.message,
        });
    }
};

exports.listEmployeeMaster = async (req, res) => {
    try {
        const employees = await EmployeeMaster.find();
        res.status(200).json({
            isOK: true,
            employees,
        });
    } catch (error) {
        res.status(500).json({
            isOK: false,
            message: "Error fetching employees",
            error: error.message,
        });
    }
};

exports.listEmployeeMasterByCompany = async (req, res) => {
    try {
        const { companyDetailsId } = req.params;
        const employees = await EmployeeMaster.find({ companyDetailsId });
        res.status(200).json({
            isOK: true,
            employees,
        });
    } catch (error) {
        res.status(500).json({
            isOK: false,
            message: "Error fetching employees",
            error: error.message,
        });
    }
};

exports.listEmployeesMasterByParams = async (req, res) => {
    try {
        let { skip, per_page, sorton, sortdir, match, isActive } = req.body;

        const companyDetailsId = req.params.companyDetailsId;

        let query = [
            {
                $match: { isActive: isActive },
            },
            {
                $facet: {
                    stage1: [
                        {
                            $group: {
                                _id: null,
                                count: {
                                    $sum: 1,
                                },
                            },
                        },
                    ],
                    stage2: [
                        {
                            $skip: skip,
                        },
                        {
                            $limit: per_page,
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: "$stage1",
                },
            },
            {
                $project: {
                    count: "$stage1.count",
                    data: "$stage2",
                },
            },
        ];
        if (match) {
            query = [
                {
                    $match: {
                        $or: [
                            {
                                firstName: { $regex: match, $options: "i" },
                                lastName: { $regex: match, $options: "i" },
                            },
                            {
                                companyDetailsId: companyDetailsId,
                            },
                        ],
                    },
                },
            ].concat(query);
        }

        if (sorton && sortdir) {
            let sort = {};
            sort[sorton] = sortdir == "desc" ? -1 : 1;
            query = [
                {
                    $sort: sort,
                },
            ].concat(query);
        } else {
            let sort = {};
            sort["createdAt"] = -1;
            query = [
                {
                    $sort: sort,
                },
            ].concat(query);
        }

        const ServicesList = await EmployeeMaster.aggregate(query);

        console.log(ServicesList);

        return res.status(200).json({
            data: ServicesList,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

exports.getEmployeeMasterById = async (req, res) => {
    try {
        const { _id } = req.params;
        console.log(_id);
        const employee = await EmployeeMaster.findById(_id);
        if (!employee) {
            return res.status(404).json({
                isOK: false,
                message: "Employee not found",
            });
        }
        res.status(200).json({
            isOK: true,
            employee,
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.deleteEmployeeMaster = async (req, res) => {
    try {
        const { _id } = req.params;
        const deletedEmployee = await EmployeeMaster.findByIdAndDelete(_id);
        const deletedEmployeeDetails = await EmployeeDetails.findOneAndDelete({
            employeeMasterId: _id,
        });
        if (!deletedEmployee) {
            return res.status(404).json({
                isOK: false,
                message: "Employee not found",
            });
        }
        res.status(200).json({
            isOK: true,
            message: "Employee removed successfully",
        });
    } catch (error) {
        return res.status(500).json({
            isOK: false,
            message: "Error removing employee",
            error: error.message,
        });
    }
};

exports.updateEmployeeMaster = async (req, res) => {
    try {
        const uploadDir = `${__basedir}/uploads/employeeMaster`;

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const updatedPhoto = req.file
            ? `uploads/employeeMaster/${req.file.filename}`
            : null;

        const existingEmployeeMaster = await EmployeeMaster.findById(
            req.params._id
        ).exec();
        if (!existingEmployeeMaster) {
            return res.status(404).json({
                isOk: false,
                message: "Employee Master not found",
            });
        }

        const existingPhoto = existingEmployeeMaster.photo;
        // Check and handle photo removal
        if (req.body.removephoto) {
            console.log("first");
            fs.unlinkSync(`${__basedir}/${existingPhoto}`);
            existingEmployeeMaster.photo = null;
        }

        if (updatedPhoto) {
            if (
                existingPhoto &&
                fs.existsSync(path.join(__dirname, existingPhoto))
            ) {
                fs.unlinkSync(path.join(__basedir, existingPhoto));
            }
            existingEmployeeMaster.photo = updatedPhoto;
        }

        const {
            firstName,
            lastName,
            email,
            phone,
            department,
            dateOfJoining,
            currentSalary,
            isActive,
        } = req.body;

        Object.assign(existingEmployeeMaster, {
            firstName,
            lastName,
            email,
            phone,
            department,
            dateOfJoining,
            currentSalary,
            isActive,
        });

        // Save the updated employee data
        await existingEmployeeMaster.save();

        return res.status(200).json({
            isOk: true,
            message: "Employee updated successfully",
            employee: existingEmployeeMaster,
        });
    } catch (error) {
        console.error("Error in updating employee:", error);
        return res.status(500).json({
            isOk: false,
            message: "An error occurred while updating Employee Master",
            error: error.message,
        });
    }
};
