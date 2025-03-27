import { createRoom,deleteRoom } from '../models/RoomModel.js';
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

export const deleteRoomController = async (req, res) => {
    const { houseId, roomId } = req.params;
    // Admin verification is done by middleware (isHouseAdmin)
    try {
      const affectedRows = await deleteRoom(roomId, houseId);
      if (affectedRows === 0) {
        return res.status(404).json({ error: 'Room not found or unauthorized' });
      }
      res.json({ message: 'Room deleted successfully' });
    } catch (error) {
      console.error('Room deletion error:', error);
      res.status(500).json({ error: 'Failed to delete room' });
    }
  };