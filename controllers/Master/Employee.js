const Employee = require("../../models/Master/Employee");


exports.loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await employee.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      employee
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email,password, phone, department, role, dateOfJoining, currentSalary, isActive } = req.body;

    if (!fs.existsSync(`${__basedir}/uploads/employee`)) {
          fs.mkdirSync(`${__basedir}/uploads/employee`);
        }
    
        let image = req.file
          ? `uploads/employee/${req.file.filename}`
          : null;
          
          const newEmployee = new Employee({
            firstName,
            lastName,
            email,
            password,
            phone,
            image,
            department,
            role,
            dateOfJoining,
            currentSalary,
            isActive
          });

    const savedEmployee = await newEmployee.save();
    const { password: savedPassword, ...employeeData } = savedEmployee.toObject();

    res.status(201).json({
      message: 'Employee created successfully',
      employee: employeeData,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating employee', error: error.message });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching employee', error: error.message });
  }
};

exports.removeEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' });

    res.status(200).json({ message: 'Employee removed successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error removing employee', error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });

    res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
  } catch (error) {
    res.status(400).json({ message: 'Error updating employee', error: error.message });
  }
};

exports.listEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true });
    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching employees', error: error.message });
  }
};

exports.listEmployeesByParams = async (req, res) => {
  try {
    let { skip, per_page, sorton, sortdir, match, isActive } = req.body;

    let query = [
      {
        $match: { isActive: isActive },
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
                firstName: { $regex: match, $options: "i" },
              },
              {
                lastName: { $regex: match, $options: "i" },
              },
              {
                email: { $regex: match, $options: "i" },
              },
              {
                phone: { $regex: match, $options: "i" },
              }, 
              {
                department: { $regex: match, $options: "i" },
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

    const list = await User.aggregate(query);

    res.json(list);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
