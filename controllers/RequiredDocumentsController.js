const RequiredDocuments = require("../models/RequiredDocuments");

exports.createRequiredDocument = async (req, res) => {
    try {
        const { documentName, companyDetailsId, IsActive } = req.body;

        const existingRequiredDocument = await RequiredDocuments.findOne({
            documentName,
            companyDetailsId,
        });

        if (existingRequiredDocument) {
            return res.status(400).json({
                IsOK: false,
                message: "Required Document already exists",
            });
        }

        const newRequiredDocument = new RequiredDocuments({
            documentName,
            companyDetailsId,
            isActive:IsActive,
        });

        const savedRequiredDocument = await newRequiredDocument.save();

        res.status(200).json({
            IsOK: true,
            message: "Required Document created successfully",
            savedRequiredDocument,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ IsOK: false, message: error.message });
    }
};

exports.getRequiredDocumentsByCompany = async (req, res) => {
    try {
        const { companyDetailsId } = req.params;
        const requiredDocuments = await RequiredDocuments.find({
            companyDetailsId,
        });
        res.status(200).json({ IsOK: true, requiredDocuments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ IsOK: false, message: error.message });
    }
};

exports.getRequiredDocumentsById = async (req, res) => {
    try {
        const { _id } = req.params;
        const requiredDocument = await RequiredDocuments.findById(_id);
        res.status(200).json({ IsOK: true, requiredDocument });
    } catch (error) {
        console.log(error);
        res.status(500).json({ IsOK: false, message: error.message });
    }
};

exports.updateRequiredDocument = async (req, res) => {
    try {
        const { _id } = req.params;
        const { documentName, IsActive } = req.body;
        const updatedRequiredDocument =
            await RequiredDocuments.findByIdAndUpdate(
                _id,
                { documentName, isActive: IsActive },
                { new: true }
            );
        res.status(200).json({
            IsOK: true,
            message: "Required Document updated successfully",
            updatedRequiredDocument,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ IsOK: false, message: error.message });
    }
};

exports.deleteRequiredDocument = async (req, res) => {
    try {
        const { _id } = req.params;
        await RequiredDocuments.findByIdAndDelete(_id);
        res.status(200).json({
            IsOK: true,
            message: "Required Document deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ IsOK: false, message: error.message });
    }
};

exports.listRequiredDocsByParams = async (req, res) => {
    try {
        let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;

        const companyDetailsId = req.params.companyDetailsId;

        let query = [
            {
                $match: { isActive: IsActive },
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
                                documentName: { $regex: match, $options: "i" },
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

        const RequiredDocumentsList = await RequiredDocuments.aggregate(query);

        return res.status(200).json({
            data: RequiredDocumentsList,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};
