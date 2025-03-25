import { getHouseByAdmin } from '../models/HouseModel.js';

export const isHouseAdmin = async (req, res, next) => {
    const { houseId } = req.params;
    const userId = req.user.userId;

    const house = await getHouseByAdmin(userId);
    if (!house || house.house_id !== parseInt(houseId)) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};