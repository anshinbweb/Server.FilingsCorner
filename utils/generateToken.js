const jwt = require("jsonwebtoken");

exports.generateToken = async (id, role) => {
    try {
        const token = jwt.sign(
            { _id: id, role: role },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: process.env.JWT_EXPIRY,
            }
        );
        return token;
    } catch (error) {
        console.log(error);
    }
};
