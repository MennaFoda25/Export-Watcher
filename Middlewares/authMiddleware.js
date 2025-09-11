import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import initDB from '../db.js'

// Protect routes (authentication)
export const protect = asyncHandler(async (req, res, next) => {
 const db = await initDB()
  let token;

  // 1) Check if token exists and extract it
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError("You are not logged in. Please login to access this route.", 401)
    );
  }

  // 2) Verify token
  let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

if(!decoded){
    return next(new ApiError("Not authorized, token failed", 401));

}

  console.log("Decoded token:", decoded);

  // 3) Check if user exists in SQLite DB
 const currentUser = await db.get(
  "SELECT * FROM users WHERE id = ?", 
  [decoded.userId]
);
console.log("Current user from DB:", currentUser);

  if (!currentUser) {
    return next(
      new ApiError("The user belonging to this token no longer exists", 401)
    );
  }

  req.user = currentUser; // attach user to request
  next();
});


