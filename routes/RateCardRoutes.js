const express = require("express");
const { validateAdmin } = require("../middlewares/adminAuth");
const {
    createrateCard,
    listRateCardByParams,
    getRateCardById,
    deleteRateCard,
    updateRateCard,
} = require("../controllers/RateCardController");

const router = express.Router();

router.post("/auth/create/rate-card", validateAdmin, createrateCard);

router.post(
    "/auth/listbyparams/rate-card/:companyDetailsId",
    validateAdmin,
    listRateCardByParams
);

router.get("/auth/get/rate-card/:id", validateAdmin, getRateCardById);

router.delete("/auth/delete/rate-card/:id", validateAdmin, deleteRateCard);

router.put("/auth/update/rate-card/:id", validateAdmin, updateRateCard);

module.exports = router;
