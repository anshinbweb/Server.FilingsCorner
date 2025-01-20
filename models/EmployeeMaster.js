const mongoose = require("mongoose");

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
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: { type: String, required: true },
        phone: {
            type: Number,
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
        photo: {
            type: String,
        },
        currentSalary: {
            type: Number,
            required: true,
            min: 0,
        },
        companyDetailsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CompanyDetails",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
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