const roleBasedAccess = (requiredRole) => {
  return (req, res, next) => {
    // Check if the user object is present in the request (it should be set by the authentication middleware)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the user has the required role (designation)
    if (req.user.designation !== requiredRole) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    // If the user has the required role, proceed to the next middleware
    next();
  };
};

export default roleBasedAccess;
