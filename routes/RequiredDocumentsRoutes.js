const express = require("express");
const { validateAdmin } = require("../middlewares/adminAuth");
const {
    createRequiredDocument,
    getRequiredDocumentsByCompany,
    getRequiredDocumentsById,
    updateRequiredDocument,
    deleteRequiredDocument,
    listRequiredDocsByParams,
} = require("../controllers/RequiredDocumentsController");
const router = express.Router();

router.post(
    "/auth/create/required-document",
    validateAdmin,
    createRequiredDocument
);

router.get(
    "/auth/get/required-documents/:companyDetailsId",
    validateAdmin,
    getRequiredDocumentsByCompany
);

router.get(
    "/auth/get/required-document/:_id",
    validateAdmin,
    getRequiredDocumentsById
);

router.put(
    "/auth/update/required-document/:_id",
    validateAdmin,
    updateRequiredDocument
);

router.delete(
    "/auth/delete/required-document/:_id",
    validateAdmin,
    deleteRequiredDocument
);

router.post(
    "/auth/listbyparams/required-document/:companyDetailsId",
    validateAdmin,
    listRequiredDocsByParams
);

module.exports = router;
