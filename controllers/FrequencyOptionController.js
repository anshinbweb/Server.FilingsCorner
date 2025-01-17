const FrequencyOptions = require("../models/FrequencyOptions");

exports.createFrequencyOption = async (req, res) => {
    try {
        const { frequencyType, companyDetailsId, IsActive } = req.body;

        const existingFrequencyOption = await FrequencyOptions.findOne({
            frequencyType,
            companyDetailsId,
        });

        if (existingFrequencyOption) {
            return res.status(400).json({
                isOk: false,
                message: "Frequency Option already exists",
            });
        }

        const frequencyOption = new FrequencyOptions({
            frequencyType,
            companyDetailsId,
            isActive: IsActive,
        });

        const savedFrequencyOption = await frequencyOption.save();

        return res.status(201).json({
            isOk: true,
            message: "Frequency Option created successfully",
            data: savedFrequencyOption,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            isOk: false,
            message: "An error occurred while creating Frequency Option",
            error: error,
        });
    }
};

exports.listFrequencyByParams = async (req, res) => {
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
                                frequencyType: { $regex: match, $options: "i" },
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

        const frequencyList = await FrequencyOptions.aggregate(query);

        return res.status(200).json({
            data: frequencyList,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

exports.updateFrequencyOption = async (req, res) => {
    try {
        const frequencyOptionId = req.params.frequencyOptionId;
        const { frequencyType, IsActive } = req.body;

        const updatedFrequencyOption = await FrequencyOptions.findByIdAndUpdate(
            frequencyOptionId,
            {
                frequencyType,
                isActive: IsActive,
            },
            { new: true }
        );

        return res.status(200).json({
            isOk: true,
            message: "Frequency Option updated successfully",
            data: updatedFrequencyOption,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            isOk: false,
            message: "An error occurred while updating Frequency Option",
            error: error,
        });
    }
};

exports.listFrequencyByCompanyId = async (req, res) => {
    try {
        const { companyDetailsId } = req.params;

        const frequencyList = await FrequencyOptions.find({
            companyDetailsId,
        });

        return res.status(200).json({
            data: frequencyList,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

exports.getFrequencyOptionById = async (req, res) => {
    try {
        const { frequencyOptionId } = req.params;

        const frequencyOption = await FrequencyOptions.findById(
            frequencyOptionId
        );

        return res.status(200).json({
            data: frequencyOption,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

exports.deleteFrequencyOption = async (req, res) => {
    try {
        const { frequencyOptionId } = req.params;

        const deletedFrequencyOption = await FrequencyOptions.findByIdAndDelete(
            frequencyOptionId
        );

        return res.status(200).json({
            isOk: true,
            message: "Frequency Option deleted successfully",
            data: deletedFrequencyOption,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            isOk: false,
            message: "An error occurred while deleting Frequency Option",
            error: error,
        });
    }
};
