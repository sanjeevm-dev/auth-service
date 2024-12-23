const roleBasedAccess = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.designation !== requiredRole) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};

export default roleBasedAccess;
