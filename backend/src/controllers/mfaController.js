import pool from '../config/db.js';
import { generateMfaSecret, generateQRCode, verifyMfaCode } from '../utils/otp.js';

export const setupMfa = async (req, res) => {
    const { userId } = req.user;

    try {
        // Verify user is admin of at least one house
        const [houses] = await pool.query(
            'SELECT house_id FROM House WHERE admin_user_id = ?',
            [userId]
        );

        if (houses.length === 0) {
            return res.status(403).json({ 
                error: 'MFA setup is only available for house admins' 
            });
        }

        // Generate MFA secret
        const [users] = await pool.query(
            'SELECT email FROM User WHERE user_id = ?',
            [userId]
        );
        const user = users[0];
        
        const secret = generateMfaSecret(user.email);
        const qrCode = await generateQRCode(secret);

        res.json({ 
            secret: secret.base32,
            qrCode,
            manualEntryCode: `otpauth://totp/SmartHome:${user.email}?secret=${secret.base32}&issuer=SmartHome`
        });

    } catch (error) {
        console.error('MFA setup error:', error);
        res.status(500).json({ error: 'Failed to setup MFA' });
    }
};

export const verifyMfa = async (req, res) => {
    const { userId } = req.user;
    const { token, secret } = req.body;

    try {
        // Verify admin status again (security redundancy)
        const [houses] = await pool.query(
            'SELECT house_id FROM House WHERE admin_user_id = ?',
            [userId]
        );

        if (houses.length === 0) {
            return res.status(403).json({ 
                error: 'MFA verification requires admin privileges' 
            });
        }

        // Verify token
        if (!verifyMfaCode(secret, token)) {
            return res.status(400).json({ error: 'Invalid MFA code' });
        }

        // Store secret
        await pool.query(
            'UPDATE User SET mfa_secret = ? WHERE user_id = ?',
            [secret, userId]
        );

        res.json({ 
            message: 'MFA enabled successfully',
            recoveryCodes: ['A1B2-C3D4', 'E5F6-G7H8'] // Optional: Add recovery codes
        });

    } catch (error) {
        console.error('MFA verification error:', error);
        res.status(500).json({ error: 'MFA verification failed' });
    }
};