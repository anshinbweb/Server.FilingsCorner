const jwt = require("jsonwebtoken");
const SuperAdminMaster = require("../models/SuperAdminMaster");

exports.validateSuperAdmin = async (req, res, next) => {
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

        if (decoded.role !== "superadmin") {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const user = await SuperAdminMaster.findById(decoded._id);

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
