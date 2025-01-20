const CurrencyMaster = require("../models/CurrencyMaster");

exports.createCurrencyMaster = async (req, res) => {
    try {
        const {
            currencyName,
            currencyCode,
            currencySymbol,
            companyDetailsId,
            isActive,
        } = req.body;

        const existingCurrencyMaster = await CurrencyMaster.findOne({
            currencyCode,
        });

        if (existingCurrencyMaster) {
            return res.status(400).json({
                isOk: false,
                message: "Currency Master already exists",
            });
        }

        const currencyMaster = new CurrencyMaster({
            currencyName,
            currencyCode,
            currencySymbol,
            companyDetailsId,
            isActive,
        });

        await currencyMaster.save();

        res.status(201).json({
            isOk: true,
            message: "Currency Master created successfully",
            data: currencyMaster,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            isOk: false,
            message: error.message,
        });
    }
};

exports.listCurrencyMasterByCompany = async (req, res) => {
    try {
        const { companyDetailsId } = req.params;

        const currencyMaster = await CurrencyMaster.find({
            companyDetailsId,
        });

        res.status(200).json({
            isOk: true,
            data: currencyMaster,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            isOk: false,
            message: error.message,
        });
    }
};

exports.getCurrencyMasterById = async (req, res) => {
    try {
        const { currencyMasterId } = req.params;

        const currencyMaster = await CurrencyMaster.findById(currencyMasterId);

        if (!currencyMaster) {
            return res.status(404).json({
                isOk: false,
                message: "Currency Master not found",
            });
        }

        res.status(200).json({
            isOk: true,
            data: currencyMaster,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            isOk: false,
            message: error.message,
        });
    }
};

exports.updateCurrencyMaster = async (req, res) => {
    try {
        const { currencyMasterId } = req.params;

        const { currencyName, currencyCode, currencySymbol, isActive } =
            req.body;

        const currencyMaster = await CurrencyMaster.findByIdAndUpdate(
            currencyMasterId,
            {
                currencyName,
                currencyCode,
                currencySymbol,
                isActive,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!currencyMaster) {
            return res.status(404).json({
                isOk: false,
                message: "Currency Master not found",
            });
        }

        res.status(200).json({
            isOk: true,
            message: "Currency Master updated successfully",
            data: currencyMaster,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            isOk: false,
            message: error.message,
        });
    }
};

exports.deleteCurrencyMaster = async (req, res) => {
    try {
        const { currencyMasterId } = req.params;

        const currencyMaster = await CurrencyMaster.findByIdAndDelete(
            currencyMasterId
        );

        if (!currencyMaster) {
            return res.status(404).json({
                isOk: false,
                message: "Currency Master not found",
            });
        }

        res.status(200).json({
            isOk: true,
            message: "Currency Master deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            isOk: false,
            message: error.message,
        });
    }
};

exports.listCurrencyByParams = async (req, res) => {
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
                                currencyCode: { $regex: match, $options: "i" },
                            },
                            {
                                currencyName: { $regex: match, $options: "i" },
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

        const currencyList = await CurrencyMaster.aggregate(query);

        return res.status(200).json({
            data: currencyList,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};
