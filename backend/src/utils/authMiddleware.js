import jwt from "jsonwebtoken"; // Correct import

const authJWTMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token found" });
    }

    const token = authHeader.split(" ")[1]; // Assumes "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifies token
    req.user = decoded; // Attach decoded user info to the request
    next(); // Proceed to the next middleware
  } catch (error) {
    console.log("Session Expired");
    return res
      .status(403)
      .json({ message: "Invalid token", error: error.message });
  }
};

export default authJWTMiddleware;
