const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const employeeMasterSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        image: String,
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: false,
            trim: true,
        },
        department: {
            type: String,
            required: true,
            enum: [
                "HR",
                "Developer",
                "Sales",
                "Marketing",
                "Finance",
                "Executive",
            ],
        },
        dateOfJoining: {
            type: Date,
            required: true,
        },
        currentSalary: {
            type: Number,
            required: true,
            min: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        companyMasterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CompanyMaster",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const EmployeeMaster = mongoose.model("EmployeeMaster", employeeMasterSchema);

employeeMasterSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

employeeMasterSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = EmployeeMaster;
