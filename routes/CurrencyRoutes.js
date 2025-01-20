const express = require("express");
const { validateAdmin } = require("../middlewares/adminAuth");
const {
    createCurrencyMaster,
    listCurrencyMasterByCompany,
    getCurrencyMasterById,
    listCurrencyByParams,
    updateCurrencyMaster,
    deleteCurrencyMaster,
} = require("../controllers/CurrencyMasterController");

const router = express.Router();

router.post(
    "/auth/create/currency-master",
    validateAdmin,
    createCurrencyMaster
);

router.get(
    "/auth/list/currency-master/:companyDetailsId",
    validateAdmin,
    listCurrencyMasterByCompany
);

router.get(
    "/auth/get/currency-master/:currencyMasterId",
    validateAdmin,
    getCurrencyMasterById
);

router.post(
    "/auth/listbyparams/currency-master/:companyDetailsId",
    validateAdmin,
    listCurrencyByParams
);

router.put(
    "/auth/update/currency-master/:currencyMasterId",
    validateAdmin,
    updateCurrencyMaster
);

router.delete(
    "/auth/delete/currency-master/:currencyMasterId",
    validateAdmin,
    deleteCurrencyMaster
);

module.exports = router;
