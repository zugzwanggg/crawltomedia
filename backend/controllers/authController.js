import { db } from "../db.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import validator from "validator";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
})

const JWT_SECRET = process.env.JWT_SECRET || "dev-pass";

export const login = async (req,res) => {
  try {
    const { user, password } = req.body;

    if (!user || !password) {
      return res.status(400).json({
        message: "Fields cannot be empty!"
      })
    }

    const userData = await db.query("SELECT * FROM users WHERE username = $1 OR email = $1", [user]);

    if (userData.rows.length === 0) {
      return res.status(401).json({
        message: "Incorrect password or email/username"
      })
    }

    const checkPassword = await bcryptjs.compare(password, userData.rows[0].password);

    if (!checkPassword) {
      return res.status(401).json({
        message: "Incorrect password or email/username"
      })
    }

    const payload = {
      id: userData.rows[0].id,
      username:  userData.rows[0].username,
      email:  userData.rows[0].email,
      user_pic:  userData.rows[0].user_pic
    }

    const token = jwt.sign(payload, JWT_SECRET);
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sevenDays
    });

    res.status(200).json({
      message: "Succesfully logged in"
    });

  } catch (error) {
    console.log("Error at login: " + error);
    res.status(500).send(error);
  }
}


export const register = async (req,res) => {
  try {
    const {username, email, password, repPassword, privacy} = req.body;

    if (!privacy) {
      return res.status(400).json({
        message: "Agree to our privacy policy terms!"
      })
    }

    if (!username || !email || !password || !repPassword) {
      return res.status(400).json({
        message: "Fill all the fiels!"
      })
    }

    if (password !== repPassword) {
      return res.status(400).json({
        message: "Passwords are not matching"
      })
    }

    const checkName = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    const checkEmail = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (checkName.rows.length !== 0) {
      return res.status(400).json({
        message: "User with this username already exists."
      })
    }
    if (checkEmail.rows.length !== 0) {
      return res.status(400).json({
        message: "User already exists."
      })
    }

    const isPasswordStrong = validator.isStrongPassword(password, {
      minLength: 10,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })

    if (!isPasswordStrong) {
      return res.status(400).json({
        message: "Weak password"
      })
    }

    const genSalt = await bcryptjs.genSalt();
    const passwordHash = await bcryptjs.hash(password, genSalt);


    const newUser = await db.query("INSERT INTO users (username, email, password) VALUES($1, $2, $3) RETURNING *", [username, email, passwordHash]);
    const userId =  newUser.rows[0].id
    sendOtpRequest({id: userId, email}, res);

  } catch (error) {
    console.log("Error at register: " + error);
    res.status(500).send(error);
  }
}

export const isAuthenticated = async (req,res) => {
  try {
    
    const {token} = req.cookies;

    if (!token) return res.status(403).json({
      isLogged: false
    })

    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({user: decoded, isLogged: true})
    
  } catch (error) {
    console.log("Error at register: " + error);
    res.status(500).send(error);
  }
}


export const logout = async (req,res) => {
    res.cookie("token", "", {
      httpOnly: true,
      expiresIn: new Date(0)
    }).send()
}

function generateOtp() {
  const digits = "1234567890";
  let OTP = "";
  
  for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * digits.length)];
  }
  return OTP
}

const sendOtpRequest = async ({id, email}, res) => {
  const otp = generateOtp();
  try {

    if (!id || !email) {
      return res.status(400).json({
        message: "Empty fields"
      })
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Crawltomedia",
      html: `<p>Verify your email by using this code <b>${otp}</b></p>`
    }

    const salt = 10
    const otpHash = await bcryptjs.hash(otp, salt);

    await db.query('INSERT INTO email_verifications (user_id, email, otp) VALUES ($1,$2,$3)', [id, email, otpHash]);
    await transport.sendMail(mailOptions);

    res.status(200).json({
      message: "Succesfully sent",
      user: {
        id,
        email
      }
    })
    
  } catch (error) {
    console.log("Error at sendOtpRequest: " + error);
    res.status(500).send(error);
  }
}

export const verifyOtp = async (req,res) => {
  try {

    const {otp, user_id} = req.body;

    if (!otp) {
      return res.status(400).json({
        message: "Empty otp code"
      })
    }

    const verificationData = await db.query("SELECT * from email_verifications WHERE user_id = $1", [user_id]);

    if (verificationData.rows.length <= 0) {
      return res.status(400).json({
        message: "Current user doesn't have verification code sent to email"
      })
    }

    const otpVerificatonData = verificationData.rows[0].otp;
    const expireVerificationData = verificationData.rows[0].expires_at;

    if (new Date(expireVerificationData).getTime() < Date.now()) {
      await db.query("DELETE FROM email_verifications WHERE user_id = $1", [user_id]);
      return res.status(400).json({
        message: "Email verification has expired"
      })
    }

    const compareOtps = await bcryptjs.compare(otp, otpVerificatonData);

    if (!compareOtps) {
      return res.status(400).json({
        message: "Incorrect code"
      })
    }
    
    const user = await db.query("UPDATE users SET verified = true WHERE id = $1 RETURNING id, username, email, user_pic", [user_id]);
    await db.query("DELETE FROM email_verifications WHERE user_id = $1", [user_id])

    const payload = user.rows[0];

    const token = jwt.sign(payload, JWT_SECRET);
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sevenDays
    })

    res.status(200).json({
      message: "Succesfully confirmed email"
    })
    
  } catch (error) {
    console.log("Error at verifyOtp: " + error);
    res.status(500).send(error);
  }
}

export const resendOtp = async (req,res) => {
  try {

    const {user_id, email} = req.body;
    
    if (!user_id || !email) {
      return res.status(400).json({
        message: "Empty user fields are not allowed"
      })
    }
    await db.query("DELETE FROM email_verifications WHERE user_id = $1", [user_id]);

    sendOtpRequest({id: user_id, email}, res);

  } catch (error) {
    console.log("Error at resendOtp: " + error);
    res.status(500).send(error);
  }
}

export const resetPassword = async (req,res) => {
  try {
    const {email} = req.body;

    const getUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (getUser.rows.length === 0) {
      return res.status(403).json(
        {
          message: "User doesn't exist"
        }
      )
    }

    sendOtpRequest({id: getUser.rows[0].id, email}, res);
    
  } catch (error) {
    console.log("Error at reset password: " + error);
    res.status(500).send(error);
  }
}

export const changePassword = async (req,res) => {
  try {

    const {user_id, newPassword, repNewPassword} = req.body;

    if (!user_id || !newPassword || !repNewPassword) {
      return res.status(400).json({
        message: "Empty fields are not allowed"
      })
    }

    if (newPassword !== repNewPassword) {
      return res.status(400).json({
        message: "Passwords are not matching"
      })
    }

    const isPasswordStrong = validator.isStrongPassword(newPassword, {
      minLength: 10,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })

    if (!isPasswordStrong) {
      return res.status(400).json({
        message: "Weak password"
      })
    }

    const salt = await bcryptjs.genSalt();
    const hashedNewPassword = await bcryptjs.hash(newPassword, salt);

    await db.query('UPDATE users SET password = $2 WHERE id = $1', [user_id, hashedNewPassword]);

    res.status(200).json(
      {
        message: "Succesfully changed password"
      }
    )
    
    
  } catch (error) {
    console.log("Error at change password: " + error);
    res.status(500).send(error);
  }
}