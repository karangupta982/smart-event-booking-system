const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("../configuration/database");

exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      contact,
      
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !contact
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    const existingUser = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log("existingUser", existingUser);
    if (existingUser.length > 0 && existingUser[0].email === email) {
      return res.status(400).json({ success: false, message: "User already exists. Please sign in to continue." });
    }

  
    let role = 'User';
    const { adminKey } = req.body;
    
   
    if (adminKey === process.env.ADMIN_SIGNUP_KEY) {
      role = 'Admin';
    }
   
    
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (name, email, password_hash, contact, role) VALUES (?, ?, ?, ?, ?)', [name, email, hash, contact, role]);

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};


exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: `Please fill all required fields`,
        });
      }
  
    
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  
      if (!rows.length) {
        return res.status(401).json({
          success: false,
          message: `User not registered. Please sign up to continue.`,
        });
      }
  
      const user = rows[0]; 
  
      
      const isMatch = await bcrypt.compare(password, user.password_hash);
  
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: `Password is incorrect`,
        });
      }
  
     
      const token = jwt.sign(
        { email: user.email, id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      
      await pool.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

     
      delete user.password_hash;

      
      const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        httpOnly: true,
      };
  
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User login success`,
      });
  
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: `Login failure. Please try again.`,
      });
    }
  };
  


