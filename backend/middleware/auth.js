const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();


exports.auth = async (req, res, next) => {
	try {
		
		let token = req.cookies?.token || req.body?.token;
		
		if (!token && req.header("Authorization")) {
			const authHeader = req.header("Authorization");
			if (authHeader && authHeader.startsWith("Bearer ")) {
				token = authHeader.replace("Bearer ", "");
			} else if (authHeader) {
				token = authHeader;
			}
		}

		if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}

		try {
			const decoded = await jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded;
			next();
		} catch (error) {
			return res
				.status(401)
				.json({ success: false, message: "Token is invalid or expired" });
		}
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: `Something Went Wrong While Validating the Token`,
		});
	}
};


function authorizeRoles(roles = []) {
  return (req, res, next) => {
    const userRole = req.user.role; 
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };
}

exports.authorizeRoles = authorizeRoles;

