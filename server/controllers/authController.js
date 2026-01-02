import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodeMailer.js';

export const register =  async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({success: false, message: 'All fields are required' });
    }
    try {
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: newUser.email,
            subject: 'Welcome to Our Platform!',
            text: `Hello ${newUser.name},\n\nThank you for registering on our platform. We're excited to have you on board!\n\nBest regards,\nThe Team`
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ success: true, message: 'User registered successfully' });

    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({ success: true, message: 'Logged in successfully' });

    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

export const logout = async  (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.status(200).json({ success: true, message: 'Logged out successfully' });

    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

export const sendVerifyOtp = async (req, res) => {

    try {

        const  userId  = req.userId || req.body.userId;
        const user = await userModel.findById( userId );

        if (user.isAccounttVerified) {
            return res.json({ success: false, message: 'Account is already verified'});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyotpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Your Account Verification OTP',
            text: `Hello ${user.name},\nYour OTP for account verification is: ${otp}\nThis OTP is valid for 24 hours.\n\nBest regards,\nThe Team`
        }

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Verification OTP sent to your email!' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

    export const verifyEmail = async (req, res) => {
    const userId = req.userId; 
    const { otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: 'User ID and OTP are required.' });
    }

     try {

        const user = await userModel.findById(userId);

        if(!user) {
            return res.json({ success: false, message: 'User not found.' });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP.' });
        }

        if(user.verifyotpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyotpExpireAt = 0;

        await user.save();
        res.json({ success: true, message: 'Email verified successfully' });

    } catch (error) {
         res.json({ success: false, message: error.message });
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true, message: 'User is authenticated'});
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if(!email){
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    try {
        const user = await userModel.findOne({ email });

        if(!user){
            return res.json({ success: false, message: 'User not found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpiredAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset Otp',
            text: `Hello ${user.name},\nYour password reset otp is: ${otp}\nThis OTP is valid for 15 minutes.\n\nBest regards,\nThe Team`
        }

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: 'Password reset OTP sent to your email' });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if(!email || !otp || !newPassword){
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        const user = await userModel.findOne({ email });

        if(!user){
            return res.json({ success: false, message: 'User not found' });
        }

        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if(user.resetOtpExpiredAt < Date.now()){
            return res.json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiredAt = 0;
        await user.save();
        return res.json({ success: true, message: 'Password has been reset successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}