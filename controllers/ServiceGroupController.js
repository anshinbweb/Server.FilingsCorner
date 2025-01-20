const { default: mongoose } = require("mongoose");
const ServiceGroup = require("../models/ServiceGroup");

exports.createServiceGroup = async (req, res) => {
    try {
        const { groupName, services, companyDetailsId } = req.body;

        const serviceGroup = new ServiceGroup({
            groupName,
            services,
            companyDetailsId,
        });

        await serviceGroup.save();

        return res.status(201).json({
            isOk: true,
            message: "Service Group created successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            isOk: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.listServiceGroupsByCompany = async (req, res) => {
    try {
        const { companyDetailsId } = req.params;

        const serviceGroups = await ServiceGroup.find({
            companyDetailsId,
        }).populate("services");

        return res.status(200).json({
            isOk: true,
            serviceGroups,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            isOk: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.getServiceGroupById = async (req, res) => {
    try {
        const { id } = req.params;

        const serviceGroup = await ServiceGroup.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) }, // Match the service group by ID
            },
            {
                $lookup: {
                    from: "services",
                    localField: "services", 
                    foreignField: "_id", 
                    as: "services", 
                },
            },
            {
                $project: {
                    groupName: 1, 
                    isActive: 1,
                    services: 1,
                },
            },
        ]);

        if (!serviceGroup || serviceGroup.length === 0) {
            return res.status(404).json({
                isOk: false,
                message: "Service group not found",
            });
        }

        return res.status(200).json({
            isOk: true,
            serviceGroup: serviceGroup[0], // Return the first matching service group
        });
    } catch (error) {
        console.log("Error in getServiceGroupById:", error);
        return res.status(500).json({
            isOk: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.updateServiceGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { groupName, services, IsActive } = req.body;

        const serviceGroup = await ServiceGroup.findByIdAndUpdate(
            id,
            {
                groupName,
                services,
                isActive: IsActive,
            },
            { new: true }
        );

        return res.status(200).json({
            isOk: true,
            message: "Service Group updated successfully",
            serviceGroup,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            isOk: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.deleteServiceGroup = async (req, res) => {
    try {
        const { id } = req.params;
        await ServiceGroup.findByIdAndDelete(id);
        return res.status(200).json({
            isOk: true,
            message: "Service Group deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            isOk: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.listServiceGroupsByParams = async (req, res) => {
    try {
        let { skip, per_page, sorton, sortdir, match, IsActive } = req.body;
        const { companyDetailsId } = req.params;

        let matchQuery = {};
        if (IsActive !== undefined) {
            matchQuery.isActive = IsActive;
        }

        if (match) {
            matchQuery.groupName = { $regex: match, $options: "i" };
            matchQuery.companyDetailsId = companyDetailsId;
        }

        const sortOrder = sortdir === "desc" ? -1 : 1;

        const aggregatedData = await ServiceGroup.aggregate([
            {
                $match: matchQuery,
            },
            {
                $lookup: {
                    from: "services",
                    localField: "services",
                    foreignField: "_id",
                    as: "services",
                },
            },
            {
                $unwind: {
                    path: "$services",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "ratecards",
                    localField: "services._id",
                    foreignField: "serviceId",
                    as: "services.rateCards",
                },
            },
            {
                $unwind: {
                    path: "$services.rateCards",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "frequencyoptions",
                    localField: "services.rateCards.frequencyTypeId",
                    foreignField: "_id",
                    as: "services.rateCards.frequencyOption",
                },
            },
            {
                $unwind: {
                    path: "$services.rateCards.frequencyOption",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    groupName: { $first: "$groupName" },
                    isActive: { $first: "$isActive" },
                    services: {
                        $push: {
                            serviceId: "$services._id",
                            serviceName: "$services.serviceName",
                            rateCards: {
                                rateCardId: "$services.rateCards._id",
                                frequencyType:
                                    "$services.rateCards.frequencyOption.frequencyType",
                                rate: "$services.rateCards.rate",
                            },
                        },
                    },
                },
            },
            {
                $sort: {
                    [sorton]: sortOrder,
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: per_page,
            },
        ]);

        return res.status(200).json({
            success: true,
            data: aggregatedData,
        });
    } catch (error) {
        console.error("Error while aggregating data:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch data.",
            error: error.message,
        });
    }
};
