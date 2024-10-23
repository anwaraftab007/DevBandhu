import express from 'express'
import jwt from 'jsonwebtoken'
const router = express.Router(); 

router.get('/auth/check', (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ isLoggedIn: false });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ isLoggedIn: false });
    }
    res.status(200).json({ isLoggedIn: true });
  });
});

export default router;
