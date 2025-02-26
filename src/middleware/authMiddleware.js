import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1]; // Assuming Bearer token format
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user information to the request object
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

export default requireAuth;

