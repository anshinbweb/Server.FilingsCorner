const SalaryMaster = require('../../models/Master/Salary');

exports.createSalary = async (req, res) => {
    try {
        const { employeeId, date, incrementAmount, newSalary } = req.body;

        const newSalaryRecord = new SalaryMaster({
            employeeId,
            date,
            incrementAmount,
            newSalary,
        });

        const savedSalary = await newSalaryRecord.save();

        res.status(201).json({
            message: 'Salary record created successfully',
            salary: savedSalary,
        });
    } catch (error) {
        res.status(400).json({ message: 'Error creating salary record', error: error.message });
    }
};

exports.getSalaryByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const salaries = await SalaryMaster.find({ employeeId }).populate('employeeId', 'firstName lastName email');

        if (!salaries || salaries.length === 0) {
            return res.status(404).json({ message: 'No salary records found for this employee' });
        }

        res.status(200).json(salaries);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching salary records', error: error.message });
    }
};

exports.getAllSalaries = async (req, res) => {
    try {
        const salaries = await SalaryMaster.find().populate('employeeId', 'firstName lastName email');

        if (!salaries || salaries.length === 0) {
            return res.status(404).json({ message: 'No salary records found' });
        }

        res.status(200).json(salaries);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching all salary records', error: error.message });
    }
};



exports.updateSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const { employeeId, date, incrementAmount, newSalary } = req.body;

        const updatedSalary = await SalaryMaster.findByIdAndUpdate(
            id,
            { employeeId, date, incrementAmount, newSalary },
            { new: true }
        );

        if (!updatedSalary) {
            return res.status(404).json({ message: 'Salary record not found' });
        }

        res.status(200).json({
            message: 'Salary record updated successfully',
            salary: updatedSalary,
        });
    } catch (error) {
        res.status(400).json({ message: 'Error updating salary record', error: error.message });
    }
};

exports.deleteSalary = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedSalary = await SalaryMaster.findByIdAndDelete(id);

        if (!deletedSalary) {
            return res.status(404).json({ message: 'Salary record not found' });
        }

        res.status(200).json({
            message: 'Salary record deleted successfully',
            salary: deletedSalary,
        });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting salary record', error: error.message });
    }
};
