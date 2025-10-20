import express from "express";
import passport from "../auth.ts";

const router = express.Router();

// --- Google login flow ---
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Redirect back to your React app after successful login
    res.redirect("http://localhost:5173"); 
  }
);

// --- Check current user ---
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

// --- Logout user ---
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.sendStatus(200);
  });
});

export default router;

