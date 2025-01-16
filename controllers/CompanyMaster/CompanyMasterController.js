const fs = require("fs");
const path = require("path");
const CompanyMaster = require("../../models/CompanyMaster");
const bcrypt = require("bcrypt");
const CompanyDetails = require("../../models/CompanyDetails");

exports.createCompanyMaster = async (req, res) => {
    try {
        const uploadDir = `${__basedir}/uploads/companyMaster`;

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const Favicon = req.files?.Favicon?.[0]?.filename
            ? `uploads/companyMaster/${req.files.Favicon[0].filename}`
            : null;
        const Icon = req.files?.Icon?.[0]?.filename
            ? `uploads/companyMaster/${req.files.Icon[0].filename}`
            : null;
        const Logo = req.files?.Logo?.[0]?.filename
            ? `uploads/companyMaster/${req.files.Logo[0].filename}`
            : null;
        const DigitalSignature = req.files?.DigitalSignature?.[0]?.filename
            ? `uploads/companyMaster/${req.files.DigitalSignature[0].filename}`
            : null;

        const {
            CompanyName,
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
            EmailID_Company,
            Password,
        } = req.body;

        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (
        //     !emailRegex.test(EmailID_Office) ||
        //     !emailRegex.test(EmailID_Company)
        // ) {
        //     return res.status(400).json({
        //         isOk: false,
        //         message: "Invalid EmailID_Office format",
        //     });
        // }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const newCompanyDetails = await new CompanyDetails({
            CompanyName,
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
            Favicon,
            Icon,
            Logo,
            DigitalSignature,
            Password: hashedPassword,
            EmailID_Company,
        }).save();

        const newCompanyMaster = await new CompanyMaster({
            CompanyName,
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
            Favicon,
            Icon,
            Logo,
            DigitalSignature,
            Password: hashedPassword,
            EmailID_Company,
            CompanyDetails: newCompanyDetails._id,
        }).save();

        return res.status(200).json({
            isOk: true,
            data: newCompanyMaster,
            message: "Company master created successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            isOk: false,
            message: "An error occurred while creating company master",
            error: error.message,
        });
    }
};

exports.listCompanyMaster = async (req, res) => {
    try {
        const companyMasterList = await CompanyMaster.find().exec();
        return res.status(200).json({
            data: companyMasterList,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

exports.getCompanyMasterById = async (req, res) => {
    try {
        const { _id } = req.params;
        const existingCompanyMaster = await CompanyMaster.findById(_id).exec();

        if (!existingCompanyMaster) {
            return res.status(404).json({
                isOk: false,
                message: "company master doesnt exist",
            });
        }

        return res.status(200).json({
            isOk: true,
            message: "Company master found",
            data: existingCompanyMaster,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

exports.listCompanyMasterByParams = async (req, res) => {
    try {
        let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

        let query = [
            {
                $match: { IsActive: IsActive },
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
                                CompanyName: { $regex: match, $options: "i" },
                            },
                            {
                                GSTNo: { $regex: match, $options: "i" },
                            },
                            {
                                EmailID_Office: {
                                    $regex: match,
                                    $options: "i",
                                },
                            },
                            {
                                ContactPersonName: {
                                    $regex: match,
                                    $options: "i",
                                },
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

        const companyMasterList = await CompanyMaster.aggregate(query);

        return res.status(200).json({
            data: companyMasterList,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

exports.deleteCompanyMaster = async (req, res) => {
    try {
        const { _id } = req.params;
        const existingCompanyMaster = await CompanyMaster.findById(_id).exec();

        if (!existingCompanyMaster) {
            return res.status(404).json({
                isOk: false,
                message: "Company master doesnt exist",
            });
        }

        await CompanyMaster.findByIdAndDelete(_id).exec();

        return res.status(200).json({
            isOk: true,
            message: "Company master deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

exports.updateCompanyMaster = async (req, res) => {
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

        const existingCompanyMaster = await CompanyMaster.findById(
            req.params._id
        ).exec();

        
        if (!existingCompanyMaster) {
            return res.status(404).json({
                isOk: false,
                message: "Company Master not found",
            });
        }
        
        const existingCompanyDetails = await CompanyDetails.findById(
            existingCompanyMaster.CompanyDetails
        ).exec();

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

        // Delete files not updated
        Object.entries(existingFiles).forEach(([key, oldFilePath]) => {
            if (
                oldFilePath &&
                oldFilePath !== updatedFiles[key] &&
                fs.existsSync(`${__basedir}/${oldFilePath}`)
            ) {
                fs.unlinkSync(`${__basedir}/${oldFilePath}`);
            }
        });

        Object.assign(existingCompanyMaster, updatedFiles);
        Object.assign(existingCompanyDetails, updatedFiles);

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

        Object.assign(existingCompanyDetails, {
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

        const update = await existingCompanyMaster.save();

        await existingCompanyDetails.save();

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
