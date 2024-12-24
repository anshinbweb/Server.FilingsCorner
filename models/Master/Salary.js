const mongoose = require('mongoose');

const salaryMasterSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },

    date: { type: Date, required: true },
    incrementAmount: { type: Number, required: true, min: 0 },
    newSalary: { type: Number, required: true, min: 0 },


}, {
    timestamps: true,
});

const SalaryMaster = mongoose.model('SalaryMaster', salaryMasterSchema);
module.exports = SalaryMaster;
