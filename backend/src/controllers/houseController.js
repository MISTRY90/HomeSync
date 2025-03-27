import { createHouse, deleteHouse} from '../models/HouseModel.js';
import pool from '../config/db.js';

export const createHouseController = async (req, res) => {
    const { name, description, timezone = 'UTC' } = req.body;
    const userId = req.user.userId;

    try {
        const houseId = await createHouse(userId, name, description, timezone);
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

export const deleteHouseController = async (req, res) => {
    const { houseId } = req.params;
    const userId = req.user.userId; // comes from authenticate middleware
  
    try {
      const affectedRows = await deleteHouse(houseId, userId);
      if (affectedRows === 0) {
        return res.status(404).json({ error: 'House not found or unauthorized' });
      }
      res.json({ message: 'House deleted successfully' });
    } catch (error) {
      console.error('House deletion error:', error);
      res.status(500).json({ error: 'Failed to delete house' });
    }
  };