const express = require('express');
const { createEmployee, getEmployee, removeEmployee, updateEmployee, listEmployees, loginEmployee } = require('../controllers/Master/Employee');

const router = express.Router();
const multer = require("multer");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/employee");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
});

const upload = multer({ storage: multerStorage });

router.post('/login', loginEmployee);

router.post('/employees/create', upload.single("myFile"), createEmployee);
router.get('/employees/:id', getEmployee);
router.delete('/employees/:id', removeEmployee);
router.put('/employees/:id', updateEmployee);
router.get('/employees', listEmployees);

module.exports = router;
