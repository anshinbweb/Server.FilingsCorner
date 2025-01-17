const RateCard = require("../models/RateCard");
const mongoose = require("mongoose");

exports.createrateCard = async (req, res) => {
    try {
        const { serviceId, frequencyTypeId, rate, companyDetailsId } = req.body;

        const existingRate = await RateCard.findOne({
            serviceId,
            frequencyTypeId,
            companyDetailsId,
        });

        if (existingRate) {
            return res
                .status(400)
                .send({ isOk: false, message: "RateCard already exists" });
        }

        const rateCard = new RateCard({
            serviceId,
            frequencyTypeId,
            rate,
            companyDetailsId,
        });

        await rateCard.save();

        res.status(201).send({
            isOk: true,
            message: "RateCard created successfully",
        });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.listRateCardByParams = async (req, res) => {
    try {
        let {
            skip = 0,
            per_page = 10,
            sorton,
            sortdir,
            match,
            IsActive,
        } = req.body;

        const companyDetailsId = req.params.companyDetailsId;

        let query = [
            {
                $match: {
                    isActive: IsActive,
                    companyDetailsId: new mongoose.Types.ObjectId(companyDetailsId),
                },
            },
            {
                $lookup: {
                    from: "services",
                    localField: "serviceId",
                    foreignField: "_id",
                    as: "serviceDetails",
                },
            },
            {
                $unwind: {
                    path: "$serviceDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "frequencyoptions",
                    localField: "frequencyTypeId",
                    foreignField: "_id",
                    as: "frequencyDetails",
                },
            },
            {
                $unwind: {
                    path: "$frequencyDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];

        if (match) {
            query.push({
                $match: {
                    $or: [
                        {
                            "serviceDetails.serviceName": {
                                $regex: match,
                                $options: "i",
                            },
                        },
                        {
                            "frequencyDetails.frequencyType": {
                                $regex: match,
                                $options: "i",
                            },
                        },
                    ],
                },
            });
        }

        if (sorton && sortdir) {
            let sort = {};
            sort[sorton] = sortdir === "desc" ? -1 : 1;
            query.push({
                $sort: sort,
            });
        } else {
            query.push({
                $sort: { createdAt: -1 },
            });
        }

        query.push(
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
                        { $skip: parseInt(skip) },
                        { $limit: parseInt(per_page) },
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
            }
        );

        const rateCardList = await RateCard.aggregate(query);

        return res.status(200).json({
            data: rateCardList,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
};

exports.getRateCardById = async (req, res) => {
    try {
        const { id } = req.params;

        const query = [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: "services",
                    localField: "serviceId",
                    foreignField: "_id",
                    as: "serviceDetails",
                },
            },
            {
                $lookup: {
                    from: "frequencyoptions",
                    localField: "frequencyTypeId",
                    foreignField: "_id",
                    as: "frequencyDetails",
                },
            },
            {
                $unwind: "$serviceDetails",
            },
            {
                $unwind: "$frequencyDetails",
            },
            {
                $project: {
                    _id: 1,
                    serviceId: 1,
                    frequencyTypeId: 1,
                    rate: 1,
                    companyDetailsId: 1,
                    isActive: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    serviceDetails: {
                        serviceName: 1,
                        serviceDescription: 1,
                    },
                    frequencyDetails: {
                        frequencyType: 1,
                    },
                },
            },
        ];

        const rateCard = await RateCard.aggregate(query);

        if (!rateCard.length) {
            return res.status(404).json({ message: "Rate card not found" });
        }

        return res.status(200).json({
            data: rateCard[0],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteRateCard = async (req, res) => {
    try {
        const { id } = req.params;

        const rateCard = await RateCard.findByIdAndDelete(id);

        if (!rateCard) {
            return res.status(404).json({ message: "Rate card not found" });
        }

        return res
            .status(200)
            .json({ message: "Rate card deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.updateRateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { serviceId, frequencyTypeId, rate, IsActive } = req.body;

        const updatedRateCard = await RateCard.findByIdAndUpdate(
            id,
            {
                serviceId,
                frequencyTypeId,
                rate,
                isActive: IsActive,
            },
            { new: true }
        );

        return res.status(200).json({
            isOk: true,
            message: "Rate Card updated successfully",
            data: updatedRateCard,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            isOk: false,
            message: "An error occurred while updating Rate Card",
            error: error,
        });
    }
};
