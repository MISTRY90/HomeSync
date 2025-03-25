import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

const generateMfaSecret = (email) => {
    return speakeasy.generateSecret({
        name: `SmartHome:${email}`
    });
};

const verifyMfaCode = (secret, token) => {
    return speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: 2
    });
};

const generateQRCode = async (secret) => {
    return QRCode.toDataURL(secret.otpauth_url);
};

export { generateMfaSecret, verifyMfaCode, generateQRCode };