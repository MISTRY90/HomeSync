import { createHouse } from '../models/HouseModel.js';
import pool from '../config/db.js';

export const createHouseController = async (req, res) => {
    const { name, description, timezone = 'UTC' } = req.body;
    const userId = req.user.userId;

    try {
        const houseId = await createHouse(userId, name, description, timezone);

        // Assign admin role automatically
        await pool.query(
            `INSERT INTO UserHouse (user_id, house_id, role_id)
            VALUES (?, ?, (SELECT role_id FROM Role WHERE house_id = ? AND name = 'Admin'))`,
            [userId, houseId, houseId]
        );

        res.status(201).json({
            message: 'House created successfully',
            houseId,
            adminUserId: userId
        });
    } catch (error) {
        console.error('House creation error:', error);
        res.status(500).json({ error: 'Failed to create house' });
    }
};