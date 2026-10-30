const User = require("../model/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const OTP_VALID_MINUTES = 10;

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email and password' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + OTP_VALID_MINUTES * 60 * 1000);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiry
        });

        if (user) {
            const message = `Welcome to ShopNest, ${name}!

Your OTP to verify your account is: ${otp}
This code will expire in ${OTP_VALID_MINUTES} minutes.`;

            try {
                await sendEmail(email, 'Verify your ShopNest account', message);
            } catch (emailErr) {
                console.error('OTP email failed to send:', emailErr.message);
            }

            // No login token yet — account must be verified first.
            res.status(201).json({
                message: 'Registered successfully. Please check your email for the OTP to verify your account.',
                email: user.email
            });
        } else {
            res.status(400).json({ message: 'Invalid user Data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.verified) {
            return res.status(400).json({ message: 'Account is already verified' });
        }
        if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
        }
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        user.verified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const resendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.verified) {
            return res.status(400).json({ message: 'Account is already verified' });
        }

        const otp = generateOtp();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + OTP_VALID_MINUTES * 60 * 1000);
        await user.save();

        const message = `Your new OTP for ShopNest is: ${otp}
This code will expire in ${OTP_VALID_MINUTES} minutes.`;
        await sendEmail(email, 'Your new ShopNest OTP', message);

        res.status(200).json({ message: 'A new OTP has been sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login_User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        needsVerification: true,
        email: user.email
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -otp -otpExpiry');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    registerUser,
    verifyOtp,
    resendOtp,
    loginUser,
    getUsers
};
