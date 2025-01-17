const express = require("express");
const { validateAdmin } = require("../middlewares/adminAuth");
const {
    createFrequencyOption,
    listFrequencyByParams,
    updateFrequencyOption,
    listFrequencyByCompanyId,
    getFrequencyOptionById,
    deleteFrequencyOption,
} = require("../controllers/FrequencyOptionController");

const router = express.Router();

router.post(
    "/auth/create/frequency-option",
    validateAdmin,
    createFrequencyOption
);

router.post(
    "/auth/listbyparams/frequency-option/:companyDetailsId",
    validateAdmin,
    listFrequencyByParams
);

router.put(
    "/auth/update/frequency-option/:frequencyOptionId",
    validateAdmin,
    updateFrequencyOption
);

router.get(
    "/auth/list/frequency-option/:companyDetailsId",
    validateAdmin,
    listFrequencyByCompanyId
);

router.get(
    "/auth/get/frequency-option/:frequencyOptionId",
    validateAdmin,
    getFrequencyOptionById
);

router.delete(
    "/auth/delete/frequency-option/:frequencyOptionId",
    validateAdmin,
    deleteFrequencyOption
);

module.exports = router;
