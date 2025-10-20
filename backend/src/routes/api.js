const express = require('express');
const router = express.Router();


router.get('/me', (req, res) => {
if (!req.user) return res.status(401).json({ error: 'not authenticated' });
res.json({ user: req.user });
});


module.exports = router;
