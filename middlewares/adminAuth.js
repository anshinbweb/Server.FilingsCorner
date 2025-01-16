const jwt = require("jsonwebtoken");
const CompanyDetails = require("../models/CompanyDetails");
// const AdminUsers = require("../models/Auth/User/AdminUsers");

exports.validateAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Not logged in" });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Not logged in" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await CompanyDetails.findById(decoded._id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        req.role = decoded.role;
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ error: "Invalid token" });
    }
    next();
};
