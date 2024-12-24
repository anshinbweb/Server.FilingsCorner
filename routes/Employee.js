const express = require('express');
const { createEmployee, getEmployee, removeEmployee, updateEmployee, listEmployees, loginEmployee } = require('../controllers/Master/Employee');
const { isAuthenticated } = require('../middlewares/auth');

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

router.post('/employees/create', upload.single("myFile"), isAuthenticated, createEmployee);
router.get('/employees/:id', isAuthenticated, getEmployee);
router.delete('/employees/:id', isAuthenticated, removeEmployee);
router.put('/employees/:id', isAuthenticated, updateEmployee);
router.get('/employees', isAuthenticated, listEmployees);

module.exports = router;
