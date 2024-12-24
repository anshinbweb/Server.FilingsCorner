const express = require('express');
const { createSalary, getSalaryByEmployee, getAllSalaries, updateSalary, deleteSalary } = require('../controllers/Master/Salary');
const router = express.Router();

router.post('/salaries/create', createSalary);

router.get('/salaries/employee/:employeeId', getSalaryByEmployee);

router.get('/salaries', getAllSalaries);

router.put('/salaries/:id', updateSalary);

router.delete('/salaries/:id', deleteSalary);

module.exports = router;
