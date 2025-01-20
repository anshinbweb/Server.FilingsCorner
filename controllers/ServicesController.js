const Services = require("../models/Services");

exports.createService = async (req, res) => {
    try {
        const {
            serviceName,
            serviceDescription,
            requiredDocuments,
            companyDetailsId,
            IsActive,
        } = req.body;
        console.log(requiredDocuments);
        const service = new Services({
            serviceName,
            serviceDescription,
            requiredDocuments,
            companyDetailsId,
            isActive: IsActive,
        });

        const savedService = await service.save();

        return res.status(201).json({
            isOk: true,
            message: "Service created successfully",
            service: savedService,
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

exports.listServicesByParams = async (req, res) => {
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
                                serviceName: { $regex: match, $options: "i" },
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

        const ServicesList = await Services.aggregate(query);

        return res.status(200).json({
            data: ServicesList,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

exports.deleteService = async (req, res) => {
    try {
        const { _id } = req.params;

        const service = await Services.findByIdAndDelete(_id).exec();

        if (!service) {
            return res.status(404).json({
                isOk: false,
                message: "Service not found",
            });
        }

        await RateCard.deleteMany({ serviceId: _id }).exec();

        return res.status(200).json({
            isOk: true,
            message: "Service and associated rate cards deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting service:", error);
        return res.status(500).json({
            isOk: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const { _id } = req.params;

        const service = await Services.findById(_id).exec();

        if (!service) {
            return res.status(404).json({
                isOk: false,
                message: "Service not found",
            });
        }

        return res.status(200).json({
            isOk: true,
            data: service,
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

exports.updateService = async (req, res) => {
    try {
        const { _id } = req.params;
        const {
            serviceName,
            serviceDescription,
            requiredDocuments,
            companyDetailsId,
            IsActive,
        } = req.body;

        const service = await Services.findByIdAndUpdate(
            _id,
            {
                serviceName,
                serviceDescription,
                requiredDocuments,
                companyDetailsId,
                isActive: IsActive,
            },
            { new: true }
        ).exec();

        if (!service) {
            return res.status(404).json({
                isOk: false,
                message: "Service not found",
            });
        }

        return res.status(200).json({
            isOk: true,
            message: "Service updated successfully",
            service,
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

exports.listServicesByCompanyId = async (req, res) => {
    try {
        const { companyDetailsId } = req.params;

        const services = await Services.find({ companyDetailsId }).exec();

        return res.status(200).json({
            isOk: true,
            data: services,
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
