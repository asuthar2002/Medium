import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateTokens } from '../utls/genrateTokens.js';
import User from '../models/user.js';
import { generateOtp } from '../utls/genrateOTP.js';
import { sendEmail } from '../utls/sendEmail.js';
dotenv.config();
import path from 'path';

export const googleCallback = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.redirect(process.env.CLIENT_URL + '/login?error=google_login_failed');
    }
    const token = jwt.sign({
        id: user.id,
        email: user.email,
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
};


export const sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    await sendEmail(email, 'Your OTP Code', `Your OTP code is: ${otp}`);

    res.json({ message: 'OTP sent to email' });
};


export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    console.log("Uploaded file info:", req.file);
    console.log(req.body)
    const { email, password, confirmPassword, firstName, lastName, adminInviteCode } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            if (!user.isEmailVerified) {
                const otp = generateOtp();
                user.otp = otp;
                await user.save();

                await sendEmail(email, 'Email Verification', `Your OTP is: ${otp}`);

                return res.status(200).json({ message: 'User exists but not verified. OTP resent.', status: 'otp_resent', email, });
            }

            return res.status(400).json({ message: 'User already exists.', status: 'exists_verified' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const profileImage = req.file ? `/uploads/profile/${path.basename(req.file.path)}` : null;
        const otp = generateOtp();
        let role = 'user';
        if (adminInviteCode && adminInviteCode === process.env.ADMIN_INVITE_CODE) {
            role = 'admin';
        }

        const newUser = await User.create({ email, password: hashedPassword, firstName, lastName, profileImage, otp, isEmailVerified: false, role, });
        const { accessToken, refreshToken } = generateTokens(newUser);
        newUser.refreshToken = refreshToken;
        await newUser.save();
        await sendEmail(email, 'Email Verification', `Your OTP is: ${otp}`);
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "Strict", maxAge: 7 * 24 * 60 * 60 * 1000 });

        return res.status(201).json({ message: 'Registration successful. OTP sent to email.', email: newUser.email, status: 'otp_sent', accessToken, });
    } catch (err) {
        console.error('Register Error:', err);
        return res.status(500).json({ message: 'Server error during registration.' });
    }
};


export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.otp || !user.otpExpiresAt) return res.status(400).json({ message: 'No OTP requested' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();
    res.json({ message: 'OTP verified' });
};


export const resetPassword = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and new password are required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ message: 'Password reset successful' });
};


export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isEmailVerified)
            return res.status(401).json({ message: 'Email not verified', status: "verify_email" });

        if (user.isSuspended)
            return res.status(403).json({ message: 'Account suspended. Contact support.' });


        const { accessToken, refreshToken } = generateTokens(user)
        const { password: _password, refreshToken: _refreshToken, ...safeUser } = user.toJSON();
        res.json({ accessToken, user: safeUser });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }
};


export const requestPasswordReset = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Email not found' });

        const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        await sendEmail(email, 'Reset Password', `Reset your password using this link: ${resetUrl}`);
        res.json({ message: 'Reset link sent to email.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const fetchUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access token missing or malformed' });
        }

        const token = authHeader.split(' ')[1];
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password', 'otp', 'refreshToken', 'otpExpiresAt'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user: user.dataValues });
    } catch (err) {
        console.error('Fetch User Error:', err.message);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access token expired' });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid access token' });
        }

        res.status(500).json({ message: 'Failed to fetch user' });
    }
};


export const refreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;

        if (!cookies?.refreshToken) {
            return res.status(401).json({ message: "Refresh token not found" });
        }

        const refreshToken = cookies.refreshToken;

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired refresh token" });
            }

            const user = await User.findByPk(decoded.id);
            if (!user || user.refreshToken !== refreshToken) {
                return res.status(403).json({ message: "User not found or token mismatch" });
            }

            const newAccessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });

            const newRefreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

            user.refreshToken = newRefreshToken;
            await user.save();

            res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "Strict", maxAge: 7 * 24 * 60 * 60 * 1000, });

            return res.json({ accessToken: newAccessToken, });
        });
    } catch (err) {
        console.error("Refresh token error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};