import express from "express";
import passport from "../auth.js"; // note: .js not .ts in compiled dist
const router = express.Router();

// Step 1: Trigger Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Handle callback after Google login
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    console.log("✅ Google auth success:", req.user);
    // Redirect user back to frontend
    res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");
  }
);

// Step 3: Get current logged-in user
router.get("/user", (req, res) => {
  if (req.isAuthenticated?.()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

export default router;
