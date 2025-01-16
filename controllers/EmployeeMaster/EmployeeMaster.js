const EmployeeMaster = require("../../models/EmployeeMaster/EmployeeMaster");

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
            isActive,
            companyMasterId,
        } = req.body;

        if (!fs.existsSync(`${__basedir}/uploads/employeeMaster`)) {
            fs.mkdirSync(`${__basedir}/uploads/employeeMaster`);
        }

        let image = req.file
            ? `uploads/employeeMaster/${req.file.filename}`
            : null;

        const newEmployeeMaster = new EmployeeMaster({
            firstName,
            lastName,
            email,
            password,
            phone,
            image,
            department,
            dateOfJoining,
            currentSalary,
            isActive,
            companyMasterId,
        });

        const savedEmployeeMaster = await newEmployeeMaster.save();

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

exports.getEmployeeMasterById = async (req, res) => {
    try {
        const { _id } = req.params;
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
