import { createRoom } from '../models/RoomModel.js';
import { getHouseByIdAndAdmin } from '../models/HouseModel.js';

export const createRoomController = async (req, res) => {
    const { houseId } = req.params;
    const { name, size, energyConsumptionLimit } = req.body;
    const userId = req.user.userId;

    try {
        // Verify admin ownership
        const house = await getHouseByIdAndAdmin(userId, houseId);
        if (!house) {
            return res.status(403).json({ error: 'Only the house admin can create rooms' });
        }

        const roomId = await createRoom(houseId, name, size, energyConsumptionLimit);
        res.status(201).json({
            message: 'Room created successfully',
            roomId,
            houseId
        });
    } catch (error) {
        console.error('Room creation error:', error);
        res.status(500).json({ error: 'Failed to create room' });
    }
};