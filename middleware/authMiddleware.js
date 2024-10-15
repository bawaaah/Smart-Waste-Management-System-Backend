const jwt = require("jsonwebtoken");
const JWT_SECRET = "1234"; // Use the same secret

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from the authorization header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = { id: decoded.id }; // Attach user ID to request object
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authMiddleware;
