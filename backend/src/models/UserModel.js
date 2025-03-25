import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const createUser = async (email, password, name) => {
   const passwordHash = await bcrypt.hash(password, 10);
     const [result] = await pool.query(
       `INSERT INTO User (...) VALUES (...)`,
       [email, passwordHash, name]
     );
     return result.insertId;
   }

const verifyUser = async (verificationToken) => {
    const [result] = await pool.query(
        `UPDATE User 
        SET status = 'active', is_verified = TRUE, verification_token = NULL 
        WHERE verification_token = ?`,
        [verificationToken]
    );

    return result.affectedRows > 0;
};

export { createUser, verifyUser };