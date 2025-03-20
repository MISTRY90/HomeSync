import User from '../models/User.js';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export default {
  // User registration
  async register(req, res) {
    try {
      const { email, password, name } = req.body;
      await User.create({ email, password, name });
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // User login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);
      
      if (!user || !(await User.verifyPassword(user, password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if admin requires MFA
      if (user.mfa_secret) {
        return res.status(202).json({ mfaRequired: true });
      }

      const tokens = User.generateTokens(user);
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Refresh access token
  async refreshToken(req, res) {
    const { refreshToken } = req.body;
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);
      const newTokens = User.generateTokens(user);
      res.json(newTokens);
    } catch (error) {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  },

  // Enable MFA for admin
  async enableMFA(req, res) {
    try {
      const secret = speakeasy.generateSecret({ name: 'Smart Home Admin' });
      await User.enableMFA(req.user.userId, secret.base32);
      
      QRCode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
        res.json({ secret: secret.base32, qrCode: dataUrl });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Verify MFA code
  async verifyMFA(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      const verified = speakeasy.totp.verify({
        secret: user.mfa_secret,
        encoding: 'base32',
        token: req.body.code
      });

      if (!verified) throw new Error('Invalid MFA code');
      
      const tokens = User.generateTokens(user);
      res.json(tokens);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
};