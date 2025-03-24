import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import User from '../models/UserModel.js';
import RefreshToken from '../models/RefreshTokenModel.js';
import House from '../models/HouseModel.js';
import Role from '../models/RoleModel.js';
import UserHouse from '../models/UserHouseModel.js';

const generateTokens = async (userId) => {
  const accessToken = jwt.sign(
    { user_id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { user_id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  await RefreshToken.create(userId, refreshToken);
  return { accessToken, refreshToken };
};

export const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await User.findByEmail(email);
    if (existingUser) return res.status(400).send('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.create(email, hashedPassword, name);

    // Check if this is the first user
    const houseCount = await House.count();
    if (houseCount === 0) {
      // Create initial house with default name
      const houseId = await House.create(userId, 'My Smart Home', 'UTC');
      
      // Create default roles
      await Role.createDefaultRoles(houseId);
      
      // Get Admin role
      const adminRole = await Role.getByName(houseId, 'Admin');
      
      // Assign admin role to user
      await UserHouse.assign(userId, houseId, adminRole.role_id);
    }

    res.status(201).json({ userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).send('Invalid credentials');

    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) return res.status(401).send('Invalid credentials');

    if (user.mfa_secret && user.roles.includes('Admin')) {
      return res.status(202).json({ 
        mfaRequired: true,
        tempToken: jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '5m' })
      });
    }

    const tokens = await generateTokens(user.user_id);
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyMFA = async (req, res) => {
  try {
    const { code, tempToken } = req.body;
    
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user_id);

    const verified = speakeasy.totp.verify({
      secret: user.mfa_secret,
      encoding: 'base32',
      token: code,
      window: 1
    });

    if (!verified) return res.status(401).send('Invalid code');

    const tokens = await generateTokens(user.user_id);
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) return res.status(401).send('Refresh token required');

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const validToken = await RefreshToken.findValidToken(decoded.user_id, refreshToken);

    if (!validToken) return res.status(401).send('Invalid refresh token');

    const accessToken = jwt.sign(
      { user_id: decoded.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (err) {
    res.status(401).send('Invalid refresh token');
  }
};