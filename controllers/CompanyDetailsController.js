const CompanyDetails = require("../models/CompanyDetails");
const CompanyMaster = require("../models/CompanyMaster");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const fs = require("fs");

exports.getCompanyDetailsById = async (req, res) => {
    try {
        const { _id } = req.params;
        const existingCompanyDetails = await CompanyDetails.findById(
            _id
        ).exec();

        if (!existingCompanyDetails) {
            return res.status(404).json({
                isOk: false,
                message: "company master doesnt exist",
            });
        }

        return res.status(200).json({
            isOk: true,
            message: "Company master found",
            data: existingCompanyDetails,
            role: "admin",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

exports.updateCompanyDetails = async (req, res) => {
    try {
        const uploadDir = `${__basedir}/uploads/companyMaster`;

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const FaviconUpdated = req.files?.FaviconUpdated?.[0]?.filename
            ? `uploads/companyMaster/${req.files.FaviconUpdated[0].filename}`
            : null;
        const IconUpdated = req.files?.IconUpdated?.[0]?.filename
            ? `uploads/companyMaster/${req.files.IconUpdated[0].filename}`
            : null;
        const LogoUpdated = req.files?.LogoUpdated?.[0]?.filename
            ? `uploads/companyMaster/${req.files.LogoUpdated[0].filename}`
            : null;
        const DigitalSignatureUpdated = req.files?.DigitalSignatureUpdated?.[0]
            ?.filename
            ? `uploads/companyMaster/${req.files.DigitalSignatureUpdated[0].filename}`
            : null;

        const existingCompany = await CompanyDetails.findById(
            req.params._id
        ).exec();

        if (!existingCompany) {
            return res.status(404).json({
                isOk: false,
                message: "Company Master not found",
            });
        }

        const existingCompanyMaster = await CompanyMaster.findOne({
            CompanyDetails: existingCompany._id,
        }).exec();

        const existingFiles = {
            Favicon: existingCompanyMaster.Favicon,
            Icon: existingCompanyMaster.Icon,
            Logo: existingCompanyMaster.Logo,
            DigitalSignature: existingCompanyMaster.DigitalSignature,
        };

        const updatedFiles = {
            Favicon: FaviconUpdated,
            Icon: IconUpdated,
            Logo: LogoUpdated,
            DigitalSignature: DigitalSignatureUpdated,
        };

        Object.entries(existingFiles).forEach(([key, oldFilePath]) => {
            if (
                oldFilePath &&
                updatedFiles[key] !== null && 
                oldFilePath !== updatedFiles[key] &&
                fs.existsSync(`${__basedir}/${oldFilePath}`)
            ) {
                fs.unlinkSync(`${__basedir}/${oldFilePath}`);
            }
        });

        Object.assign(existingCompany, updatedFiles);
        Object.assign(existingCompanyMaster, updatedFiles);

        const {
            CompanyName,
            EmailID_Company,
            ContactPersonName,
            CountryID,
            StateID,
            City,
            Address,
            Pincode,
            ContactNo_Sales,
            ContactNo_Support,
            ContactNo_Office,
            EmailID_Office,
            EmailID_Support,
            EmailID_Sales,
            Website1,
            Website2,
            GSTNo,
            IsActive,
        } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(EmailID_Office)) {
            return res.status(400).json({
                isOk: false,
                message: "Invalid EmailID_Office format",
            });
        }

        Object.assign(existingCompany, {
            CompanyName,
            EmailID_Company,
            ContactPersonName,
            CountryID,
            StateID,
            City,
            Address,
            Pincode,
            ContactNo_Sales,
            ContactNo_Support,
            ContactNo_Office,
            EmailID_Office,
            EmailID_Support,
            EmailID_Sales,
            Website1,
            Website2,
            GSTNo,
            IsActive,
        });

        Object.assign(existingCompanyMaster, {
            CompanyName,
            EmailID_Company,
            ContactPersonName,
            CountryID,
            StateID,
            City,
            Address,
            Pincode,
            ContactNo_Sales,
            ContactNo_Support,
            ContactNo_Office,
            EmailID_Office,
            EmailID_Support,
            EmailID_Sales,
            Website1,
            Website2,
            GSTNo,
            IsActive,
        });

        const update = await existingCompany.save();

        await existingCompanyMaster.save();

        return res.status(200).json({
            isOk: true,
            data: update,
            message: "Company master updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            isOk: false,
            message: "An error occurred while updating company master",
            error: error.message,
        });
    }
};

exports.loginCompany = async (req, res) => {
    try {
        const { email, password } = req.body;
        const company = await CompanyDetails.findOne({
            EmailID_Company: email,
        });

        if (!company) {
            return res
                .status(404)
                .json({ isOk: false, message: "Company not found" });
        }

        const isMatch = await bcrypt.compare(password, company.Password);

        if (!isMatch) {
            return res
                .status(400)
                .json({ isOk: false, message: "Invalid credentials" });
        }

        const token = await generateToken(company._id, "admin");

        return res.status(200).json({
            isOk: true,
            message: "Company logged in successfully",
            data: company,
            token: token,
            role: "admin",
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
